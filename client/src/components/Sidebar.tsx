import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Ticket, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Search', icon: Search, path: '/search' },
    { name: 'Library', icon: Library, path: '/library' },
    { name: 'Concerts', icon: Ticket, path: '/concerts' },
  ];

  return (
    <div className={`
      fixed inset-y-0 z-50 left-0 w-64 bg-[#1a1f25] p-4 transform transition-transform duration-300 ease-in-out
      lg:relative lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="text-orange-500 mt-0.5 mr-1">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14.5C12 13.672 12.672 13 13.5 13C14.328 13 15 13.672 15 14.5C15 15.328 14.328 16 13.5 16C12.672 16 12 15.328 12 14.5Z" fill="currentColor"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2ZM4 4V20H8C8.55229 20 9 19.5523 9 19V13.5C9 11.0147 11.0147 9 13.5 9C15.9853 9 18 11.0147 18 13.5C18 15.9853 15.9853 18 13.5 18C12.2744 18 11.1469 17.5403 10.2812 16.7812C10.1039 16.9489 10 17.1734 10 17.4142V19C10 20.1046 9.10457 21 8 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3V4Z" fill="currentColor"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Floune</h1>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
      </div>
      <nav>
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-[#1a1f25] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-[#1a1f25]'
            }`}
          >
            <item.icon size={20} />
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar