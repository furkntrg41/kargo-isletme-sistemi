using KargoBackend.Common;
using KargoBackend.Models;

namespace KargoBackend.Entities
{
    public class RouteStop : BaseEntity
    {
        public Station Station { get; set; } = null!;
        public int DeliveryRouteId { get; set; }

        public int StationId { get; set; }

        public int StopOrder { get; set; }

        public double DistanceFromPreviousKm { get; set; }
    }
}