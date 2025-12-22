import { useState, useEffect } from 'react';
import BaseMap from '../../components/map/BaseMap';
import useOptimizationStore from '../../stores/useOptimizationStore';
import useStationStore from '../../stores/useStationStore';
import ConfirmModal from '../../components/modals/ConfirmModal'; // Modal import edildi

// İkonlar
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RouteIcon from '@mui/icons-material/Route';
import TuneIcon from '@mui/icons-material/Tune';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MapIcon from '@mui/icons-material/Map';

const Operations = () => {
  // --- STORE ---
  const {
    runSimulation,
    startOperation,
    simulationResult,
    isLoading: isSimLoading
  } = useOptimizationStore();
  
  const { stations, fetchStations } = useStationStore();

  useEffect(() => { fetchStations(); }, []);

  // --- STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal kontrol state'i
  const [mode, setMode] = useState('FixedFleet');
  const [objective, setObjective] = useState('MinimizeCost');
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- HELPER: Benzersiz ID Oluşturucu ---
  const getRouteUniqueId = (route, index) => {
    return (route.id && route.id !== 0) ? route.id : `sim-${index}`;
  };

  const isOwned = (type) => type === 0 || type === 'Owned';

  // --- ACTIONS ---
  const handleSimulate = () => {
    if(isSimLoading) return;
    runSimulation({
      planName: `Plan-${new Date().toLocaleTimeString()}`,
      mode, objective, notes: "Admin panelinden manuel tetiklendi"
    });
    setSelectedRouteId(null);
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };

  // Onay Butonuna Basıldığında Modalı Açar
  const handleConfirm = () => {
    if (!simulationResult) return;
    setIsModalOpen(true);
  };

  // Modal İçindeki "Onayla" Butonuna Basıldığında Çalışır
  const handleConfirmAction = async () => {
    setIsModalOpen(false); // Modalı kapat
    await startOperation({
        planName: simulationResult.notes || "Yeni Operasyon",
        mode, objective, notes: "Onaylandı"
    });
  };

  return (
    <div className="flex h-[calc(100vh-80px)] -m-8 relative bg-gray-100 overflow-hidden">
      
      {/* ================= ONAY MODALI (CUSTOM COMPONENT) ================= */}
      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        title="Operasyonu Başlat"
        message="Oluşturulan rota planını onaylıyor ve sevkiyat sürecini başlatmak istiyor musunuz? Bu işlem araçları göreve atayacaktır."
        isLoading={isSimLoading}
      />

      {/* ================= SOL PANEL (AÇILIR/KAPANIR) ================= */}
      <aside 
        className={`
          z-20 bg-white border-r border-gray-200 flex flex-col shadow-2xl transition-all duration-300 ease-in-out relative
          ${isSidebarOpen ? 'w-[400px] translate-x-0' : 'w-0 -translate-x-full opacity-0'}
        `}
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 bg-slate-50 min-w-[400px]">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <RouteIcon className="text-blue-600" />
                Operasyon Merkezi
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                <span className="flex items-center gap-1"><WarehouseIcon style={{fontSize: 14}}/> {stations.length} İstasyon</span>
                {simulationResult && (
                  <>
                    <span>•</span>
                    <span className="text-green-600 font-bold">{simulationResult.totalRouteCount} Rota</span>
                  </>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition"
            >
              <ChevronLeftIcon />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto min-w-[400px]">
          <div className="p-6 space-y-4 border-b border-gray-100">
            
            {/* PARAMETRELER */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1">
                  <LocalShippingIcon style={{fontSize: 14}} /> Filo Modu
                </label>
                <select
                  value={mode}
                  onChange={e => setMode(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="FixedFleet">Sabit Filo</option>
                  <option value="UnlimitedFleet">Esnek Filo</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase mb-1">
                  <TuneIcon style={{fontSize: 14}} /> Optimizasyon Hedefi
                </label>
                <select
                  value={objective}
                  onChange={e => setObjective(e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="MinimizeCost">Min. Maliyet 💰</option>
                  <option value="MaximizeCargoCount">Max. Kargo 📦</option>
                  <option value="MaximizeTotalWeight">Max. Yük ⚖️</option>
                </select>
              </div>
            </div>

            {/* BUTONLAR */}
            <div className="flex gap-2">
              <button
                onClick={handleSimulate}
                disabled={isSimLoading}
                className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md
                  ${isSimLoading 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-blue-500/30 active:scale-95'}
                `}
              >
                {isSimLoading ? <span className="animate-spin text-lg">⟳</span> : <><PlayArrowIcon fontSize="small"/> HESAPLA</>}
              </button>
              
              {simulationResult && (
                  <button
                  onClick={handleConfirm}
                  className="px-4 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200 transition-colors flex items-center justify-center border border-green-200"
                  title="Operasyonu Onayla"
                  >
                  <CheckCircleIcon />
                  </button>
              )}
            </div>
          </div>

          {/* SONUÇ LİSTESİ */}
          <div className="p-4 space-y-3 bg-slate-50/50 min-h-full">
            {simulationResult && (
              <div className="flex gap-3 mb-2">
                 <div className="flex-1 bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-center">
                    <div className="text-xs text-slate-400 font-bold uppercase">Toplam Maliyet</div>
                    <div className="text-lg font-black text-slate-800">{simulationResult.totalCost.toFixed(0)}₺</div>
                 </div>
                 <div className="flex-1 bg-white p-3 rounded-lg border border-blue-100 shadow-sm text-center">
                    <div className="text-xs text-slate-400 font-bold uppercase">Toplam Yük</div>
                    <div className="text-lg font-black text-blue-600">{simulationResult.totalLoadKg} KG</div>
                 </div>
              </div>
            )}

            {simulationResult?.deliveryRoutes.map((route, index) => {
                const uniqueKey = getRouteUniqueId(route, index);
                const isSelected = selectedRouteId === uniqueKey;
                const owned = isOwned(route.vehicle.type);

                return (
                    <div 
                        key={uniqueKey}
                        onClick={() => setSelectedRouteId(uniqueKey)}
                        className={`
                          relative bg-white p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                          ${isSelected 
                              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg transform scale-[1.02] z-10' 
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}
                        `}
                    >
                        {isSelected && (
                            <div className="absolute top-2 right-2 text-blue-500 animate-fade-in">
                                <CheckCircleIcon fontSize="small" />
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-2 pr-6">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${owned ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                    <LocalShippingIcon fontSize="small" />
                                </div>
                                <div>
                                    <div className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded w-fit mb-1 ${owned ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                      {owned ? 'ÖZMAL FİLO' : 'KİRALIK ARAÇ'}
                                    </div>
                                    <div className="text-sm font-bold text-slate-800">{route.vehicle.plateNumber}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-dashed border-gray-100 pt-3 mt-1">
                             <span className="flex items-center gap-1"><RouteIcon style={{fontSize: 14}}/> {route.routeStops.length} Durak</span>
                             <span className="flex items-center gap-1"><AttachMoneyIcon style={{fontSize: 14}}/> {route.totalCost.toFixed(0)} ₺</span>
                             <span className="ml-auto font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
                               {route.totalLoadKg}kg
                             </span>
                        </div>
                    </div>
                );
            })}

            {!simulationResult && !isSimLoading && (
                <div className="flex flex-col items-center justify-center text-center opacity-40 mt-10 p-8 border-2 border-dashed border-slate-300 rounded-xl">
                    <MapIcon style={{fontSize: 48}} className="text-slate-300 mb-2"/>
                    <p className="text-sm font-bold text-slate-500">Planlama Bekleniyor</p>
                    <p className="text-xs text-slate-400">Parametreleri seçip "Hesapla" butonuna basın.</p>
                </div>
            )}
          </div>
        </div>
      </aside>

      {/* ================= PANEL AÇMA BUTONU ================= */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-4 left-4 z-[400] bg-white p-3 rounded-lg shadow-xl border border-gray-200 text-blue-600 hover:bg-blue-50 transition-all animate-fade-in group"
        >
          <ChevronRightIcon />
        </button>
      )}

      {/* ================= SAĞ PANEL (HARİTA) ================= */}
      <main className="flex-1 relative h-full shadow-inner z-0">
        <BaseMap 
            routes={simulationResult?.deliveryRoutes || []} 
            selectedRouteId={selectedRouteId}
            allStations={stations} 
        />
        
        {simulationResult && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-xl z-[400] border border-white/50 flex items-center gap-2 animate-fade-in">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-600">Simülasyon Modu</span>
            </div>
        )}
      </main>

    </div>
  );
};

export default Operations;