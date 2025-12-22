
using KargoBackend.Common;
using KargoBackend.Models;

namespace KargoBackend.Entities
{
    public class DeliveryRoute : BaseEntity
    {
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; } = null!;

        public int PlanningRunId { get; set; }
        public PlanningRun PlanningRun { get; set; } = null!;

        public DateTime RouteDate { get; set; }

        public double TotalDistanceKm { get; set; }

        public double TotalCost { get; set; }

        public double TotalLoadKg { get; set; }

        public int TotalCargoCount { get; set; }

        public string? PathGeometry { get; set; }
    
        
        public ICollection<CargoRequest> CargoRequests { get; set; } = new List<CargoRequest>();
        public ICollection<RouteStop> RouteStops { get; set; } = new List<RouteStop>();
    }
}