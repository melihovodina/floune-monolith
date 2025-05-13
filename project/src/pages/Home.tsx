import { useState, useEffect } from 'react';
import { getAllTracks } from '../api/api';
import { Track } from '../types';
import TrackCard from '../components/TrackCard';

export default function Home() {
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [newReleases, setNewReleases] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    </div>
  );
}