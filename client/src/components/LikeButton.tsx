import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../store/useAuth';
import { useNavigate } from 'react-router-dom';
import { addTrackToFavorites, removeTrackFromFavorites } from '../api/api';

interface LikeButtonProps {
  isFavorite: boolean;
  trackId: string;
  disabled?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ isFavorite, trackId, disabled }) => {
  const { user, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/signin');
      return;
    }
    if (isFavorite) {
      await removeTrackFromFavorites(trackId);
      setAuth({
        ...user,
        likedTracks: user.likedTracks.filter(id => id !== trackId),
      });
    } else {
      await addTrackToFavorites(trackId);
      setAuth({
        ...user,
        likedTracks: [...user.likedTracks, trackId],
      });
    }
  };

  return (
    <button
      className="text-zinc-400 hover:text-white transition rounded-full"
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      onClick={handleClick}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      disabled={disabled}
      type="button"
    >
      <Heart
        size={18}
        className={isFavorite ? 'text-orange-500 fill-orange-500' : 'text-zinc-400 hover:text-orange-500'}
      />
    </button>
  );
};

export default LikeButton;