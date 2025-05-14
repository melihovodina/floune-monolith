import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { Users, Music, Flag, Settings, LogOut, User, BarChart3, PlusCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import AdminArtistRequests from './AdminArtistRequests';
import AdminUserManagement from './AdminUserManagement';
import AdminTrackManagement from './AdminTrackManagement';
import AdminOverview from './AdminOverview';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Redirect if not admin
  useEffect(() => {
    // This would check for admin role in a real app
    const isAdmin = true; // Mocked for demo
    
    if (!isAdmin) {
      navigate('/');
    }
  }, [navigate, user]);
  
  return (
    <div className="flex h-full overflow-hidden bg-gray-900">
      {/* Sidebar */}
      <div className={`bg-gray-800 w-64 fixed inset-y-0 z-50 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
            <div className="flex items-center">
              <div className="text-orange-500 mr-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 14.5C12 13.672 12.672 13 13.5 13C14.328 13 15 13.672 15 14.5C15 15.328 14.328 16 13.5 16C12.672 16 12 15.328 12 14.5Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2ZM4 4V20H8C8.55229 20 9 19.5523 9 19V13.5C9 11.0147 11.0147 9 13.5 9C15.9853 9 18 11.0147 18 13.5C18 15.9853 15.9853 18 13.5 18C12.2744 18 11.1469 17.5403 10.2812 16.7812C10.1039 16.9489 10 17.1734 10 17.4142V19C10 20.1046 9.10457 21 8 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3V4Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-white font-bold">Admin Dashboard</span>
            </div>
            <button 
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              <li>
                <NavLink 
                  to="/admin"
                  end
                  className={({isActive}) => 
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                      isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <BarChart3 size={18} className="mr-3" /> Overview
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/users"
                  className={({isActive}) => 
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                      isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <Users size={18} className="mr-3" /> User Management
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/tracks"
                  className={({isActive}) => 
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                      isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <Music size={18} className="mr-3" /> Track Management
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/artist-requests"
                  className={({isActive}) => 
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                      isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <PlusCircle size={18} className="mr-3" /> Artist Requests 
                  <span className="ml-auto bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    5
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/reports"
                  className={({isActive}) => 
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                      isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <Flag size={18} className="mr-3" /> Reports 
                  <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    3
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/admin/settings"
                  className={({isActive}) => 
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                      isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <Settings size={18} className="mr-3" /> Settings
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  <User size={16} className="text-gray-300" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-gray-400">admin@soundwave.com</p>
              </div>
              <button 
                className="ml-auto text-gray-400 hover:text-white" 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800 shadow-md">
          <div className="px-4 py-3 flex items-center justify-between">
            <button 
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="text-xl font-bold text-white md:hidden">Admin Dashboard</div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="text-sm text-gray-300 hover:text-white"
              >
                Return to App
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-900 p-4">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/users" element={<AdminUserManagement />} />
            <Route path="/tracks" element={<AdminTrackManagement />} />
            <Route path="/artist-requests" element={<AdminArtistRequests />} />
            <Route path="/reports" element={<div className="text-white">Reports Page</div>} />
            <Route path="/settings" element={<div className="text-white">Settings Page</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;