import React, { useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Store ve İkonlar
import useDashboardStore from '../../stores/useDashboardStore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MapIcon from '@mui/icons-material/Map';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

const STATUS_COLORS = {
  'Pending': '#F59E0B',
  'Planned': '#3B82F6',
  'Delivered': '#10B981',
  'Canceled': '#EF4444'
};

const AdminDashboard = () => {
  const { 
    summary, 
    weeklyStats, 
    heatmapData, 
    statusDistribution, 
    alerts, 
    isLoading, 
    fetchDashboardData 
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Harita render sorunlarını (gri ekran) çözmek için resize tetikleyici
  useEffect(() => {
    if (heatmapData?.length > 0) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 200);
    }
  }, [heatmapData]);

  const defaultCenter = [40.765, 29.920];
  const mapCenter = (heatmapData && heatmapData.length > 0) 
    ? [heatmapData[0].lat, heatmapData[0].lng] 
    : defaultCenter;

  if (isLoading && !summary) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center font-sans">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Veriler Hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* BAŞLIK */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Yönetim Paneli</h1>
          <p className="text-slate-500 text-sm">Operasyonel durum ve analizler.</p>
        </div>
        <button 
          onClick={() => fetchDashboardData()}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition shadow-sm"
        >
          <RefreshIcon fontSize="small" className={isLoading ? "animate-spin" : ""} />
          Güncelle
        </button>
      </div>

      {/* 1. KATMAN: KPI KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Bekleyen" value={summary?.pendingOrders ?? 0} icon={<Inventory2Icon className="text-amber-600" />} color="bg-amber-50 border-amber-100" />
        <StatCard title="Aktif Filo" value={`${summary?.activeVehicles ?? 0}/${summary?.totalVehicles ?? 0}`} icon={<LocalShippingIcon className="text-blue-600" />} color="bg-blue-50 border-blue-100" />
        <StatCard title="Maliyet" value={`₺${summary?.lastCost?.toLocaleString() ?? 0}`} icon={<AttachMoneyIcon className="text-green-600" />} color="bg-green-50 border-green-100" />
        <StatCard title="Verim" value={`%${summary?.efficiency ?? 0}`} icon={<TrendingUpIcon className="text-purple-600" />} color="bg-purple-50 border-purple-100" />
      </div>

      {/* 2. KATMAN: HARİTA VE PASTA GRAFİĞİ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* HARİTA (HATA DÜZELTİLDİ: height: 100% zorunlu) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[500px] min-w-0">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MapIcon className="text-slate-400" /> Bölgesel Yoğunluk
          </h3>
          <div className="flex-1 rounded-xl overflow-hidden border border-slate-100 relative min-h-0">
            {heatmapData && heatmapData.length > 0 ? (
              <MapContainer 
                center={mapCenter} 
                zoom={12} 
                style={{ height: "100%", width: "100%", zIndex: 1 }}
              >
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                {heatmapData.map((loc, idx) => (
                  <CircleMarker 
                    key={`${loc.id}-${idx}`} 
                    center={[loc.lat, loc.lng]}
                    radius={Math.max(10, (loc.weight || 0) / 5)} 
                    fillColor="#F59E0B"
                    color="#D97706"
                    weight={2}
                    fillOpacity={0.7}
                  >
                    <Popup>
                      <div className="text-xs">
                        <strong>{loc.address || "İstasyon"}</strong><br/>
                        Yük: {loc.weight} kg
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-slate-50 text-slate-400 italic">
                Bekleyen Kargo Verisi Yok.
              </div>
            )}
          </div>
        </div>

        {/* PASTA GRAFİĞİ (HATA DÜZELTİLDİ: ResponsiveContainer fix) */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[500px] min-w-0">
          <h3 className="font-bold text-slate-800 mb-6">Durum Dağılımı</h3>
          <div className="flex-1 w-full relative min-w-0 min-h-[250px]">
            {statusDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8}>
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94A3B8'} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 text-sm italic">Veri yok.</div>
            )}
          </div>
          <div className="mt-4 space-y-2 max-h-[150px] overflow-y-auto">
             {statusDistribution?.map((item, index) => (
              <div key={index} className="flex justify-between text-xs items-center p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: STATUS_COLORS[item.name] || '#94A3B8'}}></span>
                  <span className="text-slate-600 font-bold">{item.name}</span>
                </div>
                <span className="font-black">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. KATMAN: TREND VE ALARMLAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[400px] flex flex-col min-w-0">
          <h3 className="font-bold text-slate-800 mb-8">Haftalık Trafik</h3>
          <div className="flex-1 w-full relative min-w-0 min-h-0">
            {weeklyStats?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="orders" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={3} />
                  <Area type="monotone" dataKey="completed" stroke="#10B981" fill="transparent" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">Veri yok.</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[400px] flex flex-col min-w-0">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
            <span>Operasyonel Uyarılar</span>
            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-md font-bold uppercase tracking-widest">Canlı</span>
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {alerts?.length > 0 ? (
              alerts.map((alert, idx) => (
                <AlertItem key={idx} type={alert.type} title={alert.title} desc={alert.desc} time={alert.time} />
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300 italic text-sm">Aktif bildirim yok.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// YARDIMCI BİLEŞENLER
const StatCard = ({ title, value, icon, color }) => (
  <div className={`p-6 bg-white rounded-2xl border border-slate-200 transition-all hover:shadow-md`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    </div>
    <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{title}</h4>
    <div className="mt-2 text-2xl font-black text-slate-800 tracking-tight">{value}</div>
  </div>
);

const AlertItem = ({ type, title, desc, time }) => {
  const configs = {
    warning: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", icon: <WarningAmberIcon fontSize="small" /> },
    error: { bg: "bg-red-50", border: "border-red-100", text: "text-red-700", icon: <ErrorOutlineIcon fontSize="small" /> },
    info: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700", icon: <LocalShippingIcon fontSize="small" /> }
  };
  const config = configs[type] || configs.info;
  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border ${config.bg} ${config.border} transition-transform hover:scale-[1.01]`}>
      <div className={`p-2 rounded-lg shrink-0 bg-white shadow-sm ${config.text}`}>{config.icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1 leading-none">
          <h5 className="text-sm font-bold text-slate-900">{title}</h5>
          <span className="text-[10px] text-slate-400 font-mono font-bold">{time}</span>
        </div>
        <p className="text-xs text-slate-600 leading-snug mt-1">{desc}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;