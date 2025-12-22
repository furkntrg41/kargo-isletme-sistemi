using KargoBackend.Data;
using KargoBackend.Models;
using KargoBackend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class StationController : ControllerBase
{
    private readonly AppDbContext _context;
    public StationController(AppDbContext context)
    {
        _context = context;
    }
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateStation(CreateStationDto model) // DTO kullanımı
    {
        var station = new Station
        {
            Name = model.Name,
            Latitude = model.Latitude,
            Longitude = model.Longitude,
            IsDepot = model.IsDepot,
            IsActive = true
        };

        _context.Stations.Add(station);
        await _context.SaveChangesAsync();

        return Ok(new { message = "İstasyon başarıyla eklendi.", id = station.Id });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StationResponseDto>>> GetStations()
    {
        // Veritabanı modelini doğrudan dönmek yerine ResponseDto'ya eşliyoruz
        return await _context.Stations
            .Select(s => new StationResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Latitude = s.Latitude,
                Longitude = s.Longitude,
                IsActive = s.IsActive,
                IsDepot = s.IsDepot
            }).ToListAsync();
    }
    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<IActionResult> UpdateStation(UpdateStationDto model)
    {
        var station = await _context.Stations.FindAsync(model.Id);
        if (station == null) return NotFound("İstasyon bulunamadı.");

        station.Name = model.Name;
        station.Latitude = model.Latitude;
        station.Longitude = model.Longitude;
        station.IsDepot = model.IsDepot;

        await _context.SaveChangesAsync();
        return Ok(new { message = "İstasyon güncellendi." });
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id}/toggle-active")] // Artık URL'den alıyoruz: /api/Station/5/toggle-active
    public async Task<IActionResult> ToggleActive(int id)
    {
        var station = await _context.Stations.FindAsync(id);
        if (station == null) return NotFound("İstasyon bulunamadı.");

        // Doğrudan tersini alıyoruz
        station.IsActive = !station.IsActive;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            id = station.Id,
            isActive = station.IsActive,
            message = $"İstasyon artık {(station.IsActive ? "Aktif" : "Pasif")}."
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id}/toggle-depot")] // /api/Station/5/toggle-depot
    public async Task<IActionResult> ToggleDepot(int id)
    {
        var station = await _context.Stations.FindAsync(id);
        if (station == null) return NotFound("İstasyon bulunamadı.");
        if (!station.IsActive)
        {
            return BadRequest("Pasif bir istasyon depo olarak işaretlenemez.");
        }
        var activeDepotsCount = await _context.Stations.CountAsync(s => s.IsDepot && s.IsActive);
        if (!station.IsDepot && activeDepotsCount >= 1)
        {
            return BadRequest("Maksimum 1 aktif depo istasyonu olabilir.");
        }
    
        // Doğrudan tersini alıyoruz
        station.IsDepot = !station.IsDepot;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            id = station.Id,
            isDepot = station.IsDepot,
            message = $"İstasyon depo durumu {(station.IsDepot ? "Aktif" : "Pasif")}."
        });
    }
}