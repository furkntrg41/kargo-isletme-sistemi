import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';

// İkonlar
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Kullanıcı Adı için
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  // State yapısı Backend gereksinimlerine göre ayrıştırıldı
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'login') {
      // Login için sadece userName ve password
      await login(formData.userName, formData.password, navigate);
    } else {
      // Register için tüm obje
      const success = await register(formData, navigate);
      if (success) {
        setActiveTab('login');
        // Formu temizle (İsteğe bağlı)
        setFormData({ firstName: '', lastName: '', userName: '', email: '', password: '' });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* SOL TARAF (BRANDING) - AYNI KALIYOR */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2 animate-pulse"></div>

        <div className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <LocalShippingIcon className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-widest">TEPE<span className="text-blue-500">KARGO</span></span>
        </div>

        <div className="z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Lojistik Operasyonlarını <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Yönet</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Hızlı, güvenilir ve yapay zeka destekli filo yönetimi.
          </p>
        </div>

        <div className="z-10 text-slate-500 text-sm">© 2025 TepeKARGO.</div>
      </div>

      {/* SAĞ TARAF (FORM) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          
          {/* TABLAR */}
          <div className="flex mb-8 border-b border-gray-100">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 pb-4 text-sm font-bold transition-all border-b-2 
                ${activeTab === 'login' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              GİRİŞ YAP
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 pb-4 text-sm font-bold transition-all border-b-2 
                ${activeTab === 'register' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              KAYIT OL
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* KAYIT İÇİN: AD ve SOYAD (Yan Yana) */}
            {activeTab === 'register' && (
              <div className="flex gap-3 animate-fade-in">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Ad</label>
                  <div className="relative">
                    <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      placeholder="isim"
                      className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Soyad</label>
                  <div className="relative">
                    <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      placeholder="Soyad"
                      className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ORTAK ALAN: KULLANICI ADI */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Kullanıcı Adı</label>
              <div className="relative">
                <AccountCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                <input 
                  type="text" 
                  name="userName"
                  value={formData.userName}
                  placeholder="Kullanici Adiniz"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* KAYIT İÇİN: EMAIL */}
            {activeTab === 'register' && (
              <div className="space-y-1 animate-fade-in">
                <label className="text-[10px] font-bold text-slate-500 uppercase">E-Posta</label>
                <div className="relative">
                  <EmailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    placeholder="ornek@mail.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* ORTAK ALAN: ŞİFRE */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Şifre</label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  value={formData.password}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                  onChange={handleChange}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <VisibilityOffIcon fontSize="small"/> : <VisibilityIcon fontSize="small"/>}
                </button>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 mt-4
                ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
              `}
            >
              {isLoading ? 'İşleniyor...' : (activeTab === 'login' ? 'GİRİŞ YAP' : 'HESAP OLUŞTUR')}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;