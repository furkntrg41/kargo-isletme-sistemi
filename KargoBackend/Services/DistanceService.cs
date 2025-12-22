using System.Globalization;
using System.Text.Json;

namespace KargoBackend.Services
{
    public class DistanceService
    {
        private readonly HttpClient _httpClient;

        public DistanceService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // 1. GERÇEK YOL HESABI (OSRM API)
        // Hem mesafeyi hem de yolun çizim noktalarını döner.
        public async Task<(double DistanceKm, string PathGeometry)> GetRealRouteAsync(double lat1, double lon1, double lat2, double lon2)
        {
            // OSRM Public API
            string baseUri = "http://router.project-osrm.org/route/v1/driving/";
            string coordinates = $"{lon1.ToString(CultureInfo.InvariantCulture)},{lat1.ToString(CultureInfo.InvariantCulture)};{lon2.ToString(CultureInfo.InvariantCulture)},{lat2.ToString(CultureInfo.InvariantCulture)}";
            
            // overview=full: Tüm detaylı çizim noktalarını getir
            // geometries=geojson: Koordinat dizisi olarak ver
            string requestUrl = baseUri + coordinates + "?overview=full&geometries=geojson";

            try
            {
                var response = await _httpClient.GetAsync(requestUrl);
                if (!response.IsSuccessStatusCode)
                    return (CalculateHaversine(lat1, lon1, lat2, lon2), $"{lat1},{lon1}|{lat2},{lon2}");

                var content = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(content);

                var routeElement = doc.RootElement.GetProperty("routes")[0];
                
                // Mesafe (Metre -> Km)
                double distanceMeters = routeElement.GetProperty("distance").GetDouble();
                double distKm = distanceMeters / 1000.0;

                // Yol Geometrisi (Koordinatları alıp "lat,lon|lat,lon" formatına çeviriyoruz)
                var coordsArray = routeElement.GetProperty("geometry").GetProperty("coordinates");
                List<string> points = new List<string>();

                foreach (var coord in coordsArray.EnumerateArray())
                {
                    // OSRM [lon, lat] döner, biz [lat, lon] kullanıyoruz
                    double ln = coord[0].GetDouble();
                    double lt = coord[1].GetDouble();
                    points.Add($"{lt.ToString(CultureInfo.InvariantCulture)},{ln.ToString(CultureInfo.InvariantCulture)}");
                }

                return (distKm, string.Join("|", points));
            }
            catch
            {
                // İnternet yoksa kuş uçuşu hesapla, düz çizgi dön
                return (CalculateHaversine(lat1, lon1, lat2, lon2), $"{lat1},{lon1}|{lat2},{lon2}");
            }
        }

        // 2. KUŞ UÇUŞU HESAP (SIRALAMA İÇİN GEREKLİ)
        // Binlerce kargo için OSRM çağırmak sistemi kilitler. Sıralamayı bununla yapacağız.
        public double CalculateHaversine(double lat1, double lon1, double lat2, double lon2)
        {
            var R = 6371; 
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        private static double ToRadians(double angle) => Math.PI * angle / 180.0;
    }
}