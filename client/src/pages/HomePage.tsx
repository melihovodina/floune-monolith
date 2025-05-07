import React, { useEffect, useState } from 'react';
import TrackCard from '../components/tracks/TrackCard';
import { Track } from '../types';
import { getAllTracks } from '../api/api';

const HomePage: React.FC = () => {
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [newTracks, setNewTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setIsLoading(true);

        // Загрузка треков с сервера
        const response = await getAllTracks(8, 0); // Получаем первые 8 треков
        const tracks: Track[] = response.data;

        // Разделяем треки на "Trending" и "New Releases"
        setTrendingTracks(tracks.slice(0, 4)); // Первые 4 трека
        setNewTracks(tracks.slice(4)); // Следующие 4 трека
      } catch (error) {
        console.error('Ошибка при загрузке треков:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
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
          {trendingTracks.map((track, index) => (
            <TrackCard key={track.id || index} track={track} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">New Releases</h2>
          <a href="/new" className="text-orange-500 hover:text-orange-400 text-sm font-medium">See All</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newTracks.map((track, index) => (
            <TrackCard key={track.id || index} track={track} />
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