using KargoBackend.Data;
using KargoBackend.Entities;
using KargoBackend.Enums;
using KargoBackend.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Globalization;

namespace KargoBackend.Services
{
    public partial class OptimizationService
    {
        private readonly AppDbContext _context;
        private readonly DistanceService _distanceService;

        public OptimizationService(AppDbContext context, DistanceService distanceService)
        {
            _context = context;
            _distanceService = distanceService;
        }

        public async Task<PlanningRun> RunOptimizationAsync(
            string planName, 
            string userId, 
            PlanningMode mode, 
            OptimizationObjective objective,
            bool isSimulation = false) 
        {
            // ============================================================
            // 0. AYARLARI VERİTABANINDAN ÇEK (DİNAMİK YAPI)
            // ============================================================
            var settings = await _context.GlobalSettings.FirstOrDefaultAsync() 
                          ?? new GlobalSettings(); // Kayıt yoksa modeldeki defaultları kullan

            // ============================================================
            // 1. VERİ HAZIRLIĞI
            // ============================================================
            
            // A. Bekleyen Kargoları Çek
            var pendingRequests = await _context.CargoRequests
                .Include(r => r.FromStation)
                .Include(r => r.ToStation) 
                .Where(r => r.Status == CargoStatus.Pending)
                .ToListAsync();

            if (!pendingRequests.Any())
                throw new InvalidOperationException("Bekleyen kargo isteği bulunmamaktadır.");

            // B. Araçları Mod'a Göre Filtrele
            var vehiclesQuery = _context.Vehicles.Where(v => v.IsActive);

            if (mode == PlanningMode.FixedFleet)
            {
                vehiclesQuery = vehiclesQuery.Where(v => v.Type == VehicleType.Owned);
            }

            var activeVehicles = await vehiclesQuery
                .OrderByDescending(v => v.CapacityKg)
                .ToListAsync();

            var depot = await _context.Stations.FirstOrDefaultAsync(s => s.IsDepot)
                        ?? await _context.Stations.FirstAsync();

            // 2. Plan Taslağını Oluştur
            var currentRun = new PlanningRun
            {
                PlanDate = DateTime.Now,
                CreatedByUserId = userId,
                Notes = planName,
                Mode = mode,
                Objective = objective,
                CostPerKm = settings.CostPerKm,           // DİNAMİK: 1.0 yerine settings
                RentalVehicleCost = settings.RentalVehicleCost, // DİNAMİK: 200.0 yerine settings
                TotalLoadKg = 0,
                AcceptedCargoCount = 0,
                RentedVehicleCount = 0,
                IsSimulation = isSimulation,
                DeliveryRoutes = new List<DeliveryRoute>() 
            };

            double runningTotalCost = 0;
            int routesCreated = 0;

            // ============================================================
            // 3. ROTA OLUŞTURMA ALGORİTMASI (MEVCUT ARAÇLAR)
            // ============================================================
            foreach (var vehicle in activeVehicles)
            {
                if (!pendingRequests.Any()) break;

                var route = await CreateRouteForVehicleAsync(vehicle, currentRun, pendingRequests, depot, objective, mode, settings);

                if (route.TotalCargoCount > 0)
                {
                    currentRun.DeliveryRoutes.Add(route); 
                    runningTotalCost += route.TotalCost;
                    routesCreated++;
                    currentRun.TotalLoadKg += route.TotalLoadKg;
                    currentRun.AcceptedCargoCount += route.TotalCargoCount;
                    
                    if (vehicle.Type == VehicleType.Rental || vehicle.FixedRentalCost > 0) 
                        currentRun.RentedVehicleCount++;
                }
            }

            // ============================================================
            // 4. KİRALIK ARAÇLAR (UNLIMITED FLEET MODU)
            // ============================================================
            if (mode == PlanningMode.UnlimitedFleet && pendingRequests.Any())
            {
                int tempRentalIdCounter = -1;

                while (pendingRequests.Any())
                {
                    var rentalVehicle = new Vehicle
                    {
                        Id = tempRentalIdCounter--, 
                        PlateNumber = "RENT-" + Guid.NewGuid().ToString("N")[..5].ToUpper(),
                        CapacityKg = settings.DefaultRentalCapacityKg, // DİNAMİK: 500 yerine settings
                        FixedRentalCost = settings.RentalVehicleCost,  // DİNAMİK: currentRun.RentalVehicleCost yerine settings
                        Type = VehicleType.Rental,
                        IsActive = true
                    };

                    var route = await CreateRouteForVehicleAsync(rentalVehicle, currentRun, pendingRequests, depot, objective, mode, settings);

                    if (route.TotalCargoCount == 0 || route.TotalLoadKg <= 0.01) break;

                    currentRun.DeliveryRoutes.Add(route);
                    runningTotalCost += route.TotalCost;
                    routesCreated++;
                    currentRun.TotalLoadKg += route.TotalLoadKg;
                    currentRun.AcceptedCargoCount += route.TotalCargoCount;
                    currentRun.RentedVehicleCount++;
                }
            }

            // ============================================================
            // 5. FINAL İSTATİSTİKLERİ & DÜZELTMELER
            // ============================================================
            currentRun.TotalCost = Math.Round(runningTotalCost, 2);
            currentRun.TotalRouteCount = routesCreated;
            
            int remaining = pendingRequests.Count(r => r.Status == CargoStatus.Pending);
            currentRun.UnassignedCargoCount = remaining < 0 ? 0 : remaining;

            // ============================================================
            // 6. KAYIT MANTIĞI VE STATÜ YÖNETİMİ
            // ============================================================
            if (!isSimulation)
            {
                bool hasActivePlan = await _context.PlanningRuns
                    .AnyAsync(p => p.Status == PlanStatus.Active && !p.IsSimulation);

                currentRun.Status = hasActivePlan ? PlanStatus.Scheduled : PlanStatus.Active;

                foreach(var r in currentRun.DeliveryRoutes)
                {
                    if(r.Vehicle.Id < 0) r.Vehicle.Id = 0; 
                }

                _context.PlanningRuns.Add(currentRun);
                await _context.SaveChangesAsync();
            }
            else
            {
                _context.ChangeTracker.Clear();
            }

            return currentRun; 
        }

        private async Task<DeliveryRoute> CreateRouteForVehicleAsync(
            Vehicle vehicle,
            PlanningRun run,
            List<CargoRequest> pendingRequests, 
            Station depot,
            OptimizationObjective objective,
            PlanningMode mode,
            GlobalSettings settings) // Settings parametre olarak eklendi
        {
            var route = new DeliveryRoute
            {
                Vehicle = vehicle,
                PlanningRun = run,
                RouteDate = DateTime.Now,
                TotalCost = vehicle.FixedRentalCost > 0 ? vehicle.FixedRentalCost : 0,
                TotalLoadKg = 0,
                TotalDistanceKm = 0,
                TotalCargoCount = 0,
                RouteStops = new List<RouteStop>(),
                CargoRequests = new List<CargoRequest>()
            };

            double currentLat = depot.Latitude;
            double currentLon = depot.Longitude;
            int stopOrder = 1;

            var visitedStations = new HashSet<int>();
            StringBuilder fullPathGeometry = new StringBuilder();
            fullPathGeometry.Append($"{depot.Latitude.ToString(CultureInfo.InvariantCulture)},{depot.Longitude.ToString(CultureInfo.InvariantCulture)}");

            var candidates = pendingRequests.ToList();
            var cargosToDeliver = new List<CargoRequest>();

            while (candidates.Any())
            {
                // DİNAMİK DURAK KONTROLÜ
                if (route.RouteStops.Count >= settings.MaxStopsPerRoute) break; 

                double spaceLeft = vehicle.CapacityKg - route.TotalLoadKg;
                if (spaceLeft <= 0.01) break;

                var sorted = objective switch
                {
                    OptimizationObjective.MaximizeCargoCount => candidates.OrderBy(r => r.Weight),
                    OptimizationObjective.MaximizeTotalWeight => candidates.OrderByDescending(r => r.Weight),
                    _ => candidates.OrderBy(r => _distanceService.CalculateHaversine(currentLat, currentLon, r.FromStation.Latitude, r.FromStation.Longitude))
                };

                var targetCargo = sorted.First();
                CargoRequest cargoToLoad = targetCargo;
                bool wasSplit = false;

                if (targetCargo.Weight > spaceLeft)
                {
                    if (mode == PlanningMode.UnlimitedFleet || mode == PlanningMode.FixedFleet)
                    {
                        double ratio = spaceLeft / targetCargo.Weight;
                        int splitQuantity = (int)Math.Floor(targetCargo.Quantity * ratio);
                        if (splitQuantity < 1) splitQuantity = 1; 

                        var splitPart = new CargoRequest
                        {
                            UserId = targetCargo.UserId,
                            FromStationId = targetCargo.FromStationId, FromStation = targetCargo.FromStation,
                            ToStationId = targetCargo.ToStationId, ToStation = targetCargo.ToStation,
                            Quantity = splitQuantity, Weight = spaceLeft,
                            RequestedDate = targetCargo.RequestedDate, Status = CargoStatus.Planned
                        };

                        targetCargo.Weight -= spaceLeft;
                        targetCargo.Quantity -= splitQuantity; 
                        if (targetCargo.Quantity < 0) targetCargo.Quantity = 0; 

                        if (!run.IsSimulation) _context.CargoRequests.Add(splitPart); 
                        
                        cargoToLoad = splitPart;
                        wasSplit = true;
                    }
                    else
                    {
                        candidates.Remove(targetCargo);
                        continue;
                    }
                }
                else { targetCargo.Status = CargoStatus.Planned; }

                if (!visitedStations.Contains(cargoToLoad.FromStationId))
                {
                    var routeInfo = await _distanceService.GetRealRouteAsync(currentLat, currentLon, cargoToLoad.FromStation.Latitude, cargoToLoad.FromStation.Longitude);
                    
                    route.RouteStops.Add(new RouteStop
                    {
                        StationId = cargoToLoad.FromStationId, Station = cargoToLoad.FromStation,
                        StopOrder = stopOrder++, DistanceFromPreviousKm = routeInfo.DistanceKm 
                    });

                    route.TotalDistanceKm += routeInfo.DistanceKm;
                    visitedStations.Add(cargoToLoad.FromStationId);
                    
                    if(!string.IsNullOrEmpty(routeInfo.PathGeometry))
                         fullPathGeometry.Append("|" + routeInfo.PathGeometry);

                    currentLat = cargoToLoad.FromStation.Latitude;
                    currentLon = cargoToLoad.FromStation.Longitude;
                }

                route.TotalLoadKg += cargoToLoad.Weight;
                route.TotalCargoCount++;
                route.CargoRequests.Add(cargoToLoad);
                cargosToDeliver.Add(cargoToLoad);

                candidates.Remove(targetCargo);
                if (!wasSplit) pendingRequests.Remove(targetCargo);
            }

            foreach (var cargo in cargosToDeliver)
            {
                if (cargo.ToStationId != depot.Id && !visitedStations.Contains(cargo.ToStationId))
                {
                    if (cargo.ToStation != null)
                    {
                        var routeInfo = await _distanceService.GetRealRouteAsync(currentLat, currentLon, cargo.ToStation.Latitude, cargo.ToStation.Longitude);

                        route.RouteStops.Add(new RouteStop
                        {
                            StationId = cargo.ToStationId, Station = cargo.ToStation,
                            StopOrder = stopOrder++, DistanceFromPreviousKm = routeInfo.DistanceKm
                        });

                        route.TotalDistanceKm += routeInfo.DistanceKm;
                        visitedStations.Add(cargo.ToStationId);
                        
                        if(!string.IsNullOrEmpty(routeInfo.PathGeometry))
                             fullPathGeometry.Append("|" + routeInfo.PathGeometry);

                        currentLat = cargo.ToStation.Latitude;
                        currentLon = cargo.ToStation.Longitude;
                    }
                }
            }

            if (route.TotalCargoCount > 0)
            {
                var returnInfo = await _distanceService.GetRealRouteAsync(currentLat, currentLon, depot.Latitude, depot.Longitude);
                
                route.TotalDistanceKm += returnInfo.DistanceKm;
                route.TotalCost += route.TotalDistanceKm * run.CostPerKm;
                
                if(!string.IsNullOrEmpty(returnInfo.PathGeometry))
                     fullPathGeometry.Append("|" + returnInfo.PathGeometry);
                
                route.PathGeometry = fullPathGeometry.ToString();
            }

            return route;
        }
    }
}