import { useEffect, useState, useMemo } from 'react';
import BaseMap from '../../components/map/BaseMap';
import useOptimizationStore from '../../stores/useOptimizationStore';
import useStationStore from '../../stores/useStationStore';
import useSimulationStore from '../../stores/useSimilationStore';
import { parseRouteGeometry } from '../../utils/mapUtils'; 
import { getPositionAtProgress } from '../../utils/simulationUtils';

// İkonlar
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import SpeedIcon from '@mui/icons-material/Speed';
import ReplayIcon from '@mui/icons-material/Replay';
import FlagIcon from '@mui/icons-material/Flag';

const ActiveOperations = () => {
  const { activePlan, fetchActivePlan, isLoading, completeOperation } = useOptimizationStore();
  const { stations, fetchStations } = useStationStore();
  const { progress, isPlaying, setIsPlaying, simulationSpeed, setSimulationSpeed, resetSimulation } = useSimulationStore();
  
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchActivePlan();
    fetchStations();
  }, []);

  // --- OTOMATİK TEMİZLİK: Plan Arşivlendiğinde UI'ı Sıfırla ---
  useEffect(() => {
    if (!activePlan && !isLoading) {
      resetSimulation();
      setSelectedRouteId(null);
      setShowSuccess(false);
    }
  }, [activePlan, isLoading, resetSimulation]);

  // Başarı mesajı kontrolü
  useEffect(() => {
    if (progress >= 100 && activePlan) {
      setShowSuccess(true);
    } else {
      setShowSuccess(false);
    }
  }, [progress, activePlan]);

  // Arşivleme Aksiyonu
  const handleComplete = async () => {
    try {
      await completeOperation(activePlan.id);
      resetSimulation(); // Local store'u sıfırla
      fetchActivePlan(); // Yeni veri durumunu kontrol et
    } catch (error) {
      console.error("Tamamlama hatası:", error);
    }
  };

  const vehiclePositions = useMemo(() => {
    if (!activePlan) return [];
    return activePlan.deliveryRoutes.map(route => {
      try {
        const points = parseRouteGeometry(route.pathGeometry);
        return {
          id: route.id,
          plateNumber: route.vehicle.plateNumber,
          position: getPositionAtProgress(points, progress / 100)
        };
      } catch (e) { return null; }
    }).filter(Boolean);
  }, [progress, activePlan]);

  if (isLoading) return <div className="flex h-full items-center justify-center font-black text-slate-400 animate-pulse uppercase tracking-widest font-mono">Veriler Eşitleniyor...</div>;

  return (
    <div className="flex h-[calc(100vh-80px)] -m-8 relative bg-[#f8fafc] overflow-hidden">
      
      {/* BAŞARI MESAJI */}
      {showSuccess && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className="bg-emerald-500 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border-4 border-white">
            <div className="bg-white/20 p-2 rounded-full"><FlagIcon /></div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest leading-none">Hedefe Ulaşıldı</p>
              <p className="text-[10px] font-bold opacity-90">Operasyonu arşivleyebilirsiniz.</p>
            </div>
          </div>
        </div>
      )}

      {/* SOL PANEL */}
      <aside className="w-[400px] bg-white border-r border-slate-200 flex flex-col z-20 shadow-xl">
        <div className="px-8 py-8 border-b border-slate-50 bg-white">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-slate-900 rounded-2xl shadow-lg">
                <AssignmentIcon className="text-white" fontSize="small" />
             </div>
             <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">Canlı Operasyon</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {activePlan ? `OPERASYON: #${activePlan.id}` : "SİSTEM BOŞTA"}
                </p>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#fcfcfc]">
          {!activePlan ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-300 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-white/50 text-center p-10">
              <LocalShippingIcon sx={{ fontSize: 48 }} className="mb-4 opacity-10"/>
              <p className="text-[10px] font-black uppercase tracking-widest">Şu an aktif bir sevkiyat planı bulunmuyor.</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* KUMANDA PANELİ */}
              <div className="bg-[#1e293b] rounded-[2.5rem] p-7 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">İlerleme</span>
                      <span className={`text-2xl font-black ${progress >= 100 ? 'text-emerald-400' : 'text-indigo-300'}`}>
                        %{Math.floor(progress)}
                      </span>
                  </div>
                  
                  <div className="w-full bg-slate-700/50 h-2.5 rounded-full mb-8 overflow-hidden">
                      <div 
                          className={`h-full ${progress >= 100 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-indigo-400'}`} 
                          style={{ width: `${progress}%`, transition: 'none', willChange: 'width' }}
                      ></div>
                  </div>

                  <div className="flex items-center gap-3">
                      <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          disabled={progress >= 100}
                          className={`flex-1 py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2
                              ${progress >= 100 ? 'bg-slate-800 text-slate-500 opacity-50' : (isPlaying ? 'bg-slate-700 hover:bg-slate-600' : 'bg-indigo-500 hover:bg-indigo-600')}`}
                      >
                          {isPlaying ? <PauseCircleFilledIcon fontSize="small"/> : <PlayArrowIcon fontSize="small"/>}
                          {isPlaying ? 'DURAKLAT' : (progress > 0 ? 'DEVAM ET' : 'BAŞLAT')}
                      </button>
                      <button onClick={resetSimulation} className="p-4 rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-all border border-slate-700">
                          <ReplayIcon fontSize="small" />
                      </button>
                  </div>

                  <div className="mt-8 flex items-center gap-4 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
                      <SpeedIcon className="text-slate-500" sx={{ fontSize: 18 }} />
                      <input 
                          type="range" min="1" max="100" value={simulationSpeed}
                          onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                          className="flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                      />
                      <span className="text-[10px] font-black text-slate-500 w-8 text-right">{simulationSpeed}x</span>
                  </div>
                </div>
              </div>

              {/* ARAÇ LİSTESİ */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Filo Takibi</h3>
                {activePlan.deliveryRoutes.map((route, index) => (
                    <div 
                      key={route.id || index} 
                      onClick={() => setSelectedRouteId(route.id)}
                      className={`p-4 rounded-3xl border transition-all cursor-pointer ${selectedRouteId === route.id ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-50 bg-white'}`}
                    >
                        <div className="flex justify-between items-center mb-3">
                           <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl ${progress >= 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                 <LocalShippingIcon fontSize="small"/>
                              </div>
                              <span className="font-black text-slate-700 text-sm tracking-tighter">{route.vehicle.plateNumber}</span>
                           </div>
                           {progress >= 100 && <CheckCircleIcon className="text-emerald-500 animate-in zoom-in" fontSize="small"/>}
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className={`h-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-400'}`} style={{ width: `${progress}%`, transition: 'none' }}></div>
                        </div>
                    </div>
                ))}
              </div>

              {/* ARŞİVLE BUTONU */}
              {progress >= 100 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <button 
                    onClick={handleComplete}
                    className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black text-xs tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 animate-pulse"
                  >
                    <CheckCircleIcon /> TAMAMLA VE ARŞİVLE
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* HARİTA */}
      <main className="flex-1 relative h-full z-0 bg-white">
        <BaseMap 
            routes={activePlan?.deliveryRoutes || []} 
            selectedRouteId={selectedRouteId}
            allStations={stations} 
            simulationPositions={activePlan ? vehiclePositions : []} 
        />
      </main>
    </div>
  );
};

export default ActiveOperations;