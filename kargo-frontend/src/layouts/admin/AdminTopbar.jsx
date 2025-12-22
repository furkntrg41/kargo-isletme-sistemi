import React, { useEffect, useState } from 'react';
import useLayoutStore from '../../stores/useLayoutStore';
import useDashboardStore from '../../stores/useDashboardStore';
import useSimulationStore from '../../stores/useSimilationStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// İkonlar
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import CloudIcon from '@mui/icons-material/Cloud';
import RefreshIcon from '@mui/icons-material/Refresh';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SevereColdIcon from '@mui/icons-material/SevereCold';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MapIcon from '@mui/icons-material/Map'; // Sevkiyat için yeni ikon

const AdminTopbar = () => {
  const { sidebarCollapsed } = useLayoutStore();
  const { summary, fetchDashboardData, isLoading } = useDashboardStore();
  const { progress, isCompleted, isPlaying } = useSimulationStore(); 
  const navigate = useNavigate();
  
  const [weather, setWeather] = useState({ temp: '--', city: 'Umuttepe', icon: null });

  useEffect(() => {
    fetchDashboardData();
    const fetchUmuttepeWeather = async () => {
      try {
        const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=40.79&longitude=29.92&current_weather=true`);
        const current = res.data.current_weather;
        const temp = Math.round(current.temperature);
        let weatherIcon = <CloudIcon className="text-blue-400" fontSize="small" />;
        if (current.weathercode === 0) weatherIcon = <WbSunnyIcon className="text-amber-500" fontSize="small" />;
        if (temp <= 0) weatherIcon = <SevereColdIcon className="text-blue-200" fontSize="small" />;
        setWeather({ temp, city: "Umuttepe Kampüsü", icon: weatherIcon });
      } catch (e) { console.error("Hava durumu hatası:", e); }
    };
    fetchUmuttepeWeather();
  }, [fetchDashboardData]);
  return (
    <header className={`fixed top-0 right-0 z-40 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between shadow-sm transition-all duration-300 ${sidebarCollapsed ? 'left-20' : 'left-72'}`}>
      
      {/* SOL: OPERASYON METRİKLERİ */}
      <div className="flex items-center gap-6">
        
        {/* 1. Bekleyen Talepler */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/admin/operations')}>
          <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 transition-all group-hover:scale-110 shadow-sm shadow-orange-100">
            <AssignmentLateIcon fontSize="small" />
          </div>
          <div className="hidden lg:block">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bekleyen</p>
            <p className="text-xs font-black text-slate-800">{isLoading ? '..' : (summary?.pendingOrders || '0')} Talep</p>
          </div>
        </div>

        {/* 2. Toplam Araç Sayısı (Eski yapı geri geldi) */}
        <div className="flex items-center gap-3 group cursor-pointer border-l border-slate-100 pl-6" onClick={() => navigate('/admin/vehicles')}>
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 transition-all group-hover:scale-110">
            <LocalShippingIcon fontSize="small" />
          </div>
          <div className="hidden lg:block">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filo</p>
            <p className="text-xs font-black text-slate-800">{isLoading ? '..' : (summary?.totalVehicles || '0')} Araç</p>
          </div>
        </div>

        {/* 3. CANLI SEVKIYAT TAKİBİ (Yeni Dinamik Yapı) */}
        {(isPlaying || progress > 0 || isCompleted) && (
          <div 
            className={`flex items-center gap-3 px-4 py-1.5 rounded-2xl transition-all cursor-pointer border ml-2
              ${isCompleted ? 'bg-emerald-50 border-emerald-100 animate-pulse' : 'bg-blue-50 border-blue-100'}`}
            onClick={() => navigate('/admin/active-operation')}
          >
            <div className={`flex items-center justify-center ${isCompleted ? 'text-emerald-600' : 'text-blue-600'}`}>
              {isCompleted ? <CheckCircleIcon fontSize="small" className="animate-bounce" /> : <MapIcon fontSize="small" className="animate-pulse" />}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Sevkiyat</p>
              <p className={`text-[11px] font-black ${isCompleted ? 'text-emerald-700' : 'text-blue-700'}`}>
                {isCompleted ? 'TAMAMLANDI' : `%${Math.floor(progress)}`}
              </p>
            </div>
          </div>
        )}

        <button onClick={() => fetchDashboardData()} className={`p-2 text-slate-300 hover:text-blue-600 transition-all ${isLoading ? 'animate-spin' : ''}`}>
          <RefreshIcon sx={{ fontSize: 16 }} />
        </button>
      </div>

      {/* SAĞ: HAVA DURUMU + AKSİYONLAR */}
      <div className="flex items-center gap-4">
        
        {/* HAVA DURUMU */}
        <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 shadow-inner">
           <div className="text-right">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Umuttepe</p>
              <p className="text-[11px] font-black text-slate-800 leading-none">{weather.temp}°C</p>
           </div>
           <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
              {weather.icon || <ThermostatIcon className="text-orange-400" fontSize="small" />}
           </div>
        </div>

        <button onClick={() => navigate('/admin/operations')} className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-95 group">
          <AddCircleOutlineIcon fontSize="small" className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-[10px] font-black uppercase tracking-widest">Hızlı Kayıt</span>
        </button>

        <button className="relative p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
          <NotificationsNoneIcon />
          {summary?.alertsCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>}
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;