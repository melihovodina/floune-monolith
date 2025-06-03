import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Heart, Share2, Clock, Music } from 'lucide-react';
import { getTrackById } from '../api/api';
import { usePlayer } from '../store/usePlayer';

const Track: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [track, setTrack] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    currentTrack,
    isPlaying,
    setTrack: setPlayerTrack,
    setIsPlaying,
    setQueueAndTrack,
  } = usePlayer();

  const isCurrentTrack = currentTrack?._id === id;

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getTrackById(id)
      .then(res => {
        setTrack(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id]);

  const handlePlayPause = () => {
    if (!track) return;
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setPlayerTrack(track);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() ?? '';
  };

  if (isLoading || !track) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-8">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Track Cover & Info */}
            <div className="md:w-1/3">
              {track.picture ? (
                <img 
                  src={`http://localhost:5000/${track.picture}`} 
                  alt={track.name}
                  className="w-full aspect-square object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-lg">{track.name}</span>
                </div>
              )}
              
              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="text-gray-400 flex items-center">
                    <Music size={20} className="mr-1" />
                    <span className="text-sm">{formatNumber(track.listens ?? 0)}</span>
                  </div>
                  <div className="text-gray-400 transition group flex items-center">
                    <Heart size={20} />
                    <span className="ml-1 text-sm">{formatNumber(track.likes)}</span>
                  </div>
                  <button className="text-gray-400 hover:text-white transition group flex items-center">
                    <Share2 size={20} />
                  </button>
                  <span className="text-sm text-gray-400 mx-1">•</span>
                  <span className="text-sm text-gray-400">{formatDate(track.createdAt)}</span>
                </div>
                
                <div className="pt-3 border-t border-gray-700">
                  <h3 className="text-gray-400 text-sm font-medium mb-2">Artist</h3>
                  <div className="flex items-center">
                    {track.artistPicture ? (
                      <img 
                        src={`http://localhost:5000/${track.artistPicture}`} 
                        alt={track.artistName}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-700 rounded-full mr-3" />
                    )}
                    <div>
                      <p className="text-white font-medium">{track.artistName}</p>
                      <p className="text-sm text-gray-400">{formatNumber(track.artistFollowers || 0)} followers</p>
                    </div>
                    <button className="ml-auto bg-transparent hover:bg-gray-700 text-gray-300 text-sm border border-gray-600 rounded-full px-4 py-1 transition">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Waveform & Description */}
            <div className="md:w-2/3">
              <div className="flex items-center mb-4">
                <button 
                  className="w-12 h-12 flex items-center justify-center bg-[#ff5500] rounded-full hover:bg-orange-600 text-white rounded-full mr-4 transition"
                  onClick={handlePlayPause}
                >
                  {isCurrentTrack && isPlaying ? <Pause size={24} fill="white"/> : <Play size={24} className='ml-[2px]' fill="white"/>}
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-white">{track.name}</h1>
                  <p className="text-gray-400">{track.artistName}</p>
                </div>
              </div>
              
              <div className="mb-6">
                {/* Здесь может быть компонент WaveformDisplay, если он есть */}
              </div>
              
              {track.description && (
                <div className="mb-8 p-4 bg-gray-800 rounded-lg">
                  <p className="text-gray-300">{track.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;