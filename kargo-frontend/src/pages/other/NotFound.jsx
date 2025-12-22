import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGoHome = () => {
    if (!user) {
      navigate('/login');
    } else {
      user.role === 'Admin' ? navigate('/admin/dashboard') : navigate('/user/my-requests');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-500">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Görsel Bölüm */}
        <div className="relative">
          <div className="text-[12rem] font-black text-slate-100 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] rotate-12 flex items-center justify-center shadow-2xl shadow-blue-500/40">
              <ErrorOutlineIcon sx={{ fontSize: 50, color: 'white' }} className="-rotate-12" />
            </div>
          </div>
        </div>

        {/* Metin Bölümü */}
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Yolunuzu mu kaybettiniz?</h2>
          <p className="text-slate-500 font-medium">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          </p>
        </div>

        {/* Butonlar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all active:scale-95"
          >
            <ArrowBackIcon fontSize="small" /> GERİ DÖN
          </button>
          <button 
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <HomeIcon fontSize="small" /> ANA SAYFAYA GİT
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;