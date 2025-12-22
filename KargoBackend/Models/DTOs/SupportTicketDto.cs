namespace KargoBackend.Models.DTOs
{
    // Müşterinin talep oluştururken gönderdiği veri
    public class CreateTicketDto
    {
        public string Subject { get; set; }
        public string Category { get; set; }
        public string Message { get; set; }
    }

    // Admin'in cevap verirken gönderdiği veri
    public class ReplyTicketDto
    {
        public string ReplyMessage { get; set; }
    }

    // Listeleme ekranlarında dönen detaylı veri
    public class SupportTicketResponseDto
    {
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public string CustomerFullName { get; set; }
        public string Subject { get; set; }
        public string Category { get; set; }
        public string Message { get; set; }
        public string Status { get; set; } 
        public DateTime CreatedAt { get; set; }
        
        // Admin cevap kısımları
        public string? AdminReply { get; set; }
        public string? AdminId { get; set; }
        public string? AdminFullName { get; set; } 
        public DateTime? RepliedAt { get; set; }
    }
}