import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { Track } from '../types';
import { usePlayer } from '../store/usePlayer';

interface TrackCardProps {
  track: Track;
  queue: Track[];
}

const TrackCard: React.FC<TrackCardProps> = ({ track, queue }) => {
  const { currentTrack, isPlaying, setQueueAndTrack, setIsPlaying } = usePlayer();

  const isCurrentTrack = currentTrack?._id === track._id;

  const handlePlayClick = () => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setQueueAndTrack(queue, track);
    }
  };

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
            <Pause className="text-white" size={20} />
          ) : (
            <Play className="text-white ml-[2 px]" size={20} />
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