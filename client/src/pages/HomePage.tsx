import React, { useEffect, useState } from 'react';
import TrackCard from '../components/tracks/TrackCard';
import { Track, User } from '../types';
import * as api from '../api/api';

const HomePage: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tracksResponse, usersResponse] = await Promise.all([
          api.getAllTracks(8, 0),
          api.getAllUsers(8, 0)
        ]);
        
        setTracks(tracksResponse.data);
        setUsers(usersResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  const trendingTracks = tracks.slice(0, 4);
  const newTracks = tracks.slice(4);
  
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
          {users.filter(user => user.role === 'artist').map((artist) => (
            <div key={artist.id} className="flex-shrink-0">
              <a href={`/artist/${artist.id}`} className="block group">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-2 border-2 border-transparent group-hover:border-orange-500 transition">
                  <img 
                    src={artist.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.name)}`}
                    alt={artist.name} 
                    className="w-full h-full object-cover"
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
};

export default HomePage;