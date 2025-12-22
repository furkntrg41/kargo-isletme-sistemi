using KargoBackend.Common;
using KargoBackend.Enums;
using KargoBackend.Identity;
using KargoBackend.Models;

namespace KargoBackend.Entities
{
    public class CargoRequest : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

        public int FromStationId { get; set; }
        public Station FromStation { get; set; } = null!;
        public int ToStationId { get; set; }
        public Station ToStation { get; set; } = null!;

        public int Quantity { get; set; }
        public double Weight { get; set; }

        public DateTime RequestedDate { get; set; }

        public CargoStatus Status { get; set; } = CargoStatus.Pending;

        public string? RejectionReason { get; set; }

        public int? AssignedDeliveryRouteId { get; set; }
        public DeliveryRoute? AssignedDeliveryRoute { get; set; }
    }
}