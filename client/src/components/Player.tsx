import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import { usePlayer } from '../store/usePlayer';
import { useAuth } from '../store/useAuth';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';

const Player = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const {
    currentTrack,
    isPlaying,
    volume,
    setIsPlaying,
    setVolume,
    playNextTrack,
    playPreviousTrack,
  } = usePlayer();

  const isFavorite = !!currentTrack && !!user?.likedTracks?.includes(currentTrack._id);
  const trackDuration = currentTrack?.duration || 0;
  
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [audioRef, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current && trackDuration) {
      const progress = (audioRef.current.currentTime / trackDuration) * 100;
      setProgress(progress);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && trackDuration) {
      const newTime = (value[0] / 100) * trackDuration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1f25] border-t border-zinc-800 px-4 py-3 z-50">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
        <div className="flex gap-4 w-full sm:w-auto sm:max-w-[25%] items-center">
          <img
            src={`http://localhost:5000/${currentTrack.picture}`}
            alt={currentTrack.name}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <Link
              to={`/track/${currentTrack._id}`}
              className="text-white font-medium truncate block hover:underline"
            >
              {currentTrack.name}
            </Link>
            <Link
              to={`/profile/${currentTrack.artistName}`}
              className="text-sm text-zinc-400 truncate block hover:underline"
            >
              {currentTrack.artistName}
            </Link>
          </div>
          <div className="ml-auto flex-shrink-0">
            <LikeButton
              isFavorite={isFavorite}
              trackId={currentTrack._id}
            />
          </div>
        </div>

        <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:max-w-[30%] w-full flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <button
              className="text-zinc-400 hover:text-white"
              onClick={playPreviousTrack}
            >
              <SkipBack size={20} />
            </button>
            <button
              className="text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={20} fill="white"/> : <Play size={20} fill="white"/>}
            </button>
            <button
              className="text-zinc-400 hover:text-white"
              onClick={playNextTrack}
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-zinc-400">
              {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
            </span>
            <Slider.Root
              className="relative flex-1 h-1 bg-zinc-600 rounded-full cursor-pointer"
              value={[progress]}
              max={100}
              step={1}
              onValueChange={handleSeek}
            >
              <Slider.Track className="relative h-full rounded-full cursor-pointer">
                <Slider.Range className="absolute h-full bg-white rounded-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-3 h-3 bg-white rounded-full hover:scale-110 transform -translate-y-1/4 cursor-pointer" />
            </Slider.Root>
            <span className="text-xs text-zinc-400">
              {formatTime(trackDuration)}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 min-w-[150px]">
          <Volume2 size={20} className="text-zinc-400" />
          <Slider.Root
            className="relative flex-1 h-1 bg-zinc-600 rounded-full cursor-pointer"
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0] / 100)}
          >
            <Slider.Track className="relative h-full rounded-full cursor-pointer">
              <Slider.Range className="absolute h-full bg-white rounded-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-3 h-3 bg-white rounded-full hover:scale-110 transform -translate-y-1/4 cursor-pointer" />
          </Slider.Root>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={`http://localhost:5000/${currentTrack.audio}`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNextTrack}
      />
    </div>
  );
};

export default Player;