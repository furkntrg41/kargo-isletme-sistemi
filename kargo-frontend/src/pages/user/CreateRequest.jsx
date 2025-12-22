import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useStationStore from '../../stores/useStationStore';
import { cargoService } from '../../services/cargoServices';

// İkonlar
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScaleIcon from '@mui/icons-material/Scale';
import InventoryIcon from '@mui/icons-material/Inventory';
import SendIcon from '@mui/icons-material/Send';
import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarsIcon from '@mui/icons-material/Stars';

const CreateRequest = () => {
  const navigate = useNavigate();
  const { stations, fetchStations } = useStationStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fromStationId: '',
    quantity: 1,
    weight: 1
  });

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const depotStation = stations.find(s => s.isDepot);
  const availableStations = stations.filter(s => !s.isDepot && s.isActive);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fromStationId) {
      toast.error("Lütfen bir çıkış şubesi seçiniz.");
      return;
    }

    setLoading(true);
    try {
      await cargoService.createRequest({
        fromStationId: parseInt(formData.fromStationId),
        toStationId: depotStation.id,
        quantity: parseInt(formData.quantity),
        weight: parseFloat(formData.weight)
      });
      toast.success("Kargo talebiniz başarıyla alındı!");
      navigate('/user/my-requests');
    } catch (error) {
      toast.error(error.response?.data || "Talep oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* BAŞLIK ALANI */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight mb-2">Yeni Talep Oluştur</h1>
            <p className="text-slate-400 font-medium">Lojistik ağımıza yeni bir kargo girişi yapın.</p>
          </div>
          <div className="flex gap-4 items-center bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase text-blue-400">Merkez Depo</p>
                <p className="font-bold text-sm">{depotStation?.name || "Yükleniyor..."}</p>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                <LocationOnIcon fontSize="small"/>
             </div>
          </div>
        </div>
        {/* Dekoratif Arka Plan Işığı */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* FORM ALANI */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* ŞUBE SEÇİMİ */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group transition-all hover:border-blue-200">
              <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                <LocationOnIcon className="text-blue-600" fontSize="small"/> Çıkış Şubesi
              </label>
              <div className="relative">
                <select
                  value={formData.fromStationId}
                  onChange={(e) => setFormData({...formData, fromStationId: e.target.value})}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-lg font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Şube Seçiniz...</option>
                  {availableStations.map(station => (
                    <option key={station.id} value={station.id}>{station.name}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ArrowForwardIcon />
                </div>
              </div>
            </div>

            {/* KARGO DETAYLARI */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all hover:border-orange-200">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-8">
                <InventoryIcon className="text-orange-500" fontSize="small"/> Yük Detayları
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <span className="text-sm font-black text-slate-700 ml-2">Paket Adedi</span>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-xl font-black text-slate-800 outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white transition-all text-center"
                  />
                </div>
                <div className="space-y-3">
                  <span className="text-sm font-black text-slate-700 ml-2">Toplam Ağırlık (kg)</span>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-xl font-black text-slate-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-center"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-blue-500/40 transition-all active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50"
            >
              {loading ? "İŞLENİYOR..." : (
                <>
                  <span>TALEBİ ONAYLA</span>
                  <ArrowForwardIcon className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* SAĞ TARAF: ÖZET VE BİLGİ */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* SÜREÇ KARTI */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest mb-8">
              <StarsIcon className="text-blue-600" /> Gönderim Özeti
            </h3>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <span className="text-slate-500 font-bold">Çıkış</span>
                <span className="font-black text-slate-800">{availableStations.find(s => s.id == formData.fromStationId)?.name || "Seçilmedi"}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-3xl border border-slate-100">
                <span className="text-slate-500 font-bold">Varış</span>
                <span className="font-black text-blue-600">{depotStation?.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                 <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                    <p className="text-[10px] font-black text-blue-400 uppercase mb-1">Hacim</p>
                    <p className="text-2xl font-black text-blue-700">{formData.quantity} <span className="text-xs">PK</span></p>
                 </div>
                 <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Ağırlık</p>
                    <p className="text-2xl font-black text-emerald-700">{formData.weight} <span className="text-xs">KG</span></p>
                 </div>
              </div>
            </div>
          </div>

          {/* SİSTEM NOTU */}
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <InfoIcon className="text-blue-400" fontSize="small" />
                </div>
                <h4 className="font-black uppercase text-[10px] tracking-[0.2em]">Önemli Notlar</h4>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 group/item">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 transition-all group-hover/item:scale-150"></div>
                   <p className="text-slate-400 text-xs font-bold leading-relaxed">Talebiniz <span className="text-white">Operasyon Paneline</span> düştüğünde araç planlaması yapılır.</p>
                </div>
                <div className="flex gap-4 group/item">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 transition-all group-hover/item:scale-150"></div>
                   <p className="text-slate-400 text-xs font-bold leading-relaxed">Ağırlık ve adet bilgileri <span className="text-white">toplama anında</span> şoför tarafından kontrol edilecektir.</p>
                </div>
              </div>
            </div>
            {/* Arka plan deseni */}
            <div className="absolute bottom-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
               <SendIcon sx={{ fontSize: 120 }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CreateRequest;