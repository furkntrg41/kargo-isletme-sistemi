import { Outlet } from 'react-router-dom';

import UserSidebar from './UserSidebar';
import UserTopbar from './UserTopbar';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-72 flex flex-col">
        <UserTopbar />
        
        {/* Page Content */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserLayout;