using KargoBackend.Identity;
using KargoBackend.Models;
using KargoBackend.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace KargoBackend.Data
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAllAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // 1. Rolleri oluştur (Admin ve Customer)
            string[] roles = { "Admin", "Customer" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // 2. Admin Kullanıcısını oluştur
            if (await userManager.FindByEmailAsync("admin@kargo.com") == null)
            {
                var admin = new ApplicationUser 
                { 
                    UserName = "admin", 
                    Email = "admin@kargo.com",
                    FirstName = "Sistem",
                    LastName = "Admin"
                };
                var result = await userManager.CreateAsync(admin, "Admin123!");
                if (result.Succeeded) await userManager.AddToRoleAsync(admin, "Admin");
            }

            // 3. İstasyonları Ekle
            if (!context.Stations.Any())
            {
                var stations = new List<Station>
                {
                    new Station { Name = "Umuttepe Kampüsü (Merkez Depo)", Latitude = 40.8219, Longitude = 29.9211, IsActive = true, IsDepot = true },
                    new Station { Name = "İzmit Merkez", Latitude = 40.7667, Longitude = 29.9167, IsActive = true, IsDepot = false },
                    new Station { Name = "Gebze", Latitude = 40.8027, Longitude = 29.4307, IsActive = true, IsDepot = false },
                    new Station { Name = "Gölcük", Latitude = 40.7168, Longitude = 29.8175, IsActive = true, IsDepot = false },
                    new Station { Name = "Körfez", Latitude = 40.7781, Longitude = 29.7364, IsActive = true, IsDepot = false },
                    new Station { Name = "Kartepe", Latitude = 40.7534, Longitude = 30.0234, IsActive = true, IsDepot = false },
                    new Station { Name = "Başiskele", Latitude = 40.7067, Longitude = 29.9325, IsActive = true, IsDepot = false },
                    new Station { Name = "Derince", Latitude = 40.7564, Longitude = 29.8306, IsActive = true, IsDepot = false },
                    new Station { Name = "Karamürsel", Latitude = 40.6908, Longitude = 29.6153, IsActive = true, IsDepot = false },
                    new Station { Name = "Kandıra", Latitude = 41.0683, Longitude = 30.1500, IsActive = true, IsDepot = false },
                    new Station { Name = "Dilovası", Latitude = 40.7853, Longitude = 29.5442, IsActive = true, IsDepot = false },
                    new Station { Name = "Çayırova", Latitude = 40.8247, Longitude = 29.3736, IsActive = true, IsDepot = false }
                };
                context.Stations.AddRange(stations);
            }

            // 4. Araçları Ekle
            if (!context.Vehicles.Any())
            {
                var vehicles = new List<Vehicle>
                {
                    new Vehicle { PlateNumber = "41KRG01", CapacityKg = 500, FixedRentalCost = 0, Type = VehicleType.Owned, IsActive = true },
                    new Vehicle { PlateNumber = "41KRG02", CapacityKg = 750, FixedRentalCost = 0, Type = VehicleType.Owned, IsActive = true },
                    new Vehicle { PlateNumber = "41KRG03", CapacityKg = 1000, FixedRentalCost = 0, Type = VehicleType.Owned, IsActive = true }
                };
                context.Vehicles.AddRange(vehicles);
            }

            // 5. YENİ: Global Ayarları Ekle
            if (!context.GlobalSettings.Any())
            {
                var defaultSettings = new GlobalSettings
                {
                    Id = 1,
                    CostPerKm = 1.0,               // Senaryodaki standart KM başı yakıt/aşınma maliyeti
                    RentalVehicleCost = 200.0,      // Özmal yetmediğinde dışarıdan çağrılan araç maliyeti
                    DefaultRentalCapacityKg = 500.0, // Kiralık araçların varsayılan taşıma kapasitesi
                    MaxStopsPerRoute = 20,          // Bir rotada güvenli maksimum durak sayısı
                    UpdatedAt = DateTime.Now
                };
                context.GlobalSettings.Add(defaultSettings);
            }
            
            await context.SaveChangesAsync();
        }
    }
}