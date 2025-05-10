import { useState, useEffect } from 'react';
import { getAllTracks } from '../api/api';
import { Track } from '../types';
import { Play, Heart } from 'lucide-react';
import { usePlayer } from '../store/usePlayer';

export default function Home() {
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const { setTrack } = usePlayer();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await getAllTracks(10, 0);
        setTrendingTracks(response.data);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    };
    fetchTracks();
  }, []);

  const handlePlayTrack = (track: Track) => {
    setTrack(track);
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Trending Tracks</h2>
          <a href="#" className="text-[#ff5500] hover:underline">See All</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trendingTracks.map((track) => (
            <div key={track.id} className="bg-[#1a1f25] rounded-lg overflow-hidden group">
              <div className="relative aspect-square">
                <img 
                  src={`http://localhost:5000/${track.picture}`} 
                  alt={track.name}
                  className="w-full h-full object-cover"
                />
                <button 
                  className="absolute bottom-4 right-4 w-10 h-10 bg-[#ff5500] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handlePlayTrack(track)}
                >
                  <Play className="text-white" size={20} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white truncate">{track.name}</h3>
                <p className="text-sm text-zinc-400 truncate">{track.artistName}</p>
                <div className="mt-2 flex items-center gap-2 text-zinc-400 text-sm">
                  <Heart size={16} />
                  <span>{track.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">New Releases</h2>
          <a href="#" className="text-[#ff5500] hover:underline">See All</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* New releases will be populated similarly */}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Popular Artists</h2>
          <a href="#" className="text-[#ff5500] hover:underline">See All</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Popular artists will be populated similarly */}
        </div>
      </section>
    </div>
  );
}