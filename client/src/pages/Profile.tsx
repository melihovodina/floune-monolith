import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../store/useAuth';
import { getProfile, getUserByName, getTracksByIds, followUser, unfollowUser, updateProfile } from '../api/api';
import { Track, User } from '../types';
import TrackCard from '../components/TrackCard';
import { useParams } from 'react-router-dom';
import { UserPlus, UserMinus } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser, setAuth } = useAuth();
  const { name } = useParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userData;
        if (name) {
          const response = await getUserByName(name);
          userData = response.data;
        } else {
          const response = await getProfile();
          userData = response.data;
        }
        setUser(userData);

        if (userData.uploadedTracks && userData.uploadedTracks.length > 0) {
          const tracksResponse = await getTracksByIds(userData.uploadedTracks);
          setTracks(tracksResponse.data);
        } else {
          setTracks([]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [name]);

  const isFollowing = currentUser && user
    ? currentUser.following.includes(user._id)
    : false;

  const handleFollowToggle = async () => {
    if (!currentUser || !user) return;
    setIsProcessing(true);
    try {
      if (isFollowing) {
        const res = await unfollowUser(user._id);
        setAuth({
          ...currentUser,
          following: res.data,
        });
        setUser({
          ...user,
          followers: Math.max(0, user.followers - 1),
        });
      } else {
        const res = await followUser(user._id);
        setAuth({
          ...currentUser,
          following: res.data,
        });
        setUser({
          ...user,
          followers: user.followers + 1,  
        });
      }
    } catch (error) {
      console.error('Error while following to user:', error);
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

    const handleEditClick = () => {
    setEditMode(true);
    setNewName(user?.name || '');
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setNewAvatar(null);
    setNewName(user?.name || '');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewAvatar(e.target.files[0]);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdating(true);
    try {
      const formData = new FormData();
      if (newName && newName !== user.name) formData.append('name', newName);
      if (newAvatar) formData.append('picture', newAvatar);

      const res = await updateProfile(formData);
      setUser(res.data);
      setEditMode(false);
      setNewAvatar(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    );
  }

return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-[#1a1f25] rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex flex-col items-center">
  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-orange-500 relative">
    <img
      src={
        newAvatar
          ? URL.createObjectURL(newAvatar)
          : user.picture
          ? `http://localhost:5000/${user.picture}`
          : '/blank.webp'
      }
      alt={user.name}
      className="w-full h-full object-cover"
    />
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      className="hidden"
      onChange={handleAvatarChange}
    />
  </div>
</div>
<div className="flex-1 text-center md:text-left">
  {editMode ? (
    <form onSubmit={handleProfileUpdate} className="flex flex-col gap-2 items-center md:items-start">
      <input
        type="text"
        value={newName}
        onChange={e => setNewName(e.target.value)}
        className="px-3 py-2 rounded bg-zinc-800 text-white"
        disabled={isUpdating}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          disabled={isUpdating}
        >
          Save
        </button>
        <button
          type="button"
          className="bg-zinc-700 hover:bg-zinc-800 text-white px-4 py-2 rounded"
          onClick={handleCancelEdit}
          disabled={isUpdating}
        >
          Cancel
        </button>
      </div>
      <button
        className="mt-3 bg-orange-500 text-white px-4 py-2 rounded text-sm font-medium"
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        Upload new avatar
      </button>
    </form>
  ) : (
              <>
                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                <p className="text-zinc-400 mb-1 sm:mb-2 capitalize">{user.role}</p>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="text-zinc-400">
                    <span className="text-white">{user.followers}</span> followers
                  </div>
                  {currentUser && currentUser._id === user._id && (
                    <button
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                      onClick={handleEditClick}
                    >
                      Change profile
                    </button>
                  )}
                  {currentUser && currentUser._id !== user._id && (
                    <button
                      className={`px-6 py-2 rounded-full flex items-center gap-2 transition ${
                        isFollowing
                          ? 'bg-zinc-700 hover:bg-zinc-800 text-white'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                      onClick={handleFollowToggle}
                      disabled={isProcessing}
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus size={20} /> Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus size={20} /> Follow
                        </>
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Uploaded Tracks</h2>
        {tracks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {tracks.map((track, index) => (
              <TrackCard key={index} track={track} queue={tracks} compact/>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 text-center">No tracks uploaded yet</p>
        )}
      </div>
    </div>
  );
}     