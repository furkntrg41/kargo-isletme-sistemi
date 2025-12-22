import React, { useEffect, useState } from 'react';
import { cargoService } from '../../services/cargoServices';
import { toast } from 'react-toastify';

// İkonlar
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { Navigate, useNavigate } from 'react-router-dom';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await cargoService.getMyRequests();
      setRequests(data);
    } catch (error) {
      toast.error("Talepler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Durum etiketleri için yardımcı fonksiyon
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { label: 'Beklemede', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <AccessTimeFilledIcon fontSize="inherit" /> };
      case 'Planned':
        return { label: 'Planlandı', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <LocalShippingIcon fontSize="inherit" /> };
      case 'Delivered':
        return { label: 'Teslim Edildi', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircleIcon fontSize="inherit" /> };
      case 'Rejected':
        return { label: 'Reddedildi', color: 'bg-red-100 text-red-700 border-red-200', icon: <CancelIcon fontSize="inherit" /> };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200', icon: null };
    }
  };

  return (
    <div className="space-y-8">
      {/* ÜST BAŞLIK */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Taleplerim</h1>
          <p className="text-slate-500 font-medium">Gönderdiğiniz tüm kargoların güncel durumunu takip edin.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Toplam Talep:</span>
          <span className="ml-2 text-lg font-black text-blue-600">{requests.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100">
          <Inventory2Icon className="text-slate-200 mb-4" sx={{ fontSize: 80 }} />
          <h3 className="text-xl font-black text-slate-800">Henüz bir talebiniz yok</h3>
          <p className="text-slate-500 mb-6">Yeni bir kargo talebi oluşturarak başlayabilirsiniz.</p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all"
          onClick={() => navigate('/user/create -request')}
          >
            Hemen Oluştur
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((request) => {
            const status = getStatusStyle(request.status);
            return (
              <div 
                key={request.id} 
                className="bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
              >
                <div className="flex flex-wrap items-center justify-between gap-6">
                  
                  {/* DURUM İKONU VE ANA BİLGİ */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${status.color.split(' ')[0]} ${status.color.split(' ')[1]}`}>
                      {status.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-slate-300 text-xs font-bold">#{request.id}</span>
                      </div>
                      <h4 className="font-black text-slate-800 mt-1">{request.fromStationName}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        Çıkış Noktası
                      </p>
                    </div>
                  </div>

                  {/* VARIŞ NOKTASI OK SİMGESİ */}
                  <div className="hidden md:block">
                    <div className="flex flex-col items-center">
                       <div className="w-12 h-[2px] bg-slate-100 relative">
                          <ChevronRightIcon className="absolute -right-2 -top-[11px] text-slate-200" />
                       </div>
                    </div>
                  </div>

                  {/* VARIŞ BİLGİSİ */}
                  <div className="min-w-[150px]">
                    <h4 className="font-black text-slate-800">{request.toStationName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Varış Noktası</p>
                  </div>

                  {/* DETAYLAR (KİLO/ADET) */}
                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-800">{request.weight} kg</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Ağırlık</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-800">{request.quantity} Adet</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Paket</p>
                    </div>
                  </div>

                  {/* TARİH VE BUTON */}
                  <div className="flex items-center gap-6 ml-auto">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-black text-slate-800">
                        {new Date(request.requestedDate).toLocaleDateString('tr-TR')}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Talep Tarihi</p>
                    </div>
                    
                    {/* RED SEBEBİ VARSA (TOOLTIP GİBİ) */}
                    {request.rejectionReason && (
                      <div className="group relative">
                         <CancelIcon className="text-red-400 cursor-help" />
                         <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-red-600 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-lg">
                            <strong>Red Sebebi:</strong><br/>{request.rejectionReason}
                         </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRequests;