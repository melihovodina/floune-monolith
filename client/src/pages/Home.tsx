import { useState, useEffect } from 'react';
import { getAllTracks, getAllUsers } from '../api/api';
import { Track, User } from '../types';
import TrackCard from '../components/TrackCard';

export default function Home() {
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [newReleases, setNewReleases] = useState<Track[]>([]);
  const [artists, setArtists] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTracks = async () => {
    try {
      const trendingResponse = await getAllTracks(4, 0, 'listens');
      setTrendingTracks(trendingResponse.data);

      const newReleasesResponse = await getAllTracks(4, 0, 'createdAt');
      setNewReleases(newReleasesResponse.data);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      setIsLoading(false);
    }
  };

  const fetchArtists = async () => {
      try {
        const response = await getAllUsers(10, 0, 'followers');
        const filteredArtists = response.data.filter((user: User) => user.role === 'artist');
        setArtists(filteredArtists);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching artists:', error);
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchTracks();
    fetchArtists();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Trending Tracks</h2>
          <a href="#" className="text-[#ff5500] hover:underline text-sm sm:text-base">See All</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trendingTracks.map((track, index) => (
            <TrackCard key={index} track={track} queue={trendingTracks} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">New Releases</h2>
          <a href="#" className="text-[#ff5500] hover:underline text-sm sm:text-base">See All</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {newReleases.map((track, index) => (
            <TrackCard key={index} track={track} queue={newReleases} />
          ))}
        </div>
      </section>

      <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Popular Artists</h2>
        <a href="/artists" className="text-orange-500 hover:text-orange-400 text-sm font-medium">
          See All
        </a>
      </div>
      <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
        {artists.map((artist) => (
          <div key={artist._id} className="flex-shrink-0">
            <a href={`/artist/${artist._id}`} className="block group">
              <div className="w-40 h-40 rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover:border-orange-500 transition">
                <img
                  src={artist.picture ? `http://localhost:5000/${artist.picture}` : '/blank.webp'}
                  alt={artist.name}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable={false}
                />
              </div>
              <h3 className="text-white text-center font-medium text-sm truncate">{artist.name}</h3>
              <p className="text-gray-400 text-center text-xs">{artist.followers} Followers</p>
            </a>
          </div>
        ))}
      </div>
    </section>
    </div>
  );
}