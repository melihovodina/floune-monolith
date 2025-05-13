import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../store/useAuth';
import { ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="bg-[#1a1f25] px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {children}
        </div>
        {isAuthenticated ? (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-white hover:bg-[#2a2f35] px-4 py-2 rounded-full"
          >
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <User size={20} />
            )}
            <span className="hidden sm:inline">{user?.name}</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/signin')}
            className="text-white bg-[#ff5500] hover:bg-orange-700 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base"
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header