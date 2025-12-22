import React, { useEffect } from 'react';
import useSettingsStore from '../../stores/useSettingsStore';
// İkonlar
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TuneIcon from '@mui/icons-material/Tune';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Settings = () => {
  const { config, fetchSettings, updateLocalConfig, saveSettings, isLoading } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      {/* ÜST BAŞLIK VE KAYDET BUTONU */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <SettingsIcon className="text-blue-600" /> Sistem Parametreleri
          </h1>
          <p className="text-slate-500 text-sm italic">
            Bu sayfadaki değişiklikler kargo rota optimizasyon algoritmasını doğrudan etkiler.
          </p>
        </div>
        <button 
          onClick={saveSettings}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? "GÜNCELLENİYOR..." : <><SaveIcon fontSize="small" /> AYARLARI KAYDET</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* MALİYET VE OPTİMİZASYON KARTI */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
          <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 uppercase text-xs tracking-widest border-b border-slate-50 pb-4">
            <TuneIcon className="text-blue-600" fontSize="small"/> Optimizasyon Giderleri
          </h3>
          <div className="space-y-8">
            <SettingInput 
              label="KM Başına Maliyet (₺)" 
              value={config.costPerKm} 
              onChange={(v) => updateLocalConfig({ costPerKm: parseFloat(v) })}
              desc="Araçların mesafe bazlı yakıt ve operasyonel gider katsayısı."
            />
            <SettingInput 
              label="Kiralık Araç Sabit Bedeli (₺)" 
              value={config.rentalVehicleCost} 
              onChange={(v) => updateLocalConfig({ rentalVehicleCost: parseFloat(v) })}
              desc="Ekstra kiralık araç her çağrıldığında eklenen taban ücret."
            />
          </div>
        </div>

        {/* FİLO VE KAPASİTE AYARLARI KARTI */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
          <h3 className="font-black text-slate-800 mb-8 flex items-center gap-2 uppercase text-xs tracking-widest border-b border-slate-50 pb-4">
            <LocalShippingIcon className="text-orange-500" fontSize="small"/> Operasyonel Sınırlar
          </h3>
          <div className="space-y-8">
            <SettingInput 
              label="Kiralık Araç Kapasitesi (KG)" 
              value={config.defaultRentalCapacityKg} 
              onChange={(v) => updateLocalConfig({ defaultRentalCapacityKg: parseFloat(v) })}
              desc="Sınırsız Filo modunda oluşturulan kiralık araçların varsayılan kapasitesi."
            />
            <SettingInput 
              label="Rota Başı Maksimum Durak" 
              value={config.maxStopsPerRoute} 
              onChange={(v) => updateLocalConfig({ maxStopsPerRoute: parseInt(v) })}
              desc="Bir aracın bir seferde uğrayabileceği en fazla istasyon sayısı."
            />
          </div>
        </div>

      </div>

      {/* SON GÜNCELLEME BİLGİSİ */}
      <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
        <AccessTimeIcon style={{ fontSize: 14 }} />
        Son Güncelleme: {config.updatedAt ? new Date(config.updatedAt).toLocaleString('tr-TR') : 'Henüz güncellenmedi'}
      </div>
    </div>
  );
};

// Yardımcı Input Bileşeni
const SettingInput = ({ label, value, onChange, desc }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 group">
    <div className="max-w-md">
      <label className="text-sm font-black text-slate-700 block mb-1 group-hover:text-blue-600 transition-colors">{label}</label>
      <p className="text-[11px] text-slate-400 font-bold leading-relaxed">{desc}</p>
    </div>
    <div className="relative">
      <input 
        type="number" 
        step="0.1"
        className="w-32 px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-blue-600 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-200 transition-all text-center"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export default Settings;