import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { Track } from '../types';
import { usePlayer } from '../store/usePlayer';

interface TrackCardProps {
  track: Track;
  queue: Track[];
  compact?: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, queue, compact = false }) => {
  const { currentTrack, isPlaying, setQueueAndTrack, setIsPlaying } = usePlayer();

  const isCurrentTrack = currentTrack?._id === track._id;

  const handlePlayClick = () => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setQueueAndTrack(queue, track);
    }
  };

    if (compact) {
    return (
      <div className="flex items-center p-2 sm:hover:bg-gray-800 rounded transition group">
        <div className="relative w-20 h-20 sm:w-30 sm:h-30 flex-shrink-0">
          {track.picture ? (
            <img 
              src={`http://localhost:5000/${track.picture}`} 
              alt={track.name} 
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 rounded" />
          )}
          <button 
            className={`absolute inset-0 flex items-center justify-center ${isCurrentTrack && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition bg-black/30 rounded`}
            onClick={() => handlePlayClick()}
          >
            <Play size={16} fill="white" className={isCurrentTrack && isPlaying ? "hidden" : ""} />
            {isCurrentTrack && isPlaying && <Pause size={16} fill="white"/>}
          </button>
        </div>
        <div className="ml-3 flex-1 truncate">
          <p className="text-sm font-medium text-white truncate">{track.name}</p>
          <p className="text-xs text-gray-400 truncate">{track.artistName}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f25] rounded-lg overflow-hidden group hover:bg-[#1e242b] transition">
      <div className="relative aspect-square">
        <img
          src={`http://localhost:5000/${track.picture}`}
          alt={track.name}
          className="w-full h-full object-cover select-none pointer-events-none"
          draggable={false}
        />
        <button
          className={`absolute bottom-4 right-4 w-10 h-10 bg-[#ff5500] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition`}
          onClick={handlePlayClick}
        >
          {isCurrentTrack && isPlaying ? (
            <Pause className="text-white" size={20} fill="white"/>
          ) : (
            <Play className="text-white ml-[2px]" size={20} fill="white"/>
          )}
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
  );
};

export default TrackCard;