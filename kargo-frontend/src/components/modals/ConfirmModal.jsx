import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
        
        {/* Header - Dekoratif İkon */}
        <div className="bg-slate-50 p-8 flex flex-col items-center text-center border-b border-slate-100 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-all"
          >
            <CloseIcon fontSize="small" />
          </button>
          
          <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center text-green-600 mb-4 shadow-inner">
            <CheckCircleOutlineIcon sx={{ fontSize: 40 }} />
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <p className="text-slate-500 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="p-8 pt-0 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-200 transition-all active:scale-95"
          >
            İPTAL
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'ONAYLA'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;