import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Track } from '../types';
import { usePlayer } from '../store/usePlayer';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import LikeButton from './LikeButton';
import { listenTrack } from '../api/api';

interface TrackCardProps {
  track: Track;
  queue: Track[];
  compact?: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, queue, compact = false }) => {
  const { currentTrack, isPlaying, setQueueAndTrack, setIsPlaying } = usePlayer();
  const { user } = useAuth();

  const isCurrentTrack = currentTrack?._id === track._id;
  const isFavorite = !!user?.likedTracks?.includes(track._id);

  const handlePlayClick = async () => {
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setQueueAndTrack(queue, track);
      await listenTrack(track._id);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center p-2 rounded transition group">
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
            className={`absolute inset-0 flex items-center justify-center ${isCurrentTrack && isPlaying ? 'opacity-100' : 'opacity-0 sm:group-hover:opacity-100'} transition bg-black/30 rounded`}
            onClick={() => handlePlayClick()}
          >
            <Play size={16} fill="white" className={isCurrentTrack && isPlaying ? "hidden" : ""} />
            {isCurrentTrack && isPlaying && <Pause size={16} fill="white"/>}
          </button>
        </div>
        <div className="ml-3 flex-1 truncate">
          <Link
            to={`/track/${track._id}`}
            className="text-sm font-medium text-white truncate hover:underline"
            tabIndex={0}
          >
            {track.name}
          </Link>
          <Link
            to={`/profile/${track.artistName}`}
            className="text-xs text-gray-400 truncate hover:underline block"
            tabIndex={0}
          >
            {track.artistName}
          </Link>
        </div>
        <LikeButton
          isFavorite={isFavorite}
          trackId={track._id}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#1a1f25] rounded-lg overflow-hidden group hover:bg-[#1e242b] transition">
      <div className="relative aspect-square">
        <Link to={`/track/${track._id}`}>
          <img
            src={`http://localhost:5000/${track.picture}`}
            alt={track.name}
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />
        </Link>
      </div>
      <div className="p-4 flex gap-4 items-center">
        <div className="flex-1 min-w-0 flex items-center">
          <div className="flex-1 min-w-0">
            <Link to={`/track/${track._id}`}>
              <h3 className="font-semibold text-white truncate sm:hover:underline flex items-center">
                {track.name}
              </h3>
            </Link>
            <Link to={`/profile/${track.artistName}`}>
              <p className="text-sm text-zinc-400 truncate sm:hover:underline">{track.artistName} </p>
            </Link>
          </div>
        </div>
        <button
          className={`w-10 h-10 bg-[#ff5500] rounded-full flex items-center justify-center transition hover:scale-105
            ${(isCurrentTrack && isPlaying) ? 'opacity-100' : 'md:opacity-0 md:group-hover:opacity-100 opacity-100'}`}
          onClick={handlePlayClick}
        >
          {isCurrentTrack && isPlaying ? (
            <Pause className="text-white" size={20} fill="white"/>
          ) : (
            <Play className="text-white ml-[2px]" size={20} fill="white"/>
          )}
        </button>
      </div>
    </div>
  );
};

export default TrackCard;