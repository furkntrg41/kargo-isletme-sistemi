using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KargoBackend.Data;
using KargoBackend.Enums;
using KargoBackend.Models;
using System.Linq;

namespace KargoBackend.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // 1. KPI Özet Verileri
        // GET: /api/dashboard/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            // Dinamik Ayarları Çek
            var settings = await _context.GlobalSettings.FirstOrDefaultAsync() ?? new GlobalSettings();

            // Bekleyenler
            var pendingCount = await _context.CargoRequests
                .CountAsync(c => c.Status == CargoStatus.Pending);

            // Toplam Araç / Aktif Araç
            var totalVehicles = await _context.Vehicles.CountAsync();
            var activeVehicles = await _context.Vehicles.CountAsync(v => v.IsActive);

            // Son Planlama Verileri
            var lastRun = await _context.PlanningRuns
                .OrderByDescending(p => p.PlanDate)
                .FirstOrDefaultAsync();

            double lastRunCost = lastRun?.TotalCost ?? 0;
            double efficiency = 0;

            if (lastRun != null && lastRun.TotalRouteCount > 0)
            {
                // Dinamik verimlilik hesabı: (Taşınan Yük / (Rota Sayısı * Ayarlardaki Kapasite))
                efficiency = (lastRun.TotalLoadKg / (lastRun.TotalRouteCount * settings.DefaultRentalCapacityKg)) * 100;
            }

            return Ok(new
            {
                PendingOrders = pendingCount,
                ActiveVehicles = activeVehicles,
                TotalVehicles = totalVehicles,
                LastCost = Math.Round(lastRunCost, 2),
                Efficiency = Math.Min(100, Math.Round(efficiency, 1)),
                CurrentCostPerKm = settings.CostPerKm
            });
        }

        // 2. Grafik: Son 7 Günlük Sipariş Hacmi
        // GET: /api/dashboard/weekly-activity
        [HttpGet("weekly-activity")]
        public async Task<IActionResult> GetWeeklyActivity()
        {
            var sevenDaysAgo = DateTime.Today.AddDays(-6);

            var rawData = await _context.CargoRequests
                .Where(c => c.CreatedAt >= sevenDaysAgo)
                .GroupBy(c => c.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Orders = g.Count(),
                    Completed = g.Count(x => x.Status == CargoStatus.Delivered)
                })
                .ToListAsync();

            var result = Enumerable.Range(0, 7).Select(offset =>
            {
                var date = sevenDaysAgo.AddDays(offset);
                var dayData = rawData.FirstOrDefault(d => d.Date == date);
                var dayName = date.ToString("ddd", new System.Globalization.CultureInfo("tr-TR"));

                return new
                {
                    Name = dayName,
                    Orders = dayData?.Orders ?? 0,
                    Completed = dayData?.Completed ?? 0
                };
            });

            return Ok(result);
        }

        // 3. Harita: Kargo Yoğunluk Noktaları (Heatmap)
        // GET: /api/dashboard/heatmap
        [HttpGet("heatmap")]
        public async Task<IActionResult> GetHeatmapData()
        {
            var locations = await _context.CargoRequests
                .Include(c => c.FromStation)
                .Where(c => c.Status == CargoStatus.Pending || c.Status == CargoStatus.Planned)
                .Where(c => c.FromStation != null)
                .Select(c => new
                {
                    Id = c.Id,
                    Lat = c.FromStation.Latitude,
                    Lng = c.FromStation.Longitude,
                    Weight = c.Weight,
                    Address = c.FromStation.Name
                })
                .ToListAsync();

            return Ok(locations);
        }

        // 4. Pasta Grafik: Durum Dağılımı
        // GET: /api/dashboard/status-distribution
        [HttpGet("status-distribution")]
        public async Task<IActionResult> GetStatusDistribution()
        {
            var data = await _context.CargoRequests
                .GroupBy(c => c.Status)
                .Select(g => new
                {
                    Name = g.Key.ToString(),
                    Value = g.Count()
                })
                .ToListAsync();

            return Ok(data);
        }

        // 5. Akıllı Uyarılar (Dinamik Ayarlara Bağlı)
        // GET: /api/dashboard/alerts
        [HttpGet("alerts")]
        public async Task<IActionResult> GetOperationalAlerts()
        {
            var alerts = new List<object>();
            var settings = await _context.GlobalSettings.FirstOrDefaultAsync() ?? new GlobalSettings();

            // KURAL 1: Kapasite Uyarısı
            var lastRunId = await _context.PlanningRuns
                .OrderByDescending(p => p.PlanDate)
                .Select(p => p.Id)
                .FirstOrDefaultAsync();

            if (lastRunId != 0)
            {
                var overloadedRoutes = await _context.DeliveryRoutes
                    .Include(r => r.Vehicle)
                    .Where(r => r.PlanningRunId == lastRunId)
                    .ToListAsync();

                foreach (var route in overloadedRoutes)
                {
                    double ratio = (route.TotalLoadKg / route.Vehicle.CapacityKg);
                    if (ratio > 0.90)
                    {
                        alerts.Add(new
                        {
                            Type = "warning",
                            Title = "Kapasite Sınırı",
                            Desc = $"{route.Vehicle.PlateNumber} plakalı araç %{Math.Round(ratio * 100)} doluluğa ulaştı.",
                            Time = "Güncel"
                        });
                    }
                }
            }

            // KURAL 2: Bekleyen İş Uyarısı (Ayarlardaki MaxStops kısıtına göre dinamik)
            var pendingCount = await _context.CargoRequests.CountAsync(c => c.Status == CargoStatus.Pending);
            if (pendingCount > (settings.MaxStopsPerRoute * 2))
            {
                alerts.Add(new
                {
                    Type = "error",
                    Title = "Biriken Siparişler",
                    Desc = $"Sırada bekleyen {pendingCount} adet kargo var. Mevcut rota limitlerinizi zorluyor.",
                    Time = "Şimdi"
                });
            }

            // KURAL 3: Eski Sipariş Uyarısı
            var oldOrderCount = await _context.CargoRequests
                .CountAsync(c => c.Status == CargoStatus.Pending && c.CreatedAt < DateTime.Now.AddDays(-2));

            if (oldOrderCount > 0)
            {
                alerts.Add(new
                {
                    Type = "warning",
                    Title = "Geciken Kargolar",
                    Desc = $"{oldOrderCount} adet kargo 48 saattir bekliyor.",
                    Time = "2 gün+"
                });
            }

            return Ok(alerts);
        }
    }
}