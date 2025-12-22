using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using KargoBackend.Data;
using KargoBackend.Entities;
using KargoBackend.Models.DTOs;
using KargoBackend.Enums;

namespace KargoBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CargoRequestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CargoRequestController(AppDbContext context)
        {
            _context = context;
        }

        // KULLANICI: Yeni kargo talebi oluşturur (Nereden -> Nereye)
        [HttpPost]
        public async Task<IActionResult> CreateRequest(CreateCargoRequestDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            // 1. Validasyon: Çıkış istasyonu var mı?
            var fromStation = await _context.Stations.FindAsync(model.FromStationId);
            if (fromStation == null) return BadRequest("Geçersiz çıkış istasyonu (FromStation).");

            // 2. Validasyon: Varış istasyonu var mı?
            var toStation = await _context.Stations.FindAsync(model.ToStationId);
            if (toStation == null) return BadRequest("Geçersiz varış istasyonu (ToStation).");
            if (toStation.Id != 1)
                return BadRequest("Varış istasyonu sadece 'Merkez Depo' olabilir.");
            // 3. Mantıksal Kontrol: Aynı yere kargo gönderilemez
            if (model.FromStationId == model.ToStationId)
                return BadRequest("Çıkış ve varış istasyonları aynı olamaz.");

            var request = new CargoRequest
            {
                FromStationId = model.FromStationId,
                ToStationId = model.ToStationId,
                Quantity = model.Quantity,
                Weight = model.Weight,
                UserId = userId!,
                RequestedDate = DateTime.Now,
                Status = CargoStatus.Pending 
            };

            _context.CargoRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Kargo talebi başarıyla oluşturuldu.", id = request.Id });
        }

        // KULLANICI: Sadece kendi kargolarını listeler
        [HttpGet("my-requests")]
        public async Task<ActionResult<IEnumerable<CargoRequestResponseDto>>> GetMyRequests()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // FromStation ve ToStation tablolarını Join (Include) ediyoruz
            var requests = await _context.CargoRequests
                .Include(r => r.FromStation)
                .Include(r => r.ToStation)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.RequestedDate)
                .Select(r => new CargoRequestResponseDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    
                    // Çıkış Bilgileri
                    FromStationId = r.FromStationId,
                    FromStationName = r.FromStation.Name,

                    // Varış Bilgileri
                    ToStationId = r.ToStationId,
                    ToStationName = r.ToStation.Name,

                    Quantity = r.Quantity,
                    Weight = r.Weight,
                    RequestedDate = r.RequestedDate,
                    Status = r.Status.ToString(),
                    RejectionReason = r.RejectionReason,
                    AssignedDeliveryRouteId = r.AssignedDeliveryRouteId
                }).ToListAsync();

            return Ok(requests);
        }

        // ADMIN: Sistemdeki tüm kargoları görür (Planlama ekranı için)
        [Authorize(Roles = "Admin")]
        [HttpGet("all-requests")]
        public async Task<ActionResult<IEnumerable<CargoRequestResponseDto>>> GetAllRequests()
        {
            var requests = await _context.CargoRequests
                .Include(r => r.FromStation)
                .Include(r => r.ToStation)
                .Include(r => r.User) // Admin kullanıcının adını da görmek ister
                .OrderByDescending(r => r.RequestedDate)
                .Select(r => new CargoRequestResponseDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    UserName = r.User.UserName, // Talep eden kullanıcı
                    
                    // Çıkış Bilgileri
                    FromStationId = r.FromStationId,
                    FromStationName = r.FromStation.Name,

                    // Varış Bilgileri
                    ToStationId = r.ToStationId,
                    ToStationName = r.ToStation.Name,

                    Quantity = r.Quantity,
                    Weight = r.Weight,
                    RequestedDate = r.RequestedDate,
                    Status = r.Status.ToString(),
                    RejectionReason = r.RejectionReason,
                    AssignedDeliveryRouteId = r.AssignedDeliveryRouteId
                }).ToListAsync();

            return Ok(requests);
        }

        // ADMIN: Talebi onayla/reddet veya durumunu değiştir
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateCargoRequestStatusDto model)
        {
            var request = await _context.CargoRequests.FindAsync(id);
            if (request == null) return NotFound("Kargo talebi bulunamadı.");

            request.Status = model.Status;
            
            // Eğer reddediliyorsa sebebi kaydet
            if(model.Status == CargoStatus.Rejected)
            {
                request.RejectionReason = model.RejectionReason;
            }
            else
            {
                // Reddedilmediyse sebebi temizle (örn: yanlışlıkla red verildiyse düzeltirken)
                request.RejectionReason = null;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"Kargo durumu {model.Status} olarak güncellendi." });
        }
        
        // ÖZET BİLGİ (DASHBOARD İÇİN): Hangi şubede kaç kargo bekliyor?
        [Authorize(Roles = "Admin")]
        [HttpGet("pending-summary")]
        public async Task<IActionResult> GetPendingSummary()
        {
            var summary = await _context.CargoRequests
                .Where(r => r.Status == CargoStatus.Pending)
                .GroupBy(r => r.FromStation.Name) // Çıkış şubesine göre grupla
                .Select(g => new 
                {
                    StationName = g.Key,
                    TotalCount = g.Count(),
                    TotalWeight = g.Sum(x => x.Weight)
                })
                .ToListAsync();

            return Ok(summary);
        }
    }
}