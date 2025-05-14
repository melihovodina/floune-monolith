import { useEffect, useState } from 'react';
import { useAuth } from '../store/useAuth';
import { getProfile, getUserByName } from '../api/api';
import { Track, User } from '../types';
import TrackCard from '../components/TrackCard';
import { useParams } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const { name } = useParams();

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
        setTracks(userData.uploadedTracks || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [name]);

  console.log(currentUser?._id)
  console.log(user?._id)

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
          <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-orange-500">
            <img
              src={user.picture ? `http://localhost:5000/${user.picture}` : '/blank.webp'}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-zinc-400 mb-1 sm:mb-2 capitalize">{user.role}</p>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="text-zinc-400">
                <span className="text-white">{user.followers}</span> followers
              </div>
              {currentUser && currentUser._id !== user._id && (
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full flex items-center gap-2">
                  <UserPlus size={20} />
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Uploaded Tracks</h2>
        {tracks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tracks.map((track, index) => (
              <TrackCard key={index} track={track} queue={tracks} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 text-center">No tracks uploaded yet</p>
        )}
      </div>
    </div>
  );
}