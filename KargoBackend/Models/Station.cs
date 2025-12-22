
using KargoBackend.Common;

namespace KargoBackend.Models
{
    public class Station : BaseEntity
    {
        public string Name { get; set; } = string.Empty;

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsDepot { get; set; } = false;
    }
}