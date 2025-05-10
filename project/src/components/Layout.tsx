import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Player from './Player';
import Header from './Header';

const Layout = () => {
  return (
    <div className="h-screen bg-[#0e1216]">
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Header />
          <div className="px-6 py-4">
            <Outlet />
          </div>
        </main>
      </div>
      <Player />
    </div>
  );
};

export default Layout;