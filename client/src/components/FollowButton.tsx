import { useState } from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import { followUser, unfollowUser } from '../api/api';
import { useAuth } from '../store/useAuth';

interface FollowButtonProps {
  targetUserId: string;
  targetUserName?: string;
  followers: number;
  setFollowers?: (n: number) => void;
  size?: 'large' | 'small';
  disabled?: boolean;
  className?: string;
}

export default function FollowButton({
  targetUserId,
  followers,
  setFollowers,
  size = 'large',
  disabled = false,
  className = '',
}: FollowButtonProps) {
  const { user: currentUser, setAuth } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const isFollowing = currentUser?.following?.includes(targetUserId);

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    setIsProcessing(true);
    try {
      if (isFollowing) {
        const res = await unfollowUser(targetUserId);
        setAuth({
          ...currentUser,
          following: res.data.following,
        });
        setFollowers?.(Math.max(0, followers - 1));
      } else {
        const res = await followUser(targetUserId);
        setAuth({
          ...currentUser,
          following: res.data.following,
        });
        setFollowers?.(followers + 1);
      }
    } catch (e) {
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentUser || currentUser._id === targetUserId) return null;

  const base =
    size === 'large'
      ? 'px-6 py-2 rounded-full flex items-center gap-2 text-base'
      : 'px-4 py-1 rounded-full flex items-center gap-1 text-sm';

  const color =
    isFollowing
      ? 'bg-zinc-700 hover:bg-zinc-800 text-white'
      : 'bg-orange-500 hover:bg-orange-600 text-white';

  return (
    <button
      className={`${base} ${color} transition ${className}`}
      onClick={handleFollowToggle}
      disabled={isProcessing || disabled}
    >
      {isFollowing ? (
        <>
          <UserMinus size={size === 'large' ? 20 : 16} /> Unfollow
        </>
      ) : (
        <>
          <UserPlus size={size === 'large' ? 20 : 16} /> Follow
        </>
      )}
    </button>
  );
}