using KargoBackend.Enums;

namespace KargoBackend.Models.DTOs
{
    public class CreateVehicleDto
    {
        public string PlateNumber { get; set; } = string.Empty;
        public VehicleType Type { get; set; }
        public double CapacityKg { get; set; }
        public double FixedRentalCost { get; set; }
    }
    public class VehicleResponseDto
    {
        public int Id {get;set;}
        public double CapacityKg {get;set;}
        public double FixedRentalCost {get;set;}
        public bool IsActive {get;set;}
        public string PlateNumber {get;set;} = string.Empty;
        
    }
    public class UpdateVehicleDto
    {
        public int Id { get; set; }
        public string PlateNumber { get; set; } = string.Empty;
        public VehicleType Type { get; set; }
        public double CapacityKg { get; set; }
        public double FixedRentalCost { get; set; }
        public bool IsActive { get; set; }
    }
}