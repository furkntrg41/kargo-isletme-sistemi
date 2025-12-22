import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import useLayoutStore from '../../stores/useLayoutStore';

const AdminLayout = () => {
  const { sidebarCollapsed } = useLayoutStore();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">

      {/* SABİT SIDEBAR */}
      <AdminSidebar />

      {/* SAĞ TARAF */}
      <div
        className={`flex flex-col min-h-screen pt-20 transition-all duration-300
          ${sidebarCollapsed ? 'ml-20' : 'ml-72'}
        `}
      >
        {/* SABİT TOPBAR */}
        <AdminTopbar />

        {/* ANA İÇERİK */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>

        {/* FOOTER */}
        <footer className="py-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} KargoAI Lojistik Sistemleri. Tüm hakları saklıdır.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;