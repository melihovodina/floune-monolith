import { useEffect, useState } from 'react';
import { useAuth } from '../store/useAuth';
import { getTracksByIds, getUserById, deleteTrack } from '../api/api';
import { Track, User } from '../types';
import TrackCard from '../components/TrackCard';
import FollowButton from '../components/FollowButton';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';

export default function Library() {
  const { user } = useAuth();
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
  const [uploadedTracks, setUploadedTracks] = useState<Track[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        if (user.likedTracks.length > 0) {
          const favoriteTracksRes = await getTracksByIds(user.likedTracks);
          setFavoriteTracks(favoriteTracksRes.data);
        }

        const userRes = await getUserById(user._id);
        if (userRes.data.uploadedTracks?.length > 0) {
          const uploadedTracksRes = await getTracksByIds(userRes.data.uploadedTracks);
          setUploadedTracks(uploadedTracksRes.data);
        }

        if (user.following.length > 0) {
          const followingUsers = await Promise.all(
            user.following.map(id => getUserById(id))
          );
          setFollowing(followingUsers.map(res => res.data));
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching library data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDeleteTrack = async (trackId: string) => {
    try {
      await deleteTrack(trackId);
      setUploadedTracks(prev => prev.filter(track => track._id !== trackId));
    } catch (error) {
      console.error('Error deleting track:', error);
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
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-2xl font-bold text-white">Sign in to view your library</h2>
        <Link
          to="/signin"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <Tabs.Root defaultValue="favorites" className="space-y-6">
      <Tabs.List className="flex gap-4 border-b border-zinc-800 justify-center sm:justify-start">
        <Tabs.Trigger
          value="favorites"
          className="px-4 py-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
        >
          Favorite
        </Tabs.Trigger>
        <Tabs.Trigger
          value="uploaded"
          className="px-4 py-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
        >
          Uploaded
        </Tabs.Trigger>
        <Tabs.Trigger
          value="following"
          className="px-4 py-2 text-zinc-400 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500"
        >
          Following
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="favorites">
        {favoriteTracks.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {favoriteTracks.map((track) => (
              <TrackCard
                key={track._id}
                track={track}
                queue={favoriteTracks}
                compact
              />
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 text-center py-8">
            No favorite tracks yet
          </p>
        )}
      </Tabs.Content>

      <Tabs.Content value="uploaded">
        <div className="flex justify-end mb-4">
          <Link
            to="/upload"
            className="text-orange-500 hover:text-orange-400 text-sm font-medium mr-4"
          >
            Upload New
          </Link>
        </div>
        {uploadedTracks.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {uploadedTracks.map((track) => (
              <div key={track._id} className="flex items-center">
                <div className="flex-1">
                  <TrackCard
                    track={track}
                    queue={uploadedTracks}
                    compact
                  />
                </div>
                <div className="flex items-center gap-1 sm:gap-2 pr-2 sm:pl-1">
                  <button
                    onClick={() => handleDeleteTrack(track._id)}
                    className="p-2 text-zinc-400 hover:text-red-500 transition rounded-full hover:bg-zinc-700"
                    title="Delete track"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 text-center py-8">
            No uploaded tracks yet
          </p>
        )}
      </Tabs.Content>

      <Tabs.Content value="following">
        {following.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {following.map((followedUser) => (
              <div
                key={followedUser._id}
                className="flex flex-col items-center"
              >
                <Link to={`/profile/${followedUser.name}`}>
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
                    <img
                      src={followedUser.picture ? `http://localhost:5000/${followedUser.picture}` : '/blank.webp'}
                      alt={followedUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-white font-medium text-center mb-2 hover:underline">
                    {followedUser.name}
                  </h3>
                </Link>
                <p className="text-sm text-zinc-400 mb-3">
                  {followedUser.followers} followers
                </p>
                <FollowButton
                  targetUserId={followedUser._id}
                  followers={followedUser.followers}
                  setFollowers={(n) => {
                    setFollowing(prev =>
                      prev.map(user =>
                        user._id === followedUser._id
                          ? { ...user, followers: n }
                          : user
                      )
                    );
                  }}
                  size="small"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400 text-center py-8">
            Not following anyone yet
          </p>
        )}
      </Tabs.Content>
    </Tabs.Root>
  );
}