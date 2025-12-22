using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KargoBackend.Data;
using KargoBackend.Enums;

namespace KargoBackend.Controllers
{
    [Authorize] // Hem Admin hem kurye rolü erişebilir
    [ApiController]
    [Route("api/[controller]")]
    public class DeliveryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DeliveryController(AppDbContext context)
        {
            _context = context;
        }

        // Kargo durumunu güncelleme (Kurye kullanımı için)
        [HttpPatch("update-status/{cargoId}")]
        public async Task<IActionResult> UpdateCargoStatus(int cargoId, CargoStatus newStatus)
        {
            var cargo = await _context.CargoRequests.FindAsync(cargoId);
            
            if (cargo == null) return NotFound("Kargo talebi bulunamadı.");

            if (cargo.Status == CargoStatus.Cancelled)
                return BadRequest("İptal edilmiş kargo üzerinde işlem yapılamaz.");

            cargo.Status = newStatus;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Kargo durumu {newStatus} olarak güncellendi." });
        }
        // BU METOT ARAÇ UMUTTEPE'YE (DEPOYA) GERİ DÖNDÜĞÜNDE ÇAĞRILACAK
    // GET /api/delivery/finish-route/{deliveryRouteId}
    [HttpPost("finish-route/{deliveryRouteId}")]
    public async Task<IActionResult> FinishRoute(int deliveryRouteId)
    {
        // 1. Bu rotaya atanmış ve henüz teslim edilmemiş tüm kargoları bul
        // (Çünkü hepsi toplanıp Umuttepe'ye getirildi)
        var cargoOnTruck = await _context.CargoRequests
            .Where(c => c.AssignedDeliveryRouteId == deliveryRouteId && 
                        c.Status == CargoStatus.Planned)
            .ToListAsync();

        if (!cargoOnTruck.Any())
        {
            return Ok(new { message = "Bu rotada teslim edilecek aktif yük bulunamadı veya zaten teslim edilmiş." });
        }

        // 2. Hepsini "Delivered" (Teslim Edildi) yap
        foreach (var cargo in cargoOnTruck)
        {
            cargo.Status = CargoStatus.Delivered;
            // İstersen burada "DeliveredAt" tarihi de tutabilirsin
        }

        // 3. Rotanın kendisini de "Tamamlandı" olarak işaretleyebiliriz (Opsiyonel)
        // Eğer DeliveryRoute tablosunda 'IsCompleted' alanı varsa onu da true yap.

        await _context.SaveChangesAsync();

        return Ok(new 
        { 
            message = $"Rota tamamlandı. Toplanan {cargoOnTruck.Count} adet kargo Umuttepe deposuna başarıyla indirildi.", 
            deliveredCount = cargoOnTruck.Count 
        });
    }
    }
}