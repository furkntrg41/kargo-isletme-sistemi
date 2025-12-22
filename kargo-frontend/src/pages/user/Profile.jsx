import React, { useState } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import { toast } from 'react-toastify';

// İkonlar
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import KeyIcon from '@mui/icons-material/Key';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FingerprintIcon from '@mui/icons-material/Fingerprint'; // ID yerine ikon

const Profile = () => {
  const { user, changePassword, isLoading } = useAuthStore();
  
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Lütfen tüm alanları doldurun.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Yeni şifreler eşleşmiyor.");
      return;
    }

    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);

    if (result.success) {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Profil Ayarları</h1>
        <p className="text-slate-500 font-medium font-sans">Hesap bilgilerinizi ve şifre güvenliğinizi yönetin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- DÜZELTİLEN SOL KOLON: KURUMSAL KİMLİK KARTI --- */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            {/* Üst Renkli Şerit */}
            <div className="h-24 bg-gradient-to-br from-blue-600 to-blue-400 relative">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-xl">
                        <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-blue-600">
                            <PersonIcon sx={{ fontSize: 32 }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-14 pb-8 px-8 text-center">
              <h2 className="text-xl font-black text-slate-800">{user?.firstName} {user?.lastName}</h2>
              <p className="text-slate-400 text-xs font-bold mb-4">{user?.email}</p>
              
              <div className="inline-flex items-center gap-1.5 bg-blue-50 px-3 py-1 rounded-full mb-6">
                <VerifiedUserIcon className="text-blue-500" sx={{ fontSize: 14 }} />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{user?.role}</span>
              </div>

              {/* Bilgi Gridleri */}
              <div className="grid grid-cols-2 gap-2 border-t border-slate-50 pt-6">
                 <div className="text-left p-3 rounded-2xl bg-slate-50/50 border border-slate-50">
                    <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                        <FingerprintIcon sx={{ fontSize: 12 }} /> No
                    </div>
                    <p className="text-xs font-black text-slate-700">#{user?.id?.substring(0, 6).toUpperCase()}</p>
                 </div>
                 <div className="text-left p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Durum</div>
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <p className="text-xs font-black text-slate-700">Aktif</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <h3 className="font-black text-xs uppercase tracking-widest mb-2 flex items-center gap-2 relative z-10">
               Bilgilendirme
            </h3>
            <p className="text-slate-400 text-[11px] font-medium leading-relaxed relative z-10">
              Güvenliğiniz için şifrenizi en az 90 günde bir değiştirmenizi öneririz.
            </p>
          </div>
        </div>

        {/* SAĞ KOLON: FORM ALANLARI (Aynı kalıyor) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
              <BadgeIcon className="text-blue-600" /> Hesap Bilgileri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileInput label="Kullanıcı Adı" value={user?.userName} icon={<PersonIcon />} disabled />
              <ProfileInput label="E-Posta" value={user?.email} icon={<EmailIcon />} disabled />
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
              <KeyIcon className="text-orange-500" /> Şifre Güvenliği
            </h3>
            <div className="space-y-6">
              <input 
                type="password" 
                placeholder="Mevcut Şifre"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="password" 
                  placeholder="Yeni Şifre"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                <input 
                  type="password" 
                  placeholder="Yeni Şifre (Tekrar)"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {isLoading ? "İŞLENİYOR..." : "ŞİFREYİ GÜNCELLE"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Yardımcı Input Bileşeni
const ProfileInput = ({ label, value, icon, disabled }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
        {React.cloneElement(icon, { fontSize: 'small' })}
      </div>
      <input 
        type="text" 
        value={value || ''} 
        disabled={disabled}
        className="w-full pl-12 pr-6 py-4 rounded-2xl text-sm font-bold border border-slate-50 bg-slate-50 text-slate-500 cursor-not-allowed outline-none"
      />
    </div>
  </div>
);

export default Profile;