using KargoBackend.Common;
using KargoBackend.Enums;

namespace KargoBackend.Entities
{
    public class PlanningRun : BaseEntity
    {
        public DateTime PlanDate { get; set; }

        public PlanningMode Mode { get; set; }
        public PlanStatus Status { get; set; } = PlanStatus.Active;
        public OptimizationObjective Objective { get; set; }

        public double CostPerKm { get; set; }

        public double RentalVehicleCost { get; set; }

        public double TotalCost { get; set; }

        public int TotalRouteCount { get; set; }

        public int RentedVehicleCount { get; set; }

        public double TotalLoadKg { get; set; }

        public int AcceptedCargoCount { get; set; }

        public int UnassignedCargoCount { get; set; }

        public string CreatedByUserId { get; set; } = string.Empty;
        public bool IsSimulation { get; set; } = false;

        public string? Notes { get; set; }
        public ICollection<DeliveryRoute> DeliveryRoutes { get; set; } = new List<DeliveryRoute>();
    }
}