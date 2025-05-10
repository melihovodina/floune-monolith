import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../store/useAuth';

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="bg-zinc-900 px-6 py-4">
      <div className="flex items-center justify-end">
        {isAuthenticated ? (
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-white hover:bg-zinc-800 px-4 py-2 rounded-full"
          >
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
            ) : (
              <User size={20} />
            )}
            <span>{user?.name}</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            className="text-white bg-green-500 hover:bg-green-600 px-6 py-2 rounded-full"
          >
            Log in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;