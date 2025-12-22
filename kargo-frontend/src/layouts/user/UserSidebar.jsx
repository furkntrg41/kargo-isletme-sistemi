import { NavLink } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';

// İkonlar
import AddBoxIcon from '@mui/icons-material/AddBox';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const UserSidebar = () => {
  const { user, logout } = useAuthStore();

  const menuItems = [
    { name: 'Yeni Talep Oluştur', path: '/user/create-request', icon: <AddBoxIcon /> },
    { name: 'Taleplerim', path: '/user/my-requests', icon: <ListAltIcon /> },
    { name: 'Profilim', path: '/user/profile', icon: <PersonIcon /> },
    { name: 'Destek', path: '/user/support', icon: <SupportAgentIcon /> },
    { name: 'Taleplerim', path: '/user/my-tickets', icon: <SupportAgentIcon /> },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-72 bg-white border-r border-slate-100 flex flex-col shadow-sm transition-all duration-300">
      {/* LOGO SECTON */}
      <div className="h-20 flex items-center px-8 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-black text-xl">K</span>
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Kargo<span className="text-blue-600">Müşteri</span></h1>
        </div>
      </div>

      {/* MENU ITEMS */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200
              ${isActive 
                ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM SECTION: USER INFO & LOGOUT */}
      <div className="p-4 border-t border-slate-50 bg-slate-50/50">
        <div className="flex items-center gap-3 px-3 py-4 mb-2">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-black shadow-sm">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-slate-800 truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">{user?.role}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center justify-center w-full gap-2 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 py-3 rounded-2xl transition-all duration-300 text-xs font-black border border-slate-200 hover:border-red-100 shadow-sm"
        >
          <LogoutIcon style={{ fontSize: 18 }} />
          OTURUMU KAPAT
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;