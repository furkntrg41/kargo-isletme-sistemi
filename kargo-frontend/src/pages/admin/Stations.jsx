import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import useStationStore from '../../stores/useStationStore';
import L from 'leaflet';

// İkonlar
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

// Harita Marker İkonları (Aktif/Pasif durumuna göre gri ikon eklendi)
const createIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const icons = {
    depot: createIcon('red'),
    station: createIcon('blue'),
    inactive: createIcon('grey') // Pasif istasyonlar gri görünecek
};

const LocationPicker = ({ setPosition }) => {
  useMapEvents({
    click(e) { setPosition([e.latlng.lat, e.latlng.lng]); },
  });
  return null;
};

const Stations = () => {
  const { stations, fetchStations, addStation, toggleActive, toggleDepot, updatingId } = useStationStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [newPos, setNewPos] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => { fetchStations(); }, []);

  const handleSave = async () => {
    if (!name || !newPos) return;
    const res = await addStation({ name, latitude: newPos[0], longitude: newPos[1], isActive: true, isDepot: false });
    if (res.success) { setIsAdding(false); setName(""); setNewPos(null); }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] -m-8 font-sans overflow-hidden relative">
      
      {/* SOL PANEL (KAPANABİLİR SIDEBAR) */}
      <aside 
        className={`bg-white border-r border-slate-200 flex flex-col shadow-2xl z-20 transition-all duration-300 ease-in-out relative
          ${isSidebarOpen ? 'w-[450px]' : 'w-0'}`}
      >
        {/* Sidebar Açma/Kapama Butonu */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute -right-10 top-6 w-10 h-10 bg-white border border-slate-200 border-l-0 rounded-r-xl flex items-center justify-center text-slate-600 shadow-md hover:bg-slate-50 transition-all z-30`}
        >
          {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>

        {/* Sidebar İçeriği (Görünürlük kontrolü) */}
        <div className={`flex-1 flex flex-col overflow-hidden ${!isSidebarOpen && 'invisible opacity-0'}`}>
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-2 whitespace-nowrap">
              <LocationOnIcon className="text-blue-600" /> Nokta Yönetimi
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isAdding ? (
              <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-4 animate-in slide-in-from-top">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest text-center">Haritaya Tıklayın</h3>
                <input 
                  placeholder="İstasyon Adı..."
                  className="w-full px-4 py-3 rounded-2xl border-none shadow-sm outline-none"
                  value={name} onChange={(e) => setName(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={() => setIsAdding(false)} className="flex-1 py-2 text-sm font-bold text-slate-400">İptal</button>
                  <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-black shadow-lg">KAYDET</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsAdding(true)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-xl">
                <AddLocationAltIcon /> YENİ NOKTA EKLE
              </button>
            )}

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kayıtlı Noktalar</h4>
              {stations.map(s => (
                <div key={s.id} className={`p-4 bg-white border rounded-2xl transition group ${!s.isActive ? 'opacity-60 border-slate-100 bg-slate-50' : 'border-slate-100 hover:border-blue-200'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${!s.isActive ? 'bg-slate-200 text-slate-500' : (s.isDepot ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600')}`}>
                        {s.isDepot ? <HomeWorkIcon fontSize="small"/> : <LocationOnIcon fontSize="small"/>}
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm leading-none ${!s.isActive ? 'text-slate-400' : 'text-slate-800'}`}>{s.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono italic">ID: #{s.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                    <button 
                      disabled={updatingId === s.id}
                      onClick={() => toggleActive(s.id)}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-black transition ${s.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}
                    >
                      {s.isActive ? <CheckCircleIcon style={{fontSize:14}}/> : <RadioButtonUncheckedIcon style={{fontSize:14}}/>} 
                      {s.isActive ? 'AKTİF' : 'PASİF'}
                    </button>
                    <button 
                      disabled={updatingId === s.id || !s.isActive}
                      onClick={() => toggleDepot(s.id)}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-black transition 
                        ${s.isDepot ? 'bg-red-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'} 
                        ${!s.isActive && 'cursor-not-allowed opacity-50'}`}
                    >
                      <HomeWorkIcon style={{fontSize:14}}/> DEPO: {s.isDepot ? 'EVET' : 'HAYIR'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* SAĞ PANEL: HARİTA */}
      <main className="flex-1 relative z-10">
        <MapContainer center={[40.765, 29.920]} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          
          {stations.map(s => (
            <Marker 
              key={s.id} 
              position={[s.latitude, s.longitude]} 
              icon={!s.isActive ? icons.inactive : (s.isDepot ? icons.depot : icons.station)}
            >
              <Popup>
                <div className="font-sans text-center">
                  <div className={`font-black uppercase text-[10px] mb-1 ${!s.isActive ? 'text-slate-400' : (s.isDepot ? 'text-red-600' : 'text-blue-600')}`}>
                    {!s.isActive ? 'Pasif İstasyon' : (s.isDepot ? 'Merkez Depo' : 'Ara İstasyon')}
                  </div>
                  <b className="text-slate-800">{s.name}</b>
                </div>
              </Popup>
            </Marker>
          ))}

          {isAdding && (
            <>
              <LocationPicker setPosition={setNewPos} />
              {newPos && <Marker position={newPos} icon={icons.station} />}
            </>
          )}
        </MapContainer>

        {/* Harita Üstü Gösterge (Opsiyonel) */}
        {!isSidebarOpen && (
          <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/50 animate-in fade-in duration-500">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Harita Lejantı</div>
             <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Depo
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> İstasyon
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span> Pasif
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Stations;