using KargoBackend.Data;
using KargoBackend.Entities;
using KargoBackend.Enums;
using KargoBackend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace KargoBackend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SupportController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SupportController(AppDbContext context) { _context = context; }

        // 1. KULLANICI: Yeni destek talebi oluşturur
        [HttpPost]
        public async Task<IActionResult> CreateTicket(CreateTicketDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var ticket = new SupportTicket
            {
                UserId = userId!,
                Subject = model.Subject,
                Category = model.Category,
                Message = model.Message,
                Status = TicketStatus.Open,
                CreatedAt = DateTime.Now
            };

            _context.SupportTickets.Add(ticket);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Talebiniz başarıyla iletildi.", ticketId = ticket.Id });
        }

        // 2. ADMIN: Tüm talepleri (Müşteri ve Cevaplayan Admin bilgisiyle) listeler
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<SupportTicketResponseDto>>> GetAllTickets()
        {
            var tickets = await _context.SupportTickets
                .Include(t => t.User)   // Talebi açan müşteri
                .Include(t => t.Admin)  // Cevaplayan admin (varsa)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new SupportTicketResponseDto
                {
                    Id = t.Id,
                    CustomerId = t.UserId,
                    CustomerFullName = t.User.FirstName + " " + t.User.LastName,
                    Subject = t.Subject,
                    Category = t.Category,
                    Message = t.Message,
                    Status = t.Status.ToString(),
                    CreatedAt = t.CreatedAt,
                    AdminReply = t.AdminReply,
                    AdminId = t.AdminId,
                    AdminFullName = t.Admin != null ? t.Admin.FirstName + " " + t.Admin.LastName : "Henüz Yanıtlanmadı",
                    RepliedAt = t.RepliedAt
                }).ToListAsync();

            return Ok(tickets);
        }

        // SupportController.cs - ReplyTicket Metodu
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/reply")]
        public async Task<IActionResult> ReplyTicket(int id, [FromBody] ReplyTicketDto model)
        {
            var ticket = await _context.SupportTickets.FindAsync(id);
            if (ticket == null) return NotFound();

            var currentAdminId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var adminName = User.FindFirstValue(ClaimTypes.Name) ?? "Admin"; // Token'dan admin adını al

            // --- KRİTİK NOKTA: Mesaj geçmişine admin cevabını ekle ---
            ticket.Message += $"\n\n[Destek Ekibi - {DateTime.Now:g}]: {model.ReplyMessage}";

            ticket.AdminReply = model.ReplyMessage; // Son cevabı yine burada tutabiliriz
            ticket.AdminId = currentAdminId;
            ticket.Status = TicketStatus.Replied;
            ticket.RepliedAt = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cevap iletildi." });
        }

        // 5. KULLANICI: Sorun çözülmediyse tekrar mesaj atar (Chatting başlangıcı)
        [HttpPatch("{id}/reopen")]
        public async Task<IActionResult> ReOpenTicket(int id, [FromBody] string newMessage)
        {
            var ticket = await _context.SupportTickets.FindAsync(id);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (ticket == null || ticket.UserId != userId) return Unauthorized();

            // Mevcut mesajın altına yeni mesajı ekliyoruz (Basit chat mantığı)
            ticket.Message += $"\n\n[Müşteri Ek Mesaj - {DateTime.Now:g}]: {newMessage}";
            ticket.Status = TicketStatus.Open; // Durumu tekrar "Açık" yapıyoruz ki admin görsün
            ticket.AdminReply = null; // Adminin tekrar cevap vermesi için eski cevabı silebilir veya saklayabiliriz

            await _context.SaveChangesAsync();
            return Ok(new { message = "Mesajınız iletildi, talep tekrar işleme alındı." });
        }

        // 4. KULLANICI: Sadece kendi geçmiş taleplerini listeler
        [HttpGet("my-tickets")]
        public async Task<ActionResult<IEnumerable<SupportTicketResponseDto>>> GetMyTickets()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var tickets = await _context.SupportTickets
                .Include(t => t.Admin)
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new SupportTicketResponseDto
                {
                    Id = t.Id,
                    Subject = t.Subject,
                    Category = t.Category,
                    Message = t.Message,
                    Status = t.Status.ToString(),
                    CreatedAt = t.CreatedAt,
                    AdminReply = t.AdminReply,
                    AdminFullName = t.Admin != null ? t.Admin.FirstName + " " + t.Admin.LastName : null,
                    RepliedAt = t.RepliedAt
                }).ToListAsync();

            return Ok(tickets);
        }
        // ADMIN: Talebi tamamen kapatır (Müşteri artık cevap yazamaz)
        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/close")]
        public async Task<IActionResult> CloseTicket(int id)
        {
            var ticket = await _context.SupportTickets.FindAsync(id);
            if (ticket == null) return NotFound("Bilet bulunamadı.");

            var currentAdminId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            ticket.Status = TicketStatus.Resolved; // Artık kesin çözüldü
            ticket.AdminId = currentAdminId; // Kapatan admini kaydet
                                             // İsteğe bağlı olarak biletin sonuna bir sistem mesajı eklenebilir
            ticket.AdminReply += "\n\n[Sistem]: Bu talep admin tarafından çözüldü olarak işaretlenmiştir.";

            await _context.SaveChangesAsync();
            return Ok(new { message = "Talep başarıyla kapatıldı." });
        }
    }
}