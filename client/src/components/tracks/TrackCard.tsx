import React from 'react';
import { Play, Heart, Clock, MessageSquare, Share2 } from 'lucide-react';
import { Track } from '../../types';
import { usePlayerStore } from '../../store/playerStore';

interface TrackCardProps {
  track: Track;
  compact?: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, compact = false }) => {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayerStore();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  
  const handlePlayClick = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (compact) {
    return (
      <div className="flex items-center p-2 hover:bg-gray-800 rounded transition group">
        <div className="relative w-10 h-10 flex-shrink-0">
          {track.coverArt ? (
            <img 
              src={track.coverArt} 
              alt={track.title} 
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 rounded" />
          )}
          <button 
            className={`absolute inset-0 flex items-center justify-center ${isCurrentTrack && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition bg-black/30 rounded`}
            onClick={handlePlayClick}
          >
            <Play size={16} fill="white" className={isCurrentTrack && isPlaying ? "hidden" : ""} />
            {isCurrentTrack && isPlaying && <span className="w-2 h-4 bg-white rounded-sm"></span>}
          </button>
        </div>
        <div className="ml-3 flex-1 truncate">
          <p className="text-sm font-medium text-white truncate">{track.title}</p>
          <p className="text-xs text-gray-400 truncate">{track.user.username}</p>
        </div>
        <div className="text-xs text-gray-400 ml-4">{formatTime(track.duration)}</div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden group hover:bg-gray-750 transition">
      <div className="relative">
        {track.coverArt ? (
          <img 
            src={track.coverArt} 
            alt={track.title} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
            <span className="text-gray-500 text-lg">{track.title}</span>
          </div>
        )}
        <button 
          className="absolute bottom-3 right-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition transform group-hover:translate-y-0 translate-y-2"
          onClick={handlePlayClick}
        >
          {isCurrentTrack && isPlaying ? (
            <div className="w-4 h-4 flex items-center justify-center">
              <div className="w-1.5 h-5 bg-white rounded-sm mr-1"></div>
              <div className="w-1.5 h-5 bg-white rounded-sm"></div>
            </div>
          ) : (
            <Play size={24} fill="white" />
          )}
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-white truncate">{track.title}</h3>
        <p className="text-sm text-gray-400 mt-1 truncate">{track.user.username}</p>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center space-x-3">
            <button className="text-gray-400 hover:text-pink-500 transition">
              <Heart size={18} />
            </button>
            <button className="text-gray-400 hover:text-white transition">
              <MessageSquare size={18} />
            </button>
            <button className="text-gray-400 hover:text-white transition">
              <Share2 size={18} />
            </button>
          </div>
          <div className="flex items-center space-x-3 text-gray-400 text-sm">
            <div className="flex items-center">
              <Heart size={14} className="mr-1" />
              <span>{track.likes}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={14} className="mr-1" />
              <span>{track.commentsCount}</span>
            </div>
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{formatTime(track.duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;