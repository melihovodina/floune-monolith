import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Upload, Bell, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <button 
          className="md:hidden mr-4 text-gray-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={24} />
        </button>
        
        <Link to="/" className="flex items-center">
          <div className="text-orange-500 mr-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14.5C12 13.672 12.672 13 13.5 13C14.328 13 15 13.672 15 14.5C15 15.328 14.328 16 13.5 16C12.672 16 12 15.328 12 14.5Z" fill="currentColor"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2ZM4 4V20H8C8.55229 20 9 19.5523 9 19V13.5C9 11.0147 11.0147 9 13.5 9C15.9853 9 18 11.0147 18 13.5C18 15.9853 15.9853 18 13.5 18C12.2744 18 11.1469 17.5403 10.2812 16.7812C10.1039 16.9489 10 17.1734 10 17.4142V19C10 20.1046 9.10457 21 8 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3V4Z" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-white font-bold text-xl">Floune</span>
        </Link>
      </div>
      
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search tracks, artists, or playlists"
            className="w-full bg-gray-700 rounded-full py-2 px-4 pl-10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button type="submit" className="hidden">Search</button>
      </form>
      
      <div className="flex items-center space-x-3">
        {isAuthenticated ? (
          <>
            <Link to="/upload" className="text-gray-300 hover:text-white">
              <Upload size={20} />
            </Link>
            <Link to="/notifications" className="text-gray-300 hover:text-white">
              <Bell size={20} />
            </Link>
            <div className="relative group">
              <Link to="/profile" className="flex items-center text-gray-300 hover:text-white">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.username} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}
              </Link>
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Settings</Link>
                {user?.isArtist ? (
                  <Link to="/artist-dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Artist Dashboard</Link>
                ) : (
                  <Link to="/artist-request" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Become an Artist</Link>
                )}
                <button 
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-300 hover:text-white text-sm">
              Sign In
            </Link>
            <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-1.5 px-4 rounded-full">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;