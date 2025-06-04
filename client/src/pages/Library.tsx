import { useEffect, useState } from 'react';
import { useAuth } from '../store/useAuth';
import { getTracksByIds, getUserById, deleteTrack } from '../api/api';
import { Track, User } from '../types';
import TrackCard from '../components/TrackCard';
import FollowButton from '../components/FollowButton';
import { Link } from 'react-router-dom';
import { Pencil, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export default function Library() {
  const { user } = useAuth();
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
  const [uploadedTracks, setUploadedTracks] = useState<Track[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTrack, setEditingTrack] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch favorite tracks
        if (user.likedTracks.length > 0) {
          const favoriteTracksRes = await getTracksByIds(user.likedTracks);
          setFavoriteTracks(favoriteTracksRes.data);
        }

        // Fetch uploaded tracks
        const userRes = await getUserById(user._id);
        if (userRes.data.uploadedTracks?.length > 0) {
          const uploadedTracksRes = await getTracksByIds(userRes.data.uploadedTracks);
          setUploadedTracks(uploadedTracksRes.data);
        }

        // Fetch following users
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
    <div className="space-y-8">
      {/* Favorite Tracks Section */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Favorite Tracks</h2>
        {favoriteTracks.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 bg-[#1a1f25] rounded-lg p-4">
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
          <p className="text-zinc-400 text-center py-8 bg-[#1a1f25] rounded-lg">
            No favorite tracks yet
          </p>
        )}
      </section>

      {/* Uploaded Tracks Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Uploaded Tracks</h2>
          <Link
            to="/upload"
            className="text-orange-500 hover:text-orange-400 text-sm font-medium"
          >
            Upload New
          </Link>
        </div>
        {uploadedTracks.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 bg-[#1a1f25] rounded-lg p-4">
            {uploadedTracks.map((track) => (
              <div key={track._id} className="flex items-center gap-4">
                <div className="flex-1">
                  <TrackCard
                    track={track}
                    queue={uploadedTracks}
                    compact
                  />
                </div>
                <div className="flex items-center gap-2 px-2">
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <button
                        className="p-2 text-zinc-400 hover:text-white transition rounded-full hover:bg-zinc-700"
                        title="Edit track"
                      >
                        <Pencil size={16} />
                      </button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a1f25] p-6 rounded-lg w-[90vw] max-w-md">
                        <Dialog.Title className="text-lg font-bold text-white mb-4">
                          Edit Track
                        </Dialog.Title>
                        <input
                          type="text"
                          value={track.name}
                          onChange={(e) => setEditingTrack({ id: track._id, name: e.target.value })}
                          className="w-full bg-zinc-800 rounded-md py-2 px-4 text-white"
                        />
                        <div className="flex justify-end gap-2 mt-4">
                          <Dialog.Close asChild>
                            <button className="px-4 py-2 text-zinc-400 hover:text-white transition">
                              Cancel
                            </button>
                          </Dialog.Close>
                          <button
                            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                            onClick={() => {
                              // Handle save logic here
                              setEditingTrack(null);
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
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
          <p className="text-zinc-400 text-center py-8 bg-[#1a1f25] rounded-lg">
            No uploaded tracks yet
          </p>
        )}
      </section>

      {/* Following Section */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Following</h2>
        {following.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {following.map((followedUser) => (
              <div
                key={followedUser._id}
                className="bg-[#1a1f25] p-4 rounded-lg flex flex-col items-center"
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
          <p className="text-zinc-400 text-center py-8 bg-[#1a1f25] rounded-lg">
            Not following anyone yet
          </p>
        )}
      </section>
    </div>
  );
}