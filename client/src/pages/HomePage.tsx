import React, { useEffect, useState } from 'react';
import TrackCard from '../components/tracks/TrackCard';
import { Track } from '../types';

const HomePage: React.FC = () => {
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [newTracks, setNewTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data loading
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockUser = {
        id: '1',
        username: 'Artist Name',
        email: 'artist@example.com',
        isArtist: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const mockTracks: Track[] = Array.from({ length: 8 }, (_, i) => ({
        id: `track-${i}`,
        title: `Track Title ${i + 1}`,
        description: `Description for track ${i + 1}`,
        coverArt: `https://picsum.photos/seed/${i + 1}/300/300`,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: 180 + i * 30,
        userId: mockUser.id,
        user: mockUser,
        plays: 1000 + i * 100,
        likes: 120 + i * 15,
        commentsCount: 10 + i * 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      setTrendingTracks(mockTracks.slice(0, 4));
      setNewTracks(mockTracks.slice(4));
      setIsLoading(false);
    }, 1000);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Trending Tracks</h2>
          <a href="/trending" className="text-orange-500 hover:text-orange-400 text-sm font-medium">See All</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>
      
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">New Releases</h2>
          <a href="/new" className="text-orange-500 hover:text-orange-400 text-sm font-medium">See All</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newTracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>
      
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Popular Artists</h2>
          <a href="/artists" className="text-orange-500 hover:text-orange-400 text-sm font-medium">See All</a>
        </div>
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <a href={`/artist/${i}`} className="block group">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover:border-orange-500 transition">
                  <img 
                    src={`https://picsum.photos/seed/artist${i}/300/300`}
                    alt={`Artist ${i + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-white text-center font-medium text-sm truncate">Artist Name {i + 1}</h3>
                <p className="text-gray-400 text-center text-xs">1.2M Followers</p>
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;