namespace KargoBackend.Models
{
    public class GlobalSettings
    {
        public int Id { get; set; } = 1; 
        public double CostPerKm { get; set; } = 1.0;
        public double RentalVehicleCost { get; set; } = 200.0;
        public double DefaultRentalCapacityKg { get; set; } = 500.0;
        public int MaxStopsPerRoute { get; set; } = 15;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}