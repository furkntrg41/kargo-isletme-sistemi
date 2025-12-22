
using KargoBackend.Common;
using KargoBackend.Enums;

namespace KargoBackend.Models
{
    public class Vehicle : BaseEntity
    {
        public VehicleType Type { get; set; }

        public double CapacityKg { get; set; }

        public double FixedRentalCost { get; set; }

        public bool IsActive { get; set; } = true;

        public string? PlateNumber { get; set; }
    }
}