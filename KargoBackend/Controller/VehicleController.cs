using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KargoBackend.Data;
using KargoBackend.Entities;
using KargoBackend.Models.DTOs;
using KargoBackend.Models;


namespace KargoBackend.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class VehicleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehicleController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VehicleResponseDto>>> GetVehicles()
        {
            return await _context.Vehicles
                .Select(v => new VehicleResponseDto
                {
                    Id = v.Id,
                    PlateNumber = v.PlateNumber,
                    CapacityKg = v.CapacityKg,
                    FixedRentalCost = v.FixedRentalCost,
                    IsActive = v.IsActive
                }).ToListAsync();
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle(CreateVehicleDto model)
        {
            var vehicle = new Vehicle
            {
                PlateNumber = model.PlateNumber,
                Type = model.Type,
                CapacityKg = model.CapacityKg,
                FixedRentalCost = model.FixedRentalCost,
                IsActive = true
            };
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Araç başarıyla eklendi.", id = vehicle.Id });
        }

        [HttpPatch("{id}/toggle-active")]
        public async Task<IActionResult> ToggleActive(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return NotFound();

            vehicle.IsActive = !vehicle.IsActive;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Araç durumu güncellendi." });
        }
        [HttpPut]
        public async Task<IActionResult> UpdateVehicle(UpdateVehicleDto model)
        {
            var vehicle = await _context.Vehicles.FindAsync(model.Id);
            if (vehicle == null) return NotFound("Araç bulunamadı.");

            // Araç bilgilerini güncelle
            vehicle.PlateNumber = model.PlateNumber;
            vehicle.Type = model.Type;
            vehicle.CapacityKg = model.CapacityKg;
            vehicle.FixedRentalCost = model.FixedRentalCost;
            vehicle.IsActive = model.IsActive;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Araç bilgileri başarıyla güncellendi." });
        }
    }
}