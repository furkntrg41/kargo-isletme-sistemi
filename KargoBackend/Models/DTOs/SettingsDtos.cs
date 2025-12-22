namespace KargoBackend.Models.DTOs
{
    public class UpdateSettingsDto
    {
        public double CostPerKm { get; set; }
        public double RentalVehicleCost { get; set; }
        public double DefaultRentalCapacityKg { get; set; }
        public int MaxStopsPerRoute { get; set; }
    }
}