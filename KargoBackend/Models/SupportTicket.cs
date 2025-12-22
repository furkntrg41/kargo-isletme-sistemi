using KargoBackend.Identity;
using KargoBackend.Enums; // TicketStatus enum'ının burada olduğunu varsayıyorum
using System.ComponentModel.DataAnnotations.Schema;

namespace KargoBackend.Entities
{
    public class SupportTicket
    {
        public int Id { get; set; }

        // --- TALEBİ AÇAN MÜŞTERİ ---
        public string UserId { get; set; } 
        
        public ApplicationUser User { get; set; }
        
        public string Subject { get; set; }
        public string Category { get; set; } 
        public string Message { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public TicketStatus Status { get; set; } = TicketStatus.Open;
        
        // --- CEVAPLAYAN ADMİN VE CEVAP ---
        public string? AdminReply { get; set; }

        // Kimin cevapladığını tutan ID
        public string? AdminId { get; set; } 

        // Navigasyon özelliği: AdminId üzerinden ApplicationUser tablosuna bağlanır
        public ApplicationUser? Admin { get; set; } // "Admin" ismini vermek daha doğru
        
        public DateTime? RepliedAt { get; set; }
    }
}