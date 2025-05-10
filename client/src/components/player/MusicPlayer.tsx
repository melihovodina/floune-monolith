import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Heart, Music } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';

const MusicPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    progress,
    duration,
    togglePlay, 
    setVolume, 
    setProgress,
    setDuration,
    playNext,
    playPrevious
  } = usePlayerStore();
  
  const [liked, setLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          togglePlay();
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack, togglePlay]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.currentTime / (audio.duration || 1));
    };
    
    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };
    
    const handleEnded = () => {
      playNext();
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setProgress, setDuration, playNext]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current) {
      const newTime = newProgress * (audioRef.current.duration || 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(newProgress);
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume || 0.5);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };
  
  if (!currentTrack) {
    return null;
  }
  
  return (
    <div className="bg-gray-800 border-t border-gray-700 py-3 px-4">
      <div className="flex items-center">
        <audio 
          ref={audioRef} 
          src={`http://localhost:5000/${currentTrack.audio}`}
          preload="metadata"
        />
        
        <div className="w-1/4">
          <div className="flex items-center">
            {currentTrack.picture ? (
              <img 
                src={`http://localhost:5000/${currentTrack.picture}`}
                alt={currentTrack.name}
                className="w-12 h-12 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-gray-500">
                <Music size={24} />
              </div>
            )}
            <div className="ml-3 truncate">
              <p className="text-sm font-medium text-white truncate">{currentTrack.name}</p>
              <p className="text-xs text-gray-400 truncate">{currentTrack.artistName}</p>
            </div>
            <button 
              className={`ml-4 text-gray-400 hover:text-pink-500 transition ${liked ? 'text-pink-500' : ''}`}
              onClick={() => setLiked(!liked)}
            >
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white transition">
              <Shuffle size={18} />
            </button>
            <button 
              className="text-gray-400 hover:text-white transition"
              onClick={playPrevious}
            >
              <SkipBack size={22} />
            </button>
            <button 
              className="bg-white text-gray-900 rounded-full p-1.5 hover:bg-gray-200 transition"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>
            <button 
              className="text-gray-400 hover:text-white transition"
              onClick={playNext}
            >
              <SkipForward size={22} />
            </button>
            <button className="text-gray-400 hover:text-white transition">
              <Repeat size={18} />
            </button>
          </div>
          
          <div className="flex items-center w-full mt-2">
            <span className="text-xs text-gray-400 w-10">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1 mx-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        
        <div className="w-1/4 flex justify-end items-center">
          <button 
            className="text-gray-400 hover:text-white mr-2"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;