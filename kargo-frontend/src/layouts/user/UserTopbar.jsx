import React from 'react';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const UserTopbar = () => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex flex-col">
        <h2 className="text-slate-800 font-black text-lg leading-none">Hoş Geldiniz 👋</h2>
        <p className="text-slate-400 text-xs font-bold mt-1">Hızlıca yeni kargo talebi oluşturun.</p>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
          <NotificationsNoneIcon />
        </button>
        <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all border border-slate-100">
          <HelpOutlineIcon />
        </button>
      </div>
    </header>
  );
};

export default UserTopbar;