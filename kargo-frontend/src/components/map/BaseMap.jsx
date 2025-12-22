import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-polylinedecorator'; // Ok işaretleri için
import { parseRouteGeometry } from '../../utils/mapUtils';
import { renderToStaticMarkup } from 'react-dom/server';

// İkonlar
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InfoIcon from '@mui/icons-material/Info';

// --- HELPER: Benzersiz ID ---
const getRouteUniqueId = (route, index) => {
  return (route.id && route.id !== 0) ? route.id : `sim-${index}`;
};

// --- 1. BİLEŞEN: YÖN OKLARI (Rota üzerinde > işaretleri) ---
const RouteArrows = ({ positions, color }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !positions || positions.length === 0) return;

    const arrowLayer = L.polylineDecorator(positions, {
      patterns: [
        {
          offset: '50px',
          repeat: '100px',
          symbol: L.Symbol.arrowHead({
            pixelSize: 12,
            polygon: false,
            pathOptions: { stroke: true, color: color, weight: 3, opacity: 1 }
          })
        }
      ]
    }).addTo(map);

    return () => { map.removeLayer(arrowLayer); };
  }, [map, positions, color]);

  return null;
};

// --- 2. FONKSİYON: DURAK İKONLARI ---
const createCustomIcon = (type, isHighlighted, isDimmed) => {
  const color = type === 'Depot' ? '#dc2626' : '#2563eb';
  const size = isHighlighted ? 48 : 32;
  const opacity = isDimmed ? 0.4 : 1;
  const border = isHighlighted ? `3px solid ${color}` : '1px solid #94a3b8';
  const boxShadow = isHighlighted ? '0px 0px 15px rgba(0,0,0,0.5)' : '0px 3px 6px rgba(0,0,0,0.3)';

  const iconMarkup = renderToStaticMarkup(
    type === 'Depot' 
      ? <WarehouseIcon style={{ fontSize: isHighlighted ? '28px' : '20px', color: color }} />
      : <LocationOnIcon style={{ fontSize: isHighlighted ? '28px' : '20px', color: color }} />
  );

  const html = `
    <div style="
      display: flex; align-items: center; justify-content: center;
      background-color: white; border-radius: 50%;
      border: ${border}; width: ${size}px; height: ${size}px;
      box-shadow: ${boxShadow}; opacity: ${opacity};
      transition: all 0.3s ease;
    ">
      ${iconMarkup}
    </div>
  `;

  return L.divIcon({
    html: html,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

// --- 3. FONKSİYON: HAREKETLİ KAMYON İKONU (YENİ EKLENDİ) ---
const createTruckIcon = () => {
  const color = '#10b981'; // Yeşil (Green-500)
  
  const iconMarkup = renderToStaticMarkup(
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Radar Efekti (Halka) */}
        <div style={{
            position: 'absolute', width: '40px', height: '40px', 
            borderRadius: '50%', border: `2px solid ${color}`, 
            opacity: 0.5, animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
        }}></div>
        
        {/* Kamyon Gövdesi */}
        <div style={{
            backgroundColor: color, width: '32px', height: '32px', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '2px solid white', zIndex: 10
        }}>
            <LocalShippingIcon style={{ fontSize: '18px', color: 'white' }} />
        </div>
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: '', // Default stili eziyoruz
    iconSize: [40, 40],
    iconAnchor: [20, 20], // Tam ortası
  });
};

// --- 4. BİLEŞEN: LEJANT ---
const MapLegend = () => {
  return (
    <div className="leaflet-bottom leaflet-right m-4" style={{ zIndex: 1000 }}>
      <div className="bg-white p-3 rounded-lg shadow-xl border border-slate-200 text-xs font-sans w-40">
        <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-1 border-b pb-1">
          <InfoIcon style={{ fontSize: 14 }} /> Harita Rehberi
        </h4>
        <div className="space-y-2">
          {/* Simülasyon Aktifse Göster */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center border border-white shadow-sm">
                <LocalShippingIcon style={{ fontSize: 10, color: 'white' }} />
            </div>
            <span className="text-slate-600 font-bold">Canlı Araç</span>
          </div>
          <div className="border-t pt-1 mt-1"></div>
          {/* Diğerleri */}
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-blue-600"></span><span className="text-[10px] text-blue-600">➤</span>
            <span className="text-slate-600">Özmal Rota</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-orange-500"></span><span className="text-[10px] text-orange-500">➤</span>
            <span className="text-slate-600">Kiralık Rota</span>
          </div>
          <div className="flex items-center gap-2">
            <WarehouseIcon style={{ fontSize: 14, color: '#dc2626' }} />
            <span className="text-slate-600">Ana Depo</span>
          </div>
          <div className="flex items-center gap-2">
            <LocationOnIcon style={{ fontSize: 14, color: '#2563eb' }} />
            <span className="text-slate-600">Durak</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 5. BİLEŞEN: OTOMATİK ODAKLAMA ---
const FitBounds = ({ routes, stations }) => {
  const map = useMap();
  useEffect(() => {
    const points = [];
    if (routes && routes.length > 0) {
      routes.forEach(r => {
        if(r.pathGeometry) points.push(...parseRouteGeometry(r.pathGeometry));
      });
    } else if (stations && stations.length > 0) {
      stations.forEach(s => points.push([s.latitude, s.longitude]));
    }

    if (points.length > 0) {
      try { map.fitBounds(L.latLngBounds(points), { padding: [50, 50] }); } catch(e) {}
    }
  }, [routes, stations, map]);
  return null;
};

// --- ANA BİLEŞEN ---
const BaseMap = ({ routes, selectedRouteId, allStations, simulationPositions }) => {
  const startPosition = [40.7654, 29.9408];

  const activeStationIds = useMemo(() => {
    if (!selectedRouteId || !routes) return new Set();
    const selectedRoute = routes.find((r, i) => getRouteUniqueId(r, i) === selectedRouteId);
    if (!selectedRoute) return new Set();
    const ids = new Set();
    if (selectedRoute.routeStops) {
        selectedRoute.routeStops.forEach(stop => ids.add(stop.stationId));
    }
    return ids;
  }, [selectedRouteId, routes]);

  return (
    <MapContainer center={startPosition} zoom={12} className="w-full h-full z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

      {/* 1. İSTASYONLAR */}
      {allStations && allStations.map((station) => {
        const isRouteSelected = selectedRouteId !== null;
        const isActive = activeStationIds.has(station.id) || station.isDepot;
        const isDimmed = isRouteSelected && !isActive;
        const isHighlighted = isActive && isRouteSelected;

        return (
          <Marker
            key={`station-${station.id}`}
            position={[station.latitude, station.longitude]}
            icon={createCustomIcon(station.isDepot ? 'Depot' : 'Station', isHighlighted, isDimmed)}
            zIndexOffset={isHighlighted ? 2000 : 1000}
          >
            <Popup>
              <div className="text-center p-1 font-sans">
                <div className={`font-bold border-b pb-1 mb-1 ${station.isDepot ? "text-red-600" : "text-blue-600"}`}>
                  {station.name}
                </div>
                <span className="text-xs text-gray-500 block">{station.isDepot ? 'Ana Dağıtım Merkezi' : 'Teslimat Noktası'}</span>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* 2. ROTALAR VE OKLAR */}
      {routes && routes.map((route, index) => {
        if (!route.pathGeometry) return null;
        const positions = parseRouteGeometry(route.pathGeometry);
        const uniqueKey = getRouteUniqueId(route, index);
        const isSelected = selectedRouteId === uniqueKey;
        const isAnySelected = selectedRouteId !== null;
        const isOwned = route.vehicle?.type === 0 || route.vehicle?.type === 'Owned';
        const color = isSelected ? '#ef4444' : (isOwned ? '#2563eb' : '#f97316');
        const opacity = isAnySelected && !isSelected ? 0.1 : 0.8;
        const weight = isSelected ? 6 : 4;
        const showArrows = !isAnySelected || isSelected;

        return (
          <div key={uniqueKey}>
            <Polyline 
              positions={positions} color={color} weight={weight} opacity={opacity}
              eventHandlers={{
                mouseover: (e) => { e.target.openPopup(); e.target.setStyle({ weight: 8 }); },
                mouseout: (e) => { e.target.closePopup(); e.target.setStyle({ weight: weight }); },
              }}
            >
              <Popup>
                <div className="font-sans text-sm"><strong>{route.vehicle?.plateNumber}</strong></div>
              </Popup>
            </Polyline>
            {showArrows && <RouteArrows positions={positions} color={color} />}
          </div>
        );
      })}

      {/* 3. HAREKETLİ SİMÜLASYON ARAÇLARI (EKSİK OLAN KISIM BURASIYDI) */}
      {simulationPositions && simulationPositions.map((vehicle, index) => {
         if (!vehicle.position) return null; // Güvenlik kontrolü
         return (
            <Marker
                key={`sim-truck-${vehicle.id}-${index}`}
                position={vehicle.position}
                icon={createTruckIcon()} // Yeşil Kamyon
                zIndexOffset={3000} // En üstte
            >
                <Popup closeButton={false} autoClose={false} closeOnClick={false}>
                    <div className="text-center">
                        <strong className="text-green-600 text-xs block">CANLI</strong>
                        <span className="font-bold text-sm">{vehicle.plateNumber}</span>
                    </div>
                </Popup>
            </Marker>
         );
      })}

      <FitBounds routes={routes} stations={allStations} />
      <MapLegend />
    </MapContainer>
  );
};

export default BaseMap;