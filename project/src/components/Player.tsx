import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import { usePlayer } from '../store/usePlayer';

const Player = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const { currentTrack, isPlaying, volume, setIsPlaying, setVolume } = usePlayer();

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={`http://localhost:5000/${currentTrack.picture}`}
            alt={currentTrack.name}
            className="w-12 h-12 rounded"
          />
          <div>
            <p className="text-white font-medium">{currentTrack.name}</p>
            <p className="text-sm text-zinc-400">{currentTrack.artistName}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2 flex-1 max-w-[600px]">
          <div className="flex items-center gap-6">
            <button className="text-zinc-400 hover:text-white">
              <SkipBack size={24} />
            </button>
            <button
              className="text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button className="text-zinc-400 hover:text-white">
              <SkipForward size={24} />
            </button>
          </div>
          
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-zinc-400">0:00</span>
            <Slider.Root
              className="relative flex-1 h-1 bg-zinc-600 rounded-full"
              value={[progress]}
              max={100}
              step={1}
            >
              <Slider.Track className="relative h-full rounded-full">
                <Slider.Range className="absolute h-full bg-white rounded-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-3 h-3 bg-white rounded-full hover:scale-110" />
            </Slider.Root>
            <span className="text-xs text-zinc-400">3:45</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 min-w-[150px]">
          <Volume2 size={20} className="text-zinc-400" />
          <Slider.Root
            className="relative flex-1 h-1 bg-zinc-600 rounded-full"
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0] / 100)}
          >
            <Slider.Track className="relative h-full rounded-full">
              <Slider.Range className="absolute h-full bg-white rounded-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-3 h-3 bg-white rounded-full hover:scale-110" />
          </Slider.Root>
        </div>
      </div>
      
      <audio
        ref={audioRef}
        src={`http://localhost:5000/${currentTrack.audio}`}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default Player;