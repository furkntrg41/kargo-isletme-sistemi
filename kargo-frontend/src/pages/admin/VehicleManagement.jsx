import React, { useEffect, useState } from 'react';
import useVehicleStore from '../../stores/useVehicleStore';

// İkonlar
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddIcon from '@mui/icons-material/Add';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import SearchIcon from '@mui/icons-material/Search';
import PaidIcon from '@mui/icons-material/Paid';

const VehicleManagement = () => {
  const { vehicles, isLoading, updatingId, fetchVehicles, addVehicle, toggleVehicleStatus } = useVehicleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    plateNumber: '',
    type: 0, // 0: Owned, 1: Rental
    capacityKg: 0,
    fixedRentalCost: 0
  });

  useEffect(() => {
    fetchVehicles();
    
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addVehicle(formData);
    if (result.success) {
      setIsModalOpen(false);
      setFormData({ plateNumber: '', type: 0, capacityKg: 0, fixedRentalCost: 0 });
    }
  };

  const filteredVehicles = vehicles?.filter(v => 
    v.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Araç Filosu</h1>
          <p className="text-slate-500 text-sm">Öz mal ve kiralık araç envanteri.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2.5 text-slate-400" fontSize="small" />
            <input 
              type="text"
              placeholder="Plaka ara..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none w-64 shadow-sm focus:ring-2 focus:ring-blue-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow-lg flex items-center gap-2"
          >
            <AddIcon fontSize="small" /> Yeni Araç
          </button>
        </div>
      </div>

      {/* TABLO */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 border-b border-slate-100 text-[11px] uppercase tracking-widest text-slate-400 font-black">
            <tr>
              <th className="px-6 py-4">Araç & Plaka</th>
              <th className="px-6 py-4">Mülkiyet Tipi</th>
              <th className="px-6 py-4">Kapasite</th>
              <th className="px-6 py-4">Kiralama Maliyeti</th>
              <th className="px-6 py-4 text-center">Durum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredVehicles?.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${vehicle.isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                      <LocalShippingIcon fontSize="small" />
                    </div>
                    <span className="font-bold text-slate-700">{vehicle.plateNumber}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${vehicle.fixedRentalCost === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
                    {vehicle.fixedRentalCost === 0 ? 'ÖZ MAL' : 'KİRALIK'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                  {vehicle.capacityKg.toLocaleString()} kg
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                  {vehicle.fixedRentalCost === 0 ? '-' : `₺${vehicle.fixedRentalCost.toLocaleString()}`}
                </td>
                <td className="px-6 py-4 text-center">
                  {updatingId === vehicle.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                  ) : (
                    <button onClick={() => toggleVehicleStatus(vehicle.id)}>
                      {vehicle.isActive ? (
                        <ToggleOnIcon className="text-emerald-500" fontSize="large" />
                      ) : (
                        <ToggleOffIcon className="text-slate-300" fontSize="large" />
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-50">
              <h3 className="text-xl font-black text-slate-800">Yeni Araç Ekle</h3>
              <p className="text-slate-400 text-sm mt-1">Araç detaylarını girin.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Plaka Numarası</label>
                <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white transition"
                  value={formData.plateNumber} onChange={(e) => setFormData({...formData, plateNumber: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Mülkiyet</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    value={formData.type} onChange={(e) => setFormData({...formData, type: parseInt(e.target.value)})}
                  >
                    <option value={0}>Öz Mal</option>
                    <option value={1}>Kiralık</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Kapasite (KG)</label>
                  <input type="number" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                    value={formData.capacityKg} onChange={(e) => setFormData({...formData, capacityKg: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              {formData.type === 1 && (
                <div className="space-y-1 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                    <PaidIcon style={{fontSize: 12}}/> Sabit Kiralama Maliyeti (₺)
                  </label>
                  <input type="number" required className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-2xl outline-none"
                    value={formData.fixedRentalCost} onChange={(e) => setFormData({...formData, fixedRentalCost: parseFloat(e.target.value)})}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition">İptal</button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3.5 font-black bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg disabled:opacity-50">
                  {isLoading ? 'Kaydediliyor...' : 'Aracı Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;