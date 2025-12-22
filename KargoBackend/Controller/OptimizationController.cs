using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KargoBackend.Data;
using KargoBackend.Models.DTOs;
using KargoBackend.Services;
using System.Security.Claims;
using KargoBackend.Enums;

namespace KargoBackend.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class OptimizationController : ControllerBase
    {
        private readonly OptimizationService _optimizationService;
        private readonly AppDbContext _context;

        public OptimizationController(OptimizationService optimizationService, AppDbContext context)
        {
            _optimizationService = optimizationService;
            _context = context;
        }

        // =========================================================================
        // 1. ANA PLANLAMA METODU (Run)
        // =========================================================================
        [HttpPost("run")]
        public async Task<IActionResult> Run(RunOptimizationDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            
            try
            {
                var resultPlan = await _optimizationService.RunOptimizationAsync(
                    model.PlanName, userId, model.Mode, model.Objective, model.IsSimulation
                );

                if (model.IsSimulation) return Ok(resultPlan);

                // Kullanıcıya ne olduğunu söyleyelim (Active mi oldu, Scheduled mı?)
                string message = resultPlan.Status == PlanStatus.Active 
                    ? "Operasyon hemen BAŞLATILDI." 
                    : "Mevcut bir operasyon olduğu için bu plan SIRAYA ALINDI (Scheduled).";

                return Ok(new 
                { 
                    message = message, 
                    runId = resultPlan.Id,
                    status = resultPlan.Status.ToString() // "Active" veya "Scheduled"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Hata: {ex.Message}" });
            }
        }

        // =========================================================================
        // 2. DASHBOARD İÇİN VERİ (AKILLI GETİRME) 🚀
        // =========================================================================
        [HttpGet("active")]
        public async Task<IActionResult> GetActivePlan()
        {
            // Önce AKTİF (Sahada olan) plan var mı diye bak
            var plan = await _context.PlanningRuns
                .Where(r => !r.IsSimulation && r.Status == PlanStatus.Active)
                .OrderByDescending(r => r.PlanDate)
                .Include(r => r.DeliveryRoutes).ThenInclude(dr => dr.Vehicle)
                .Include(r => r.DeliveryRoutes).ThenInclude(dr => dr.RouteStops).ThenInclude(rs => rs.Station)
                .Include(r => r.DeliveryRoutes).ThenInclude(dr => dr.CargoRequests)
                .FirstOrDefaultAsync();

            // Eğer Aktif yoksa, SIRADAKİ (Scheduled) planı getir
            if (plan == null)
            {
                plan = await _context.PlanningRuns
                    .Where(r => !r.IsSimulation && r.Status == PlanStatus.Scheduled)
                    .OrderBy(r => r.PlanDate) // En eski sıradakini getir (Sıraya ilk giren)
                    .Include(r => r.DeliveryRoutes).ThenInclude(dr => dr.Vehicle)
                    .Include(r => r.DeliveryRoutes).ThenInclude(dr => dr.RouteStops).ThenInclude(rs => rs.Station)
                    .Include(r => r.DeliveryRoutes).ThenInclude(dr => dr.CargoRequests)
                    .FirstOrDefaultAsync();
            }

            if (plan == null) return NoContent();

            return Ok(plan);
        }

        // =========================================================================
        // 3. SIRADAKİ PLANI BAŞLAT (Scheduled -> Active)
        // =========================================================================
        [HttpPost("start-scheduled/{runId}")]
        public async Task<IActionResult> StartScheduledRun(int runId)
        {
            // Güvenlik: Hala çalışan başka bir plan var mı?
            var hasActive = await _context.PlanningRuns.AnyAsync(p => p.Status == PlanStatus.Active);
            if (hasActive) 
                return BadRequest(new { message = "Hala devam eden bir operasyon var! Önce onu tamamlayın." });

            var run = await _context.PlanningRuns.FindAsync(runId);
            if (run == null) return NotFound("Plan bulunamadı.");

            run.Status = PlanStatus.Active; // Statüyü değiştir
            run.PlanDate = DateTime.Now;    // Başlangıç saatini güncelle (Şimdi başlıyor)
            
            await _context.SaveChangesAsync();
            return Ok(new { message = "Bekleyen plan devreye alındı. Araçlar yola çıkıyor!" });
        }

        // =========================================================================
        // 4. OPERASYONU TAMAMLA (Active -> Completed)
        // =========================================================================
        [HttpPost("complete/{runId}")]
        public async Task<IActionResult> CompleteRun(int runId)
        {
            var run = await _context.PlanningRuns
                .Include(r => r.DeliveryRoutes).ThenInclude(dr => dr.CargoRequests)
                .FirstOrDefaultAsync(r => r.Id == runId);

            if (run == null) return NotFound("Plan bulunamadı.");

            // Statüleri Güncelle
            run.Status = PlanStatus.Completed;

            foreach (var route in run.DeliveryRoutes)
            {
                if (route.CargoRequests != null)
                {
                    foreach (var cargo in route.CargoRequests)
                    {
                        cargo.Status = CargoStatus.Delivered; // Kargolar teslim edildi
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Operasyon tamamlandı." });
        }

        // =========================================================================
        // 5. RAPORLAMA VE TEMİZLİK
        // =========================================================================

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory()
        {
            var history = await _context.PlanningRuns
                // Sadece bitmiş veya iptal edilmişleri getir (Active/Scheduled gelmesin)
                .Where(r => !r.IsSimulation && (r.Status == PlanStatus.Completed || r.Status == PlanStatus.Cancelled))
                .OrderByDescending(x => x.PlanDate)
                .ToListAsync();
            return Ok(history);
        }

        [HttpGet("run-details/{runId}")]
        public async Task<IActionResult> GetRunDetails(int runId)
        {
            var run = await _context.PlanningRuns
                .Include(r => r.DeliveryRoutes).ThenInclude(dr => dr.Vehicle)
                .Include(r => r.DeliveryRoutes).ThenInclude(dr => dr.RouteStops).ThenInclude(rs => rs.Station)
                .Include(r => r.DeliveryRoutes).ThenInclude(dr => dr.CargoRequests)
                .FirstOrDefaultAsync(r => r.Id == runId);

            if (run == null) return NotFound();
            return Ok(run);
        }

        [HttpDelete("delete-run/{runId}")]
        public async Task<IActionResult> DeleteRun(int runId)
        {
            var run = await _context.PlanningRuns
                .Include(r => r.DeliveryRoutes).ThenInclude(dr => dr.CargoRequests)
                .FirstOrDefaultAsync(r => r.Id == runId);

            if (run == null) return NotFound();

            // Eğer Active veya Scheduled bir plan siliniyorsa kargoları havuza geri at
            if (run.Status == PlanStatus.Active || run.Status == PlanStatus.Scheduled)
            {
                foreach (var route in run.DeliveryRoutes)
                {
                    if(route.CargoRequests != null)
                    {
                        foreach(var cargo in route.CargoRequests)
                        {
                            cargo.Status = CargoStatus.Pending;
                            cargo.AssignedDeliveryRouteId = null;
                        }
                    }
                }
            }

            _context.PlanningRuns.Remove(run);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Plan silindi." });
        }
        
    }
}