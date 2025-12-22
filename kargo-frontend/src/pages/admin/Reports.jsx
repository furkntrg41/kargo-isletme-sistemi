import React, { useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Legend
} from 'recharts';
import { useReportStore } from '../../stores/useReportStore';
// İkonlar
import AssessmentIcon from '@mui/icons-material/Assessment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RouteIcon from '@mui/icons-material/Route';
import InventoryIcon from '@mui/icons-material/Inventory';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StraightenIcon from '@mui/icons-material/Straighten';
import LocationCityIcon from '@mui/icons-material/LocationCity';

const Reports = () => {
  const { 
    history, 
    selectedPlan, 
    isLoading, 
    fetchHistory, 
    fetchPlanDetails, 
    clearSelectedPlan 
  } = useReportStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Sayısal değerleri güvenli formatlama (Mesafe hatası için kritik)
  const formatNum = (val) => (val !== undefined && val !== null ? Number(val).toFixed(1) : "0.0");

  if (isLoading && history.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <AssessmentIcon className="text-blue-600" /> Operasyonel Analiz Merkezi
          </h1>
          <p className="text-slate-500 text-sm">Geçmiş planlamaların maliyet ve rota verimliliği raporları.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm">
          <FileDownloadIcon fontSize="small" /> Verileri Dışa Aktar
        </button>
      </div>

      {/* ÜST GRAFİKLER */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 h-[350px] flex flex-col">
          <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-6">Maliyet Trendi (₺)</h3>
          <div className="flex-1 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="planDate" tickFormatter={(str) => new Date(str).toLocaleDateString('tr-TR', {day:'numeric', month:'short'})} fontSize={10} tick={{fill: '#94a3b8'}} />
                <YAxis fontSize={10} tick={{fill: '#94a3b8'}} />
                <Tooltip />
                <Area type="monotone" dataKey="totalCost" stroke="#3B82F6" strokeWidth={3} fill="url(#colorCost)" name="Toplam Maliyet" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 h-[350px] flex flex-col">
          <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-6">Atanan Kargo Dağılımı</h3>
          <div className="flex-1 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="planDate" tickFormatter={(str) => new Date(str).toLocaleDateString('tr-TR', {day:'numeric', month:'short'})} fontSize={10} tick={{fill: '#94a3b8'}} />
                <YAxis fontSize={10} tick={{fill: '#94a3b8'}} />
                <Tooltip />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                <Bar dataKey="acceptedCargoCount" fill="#10B981" name="Atanan" radius={[4, 4, 0, 0]} />
                <Bar dataKey={(r) => r.unassignedCargoCount < 0 ? 0 : r.unassignedCargoCount} fill="#F59E0B" name="Atanamayan" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* LİSTE TABLOSU */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-2">
          <HistoryIcon className="text-slate-400" />
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Planlama Geçmişi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Tarih / Not</th>
                <th className="px-6 py-4">Mod</th>
                <th className="px-6 py-4 text-center">Rota</th>
                <th className="px-6 py-4 text-right">Toplam Yük</th>
                <th className="px-6 py-4 text-right">Maliyet</th>
                <th className="px-6 py-4 text-right">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {history.map((run) => (
                <tr key={run.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {new Date(run.planDate).toLocaleDateString('tr-TR')}
                    <div className="text-[10px] text-slate-400 font-normal">{run.notes || `#${run.id}`}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">{run.mode}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-600">{run.totalRouteCount}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-500">{run.totalLoadKg} kg</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">₺{formatNum(run.totalCost)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => fetchPlanDetails(run.id)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                      <VisibilityIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAY MODALI (DRILL-DOWN) */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in duration-200">
            
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-black text-slate-800 text-xl">Plan Detay Analizi <span className="text-blue-600">#{selectedPlan.id}</span></h3>
                <p className="text-slate-500 text-xs mt-1">Strateji: {selectedPlan.objective} • Mod: {selectedPlan.mode}</p>
              </div>
              <button onClick={clearSelectedPlan} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition text-slate-400"><CloseIcon /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {/* Özet Kartları */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <DetailMiniCard icon={<RouteIcon className="text-blue-600"/>} label="Toplam Mesafe" value={`${formatNum(selectedPlan.deliveryRoutes?.reduce((acc, r) => acc + r.totalDistanceKm, 0))} KM`} />
                <DetailMiniCard icon={<InventoryIcon className="text-emerald-600"/>} label="Atanan Kargo" value={selectedPlan.acceptedCargoCount} />
                <DetailMiniCard icon={<LocalShippingIcon className="text-orange-600"/>} label="Araç Sayısı" value={selectedPlan.totalRouteCount} />
                <DetailMiniCard icon={<AssessmentIcon className="text-purple-600"/>} label="Maliyet" value={`₺${formatNum(selectedPlan.totalCost)}`} />
              </div>

              {/* ROTA LİSTESİ */}
              <h4 className="font-black text-slate-800 mb-6 text-sm uppercase tracking-widest flex items-center gap-2">
                <RouteIcon fontSize="small" className="text-slate-400"/> Aktif Rotalar
              </h4>
              
              <div className="space-y-6">
                {selectedPlan.deliveryRoutes?.map((route, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-[2rem] overflow-hidden bg-white shadow-sm">
                    {/* Rota Üst Bilgi */}
                    <div className="p-6 bg-slate-50 flex flex-col md:flex-row justify-between gap-4 border-b border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 border border-slate-200">
                          <LocalShippingIcon />
                        </div>
                        <div>
                          <div className="font-black text-slate-800 text-lg">{route.vehicle?.plateNumber}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">{route.vehicle?.type} • Kapasite: {route.vehicle?.capacityKg}kg</div>
                        </div>
                      </div>
                      <div className="flex gap-8">
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Mesafe</div>
                          <div className="text-sm font-black text-blue-600 flex items-center gap-1">
                            <StraightenIcon style={{fontSize:14}}/> {formatNum(route.totalDistanceKm)} KM
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Yük Durumu</div>
                          <div className="text-sm font-black text-slate-700">{route.totalLoadKg} / {route.vehicle?.capacityKg} KG</div>
                        </div>
                      </div>
                    </div>

                    {/* Duraklar (İstasyonlar) */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h5 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-tighter">İstasyon Akışı</h5>
                        <div className="space-y-4">
                          {route.routeStops?.sort((a,b) => a.stopOrder - b.stopOrder).map((stop, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-3 relative">
                              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black border border-blue-100 z-10">
                                {stop.stopOrder}
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-bold text-slate-700">{stop.station?.name}</div>
                                <div className="text-[9px] text-slate-400">+{formatNum(stop.distanceFromPreviousKm)} km önceki noktadan</div>
                              </div>
                              {sIdx < route.routeStops.length - 1 && (
                                <div className="absolute left-3 top-6 w-[1px] h-4 bg-slate-200"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Kargolar */}
                      <div>
                        <h5 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-tighter">Taşınan Kargolar</h5>
                        <div className="bg-slate-50 rounded-2xl p-4 space-y-2 max-h-[150px] overflow-y-auto">
                          {route.cargoRequests?.map((cargo, cIdx) => (
                            <div key={cIdx} className="flex justify-between items-center text-[11px] bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                              <div className="flex items-center gap-2">
                                <LocationCityIcon style={{fontSize:12}} className="text-slate-300"/>
                                <span className="font-bold text-slate-600">{cargo.fromStation?.name} → Gölcük</span>
                              </div>
                              <span className="font-black text-blue-600">{cargo.weight} kg</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button onClick={clearSelectedPlan} className="px-8 py-3 font-black bg-slate-800 text-white rounded-2xl shadow-xl hover:bg-slate-700 transition">ANLADIM</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailMiniCard = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-lg font-black text-slate-800">{value}</div>
  </div>
);

export default Reports;