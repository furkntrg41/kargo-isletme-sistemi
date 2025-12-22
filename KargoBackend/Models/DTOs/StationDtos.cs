namespace KargoBackend.Models.DTOs
{
    public class CreateStationDto
    {
        public string Name { get; set; } = string.Empty;

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public bool IsDepot { get; set; } = false;
    }
    public class StationResponseDto
    {
        public int Id {get;set;}
        public string Name {get;set;} = string.Empty;
        public double Latitude {get;set;}
        public double Longitude {get;set;}
        public bool IsActive {get;set;}
        public bool IsDepot {get;set;}
    }
    public class UpdateStationDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public bool IsDepot { get; set; } = false;

    }
    public class StationToggleDto
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
    }
}