using KargoBackend.Enums;

namespace KargoBackend.Models.DTOs
{
    public class CreateCargoRequestDto
    {
        public int FromStationId { get; set; }
        public int ToStationId { get; set; }

        public int Quantity { get; set; }
        public double Weight { get; set; }
    }
    public class CargoRequestResponseDto
    {
        public int Id { get; set; }
        public string  UserId { get; set; } = string.Empty;
        public string StationName { get; set; } = string.Empty;
        public string? UserName { get; set; } = string.Empty;
        public int FromStationId { get; set; }
        public string FromStationName { get; set; } = string.Empty;
        public string ToStationName { get; set; } = string.Empty;
        public int ToStationId { get; set; }

        public int Quantity { get; set; }
        public double Weight { get; set; }

        public DateTime RequestedDate { get; set; }

        public string Status { get; set; } = string.Empty;

        public string? RejectionReason { get; set; }

        public int? AssignedDeliveryRouteId { get; set; }

        public string? AssignedVehiclePlate { get; set; }
    }
    public class UpdateCargoRequestStatusDto
    {
        public CargoStatus Status { get; set; } = CargoStatus.Pending;

        public string? RejectionReason { get; set; }
    }
}