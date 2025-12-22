using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using KargoBackend.Identity;
using KargoBackend.Entities;
using KargoBackend.Models;

namespace KargoBackend.Data
{
    // IdentityDbContext kullanarak kullanıcı ve rol tablolarını dahil ediyoruz
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<CargoRequest> CargoRequests { get; set; }
        public DbSet<DeliveryRoute> DeliveryRoutes { get; set; }
        public DbSet<PlanningRun> PlanningRuns { get; set; }
        public DbSet<RouteStop> RouteStops { get; set; }
        public DbSet<Station> Stations { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<GlobalSettings> GlobalSettings { get; set; }
        public DbSet<SupportTicket> SupportTickets { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Identity için bu satır şart
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(string))
                    {
                        property.SetMaxLength(4000); 
                    }
                }
            }
        }
    }
}