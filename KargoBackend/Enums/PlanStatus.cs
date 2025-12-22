namespace KargoBackend.Enums
{
    public enum PlanStatus
    {
        Cancelled = 0, // İptal
        Active = 1,    // Şu an sahada
        Completed = 2, // Bitti
        Scheduled = 3  // Sırada bekliyor (Active olmayı bekliyor)
    }
}
