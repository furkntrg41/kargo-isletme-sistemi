using KargoBackend.Data;
using KargoBackend.Models;
using KargoBackend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SettingsController(AppDbContext context) { _context = context; }

    [HttpGet]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _context.GlobalSettings.FirstOrDefaultAsync() 
                      ?? new GlobalSettings(); // Yoksa varsayılanı dön
        return Ok(settings);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateSettings(UpdateSettingsDto model)
    {
        var settings = await _context.GlobalSettings.FirstOrDefaultAsync();
        if (settings == null) {
            _context.GlobalSettings.Add(new GlobalSettings
            {
                CostPerKm = model.CostPerKm,
                RentalVehicleCost = model.RentalVehicleCost,
                DefaultRentalCapacityKg = model.DefaultRentalCapacityKg,
                MaxStopsPerRoute = model.MaxStopsPerRoute,
                UpdatedAt = DateTime.Now
            });
        } else {
            settings.CostPerKm = model.CostPerKm;
            settings.RentalVehicleCost = model.RentalVehicleCost;
            settings.DefaultRentalCapacityKg = model.DefaultRentalCapacityKg;
            settings.MaxStopsPerRoute = model.MaxStopsPerRoute;
            settings.UpdatedAt = DateTime.Now;
        }
        await _context.SaveChangesAsync();
        return Ok(settings);
    }
}