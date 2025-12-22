import { NavLink } from 'react-router-dom';
import useLayoutStore from '../../stores/useLayoutStore';
import useAuthStore from '../../stores/useAuthStore'; // AuthStore eklendi

// MUI Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonIcon from '@mui/icons-material/Person';

const AdminSidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();
  const { user, logout } = useAuthStore(); // Kullanıcı bilgisi ve logout fonksiyonu

  const menuItems = [
    {
      category: 'OPERASYON',
      items: [
        { name: 'Operasyon & Harita', path: '/admin/operations', icon: <MapIcon /> },
        { name: 'Aktif Operasyon', path: '/admin/active-operation', icon: <LocalShippingIcon /> },
        { name: 'Genel Bakış', path: '/admin/dashboard', icon: <DashboardIcon /> },
      ]
    },
    {
      category: 'YÖNETİM',
      items: [
        { name: 'Araç Filosu', path: '/admin/vehicles', icon: <LocalShippingIcon /> },
        { name: 'İstasyonlar', path: '/admin/station', icon: <MapIcon /> },
        { name: 'Raporlar', path: '/admin/reports', icon: <AnalyticsIcon /> },
        { name: 'Kullanici Biletleri', path: '/admin/support-tickets', icon: <PersonIcon /> },
        { name: 'Ayarlar', path: '/admin/settings', icon: <SettingsIcon /> },
      ]
    }
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen bg-slate-900 text-white flex flex-col shadow-2xl transition-all duration-300
        ${sidebarCollapsed ? 'w-20' : 'w-72'}
      `}
    >
      {/* LOGO + TOGGLE */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800">
        {!sidebarCollapsed && (
          <div>
            <h1 className="text-xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
              TEPE<span className="text-white">KARGO</span>
            </h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase mt-1">
              Lojistik Panel
            </p>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-slate-800 transition"
        >
          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto py-6 px-2 space-y-8 custom-scrollbar">
        {menuItems.map((group, index) => (
          <div key={index}>
            {!sidebarCollapsed && (
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-3">
                {group.category}
              </h3>
            )}

            <div className="space-y-1">
              {group.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                    ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  {!sidebarCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* KULLANICI BİLGİSİ & LOGOUT */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        {/* Giriş Yapan Kişi Bilgisi */}
        {!sidebarCollapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-black">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-blue-400 font-medium uppercase tracking-tighter">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`flex items-center justify-center w-full gap-2 py-3 rounded-lg transition-all duration-300 text-sm font-bold
            ${sidebarCollapsed 
              ? 'text-slate-400 hover:text-red-500' 
              : 'bg-slate-800 hover:bg-red-600/20 hover:text-red-500 border border-transparent hover:border-red-500/30'
            }`}
        >
          <LogoutIcon fontSize="small" />
          {!sidebarCollapsed && <span>Oturumu Kapat</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;