import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Player from './Player';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-[#0e1216]">
      <div className="flex h-full">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto w-full">
          <Header>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-white p-2 hover:bg-[#1a1f25] rounded-lg"
            >
              <Menu size={24} />
            </button>
          </Header>
          <div className="px-4 sm:px-6 py-4 sm:mb-[80px] mb-[140px]">
            <Outlet />
          </div>
        </main>
      </div>
      <Player />
    </div>
  );
};

export default Layout;