import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, PlusSquare, Disc, Users, Upload } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <aside className="hidden md:flex flex-col w-56 bg-gray-800 p-4">
      <nav className="flex-1">
        <div className="mb-6">
          <p className="text-gray-400 text-xs uppercase font-semibold mb-2 px-2">Menu</p>
          <ul className="space-y-1">
            <li>
              <NavLink 
                to="/" 
                className={({isActive}) => 
                  `flex items-center px-2 py-2 text-sm font-medium rounded-md transition ${
                    isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Home size={18} className="mr-3" /> Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/search" 
                className={({isActive}) => 
                  `flex items-center px-2 py-2 text-sm font-medium rounded-md transition ${
                    isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Search size={18} className="mr-3" /> Search
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/library" 
                className={({isActive}) => 
                  `flex items-center px-2 py-2 text-sm font-medium rounded-md transition ${
                    isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Library size={18} className="mr-3" /> Your Library
              </NavLink>
            </li>
          </ul>
        </div>

        {isAuthenticated && (
          <div className="mb-6">
            <p className="text-gray-400 text-xs uppercase font-semibold mb-2 px-2">Your Collection</p>
            <ul className="space-y-1">
              <li>
                <NavLink 
                  to="/likes" 
                  className={({isActive}) => 
                    `flex items-center px-2 py-2 text-sm font-medium rounded-md transition ${
                      isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <Heart size={18} className="mr-3" /> Liked Tracks
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/playlists" 
                  className={({isActive}) => 
                    `flex items-center px-2 py-2 text-sm font-medium rounded-md transition ${
                      isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <PlusSquare size={18} className="mr-3" /> Your Playlists
                </NavLink>
              </li>
              {user?.isArtist && (
                <li>
                  <NavLink 
                    to="/artist-dashboard" 
                    className={({isActive}) => 
                      `flex items-center px-2 py-2 text-sm font-medium rounded-md transition ${
                        isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`
                    }
                  >
                    <Disc size={18} className="mr-3" /> Your Uploads
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        )}

        <div>
          <p className="text-gray-400 text-xs uppercase font-semibold mb-2 px-2">Discover</p>
          <ul className="space-y-1">
            <li>
              <NavLink 
                to="/artists" 
                className={({isActive}) => 
                  `flex items-center px-2 py-2 text-sm font-medium rounded-md transition ${
                    isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Users size={18} className="mr-3" /> Top Artists
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/genres" 
                className={({isActive}) => 
                  `flex items-center px-2 py-2 text-sm font-medium rounded-md transition ${
                    isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <Disc size={18} className="mr-3" /> Genres
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {isAuthenticated && (
        <div className="mt-auto pt-4 border-t border-gray-700">
          <NavLink 
            to="/upload" 
            className="flex items-center justify-center w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-full transition"
          >
            <Upload size={16} className="mr-2" /> Upload Track
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;