import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformDisplayProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onPositionChange?: (position: number) => void;
  height?: number;
  waveColor?: string;
  progressColor?: string;
  barWidth?: number;
  barGap?: number;
}

const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  audioUrl,
  isPlaying,
  onPlayPause,
  onPositionChange,
  height = 80,
  waveColor = 'rgba(255, 255, 255, 0.3)',
  progressColor = '#f97316',
  barWidth = 2,
  barGap = 1
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Initialize WaveSurfer
  useEffect(() => {
    if (!containerRef.current) return;
    
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      height,
      waveColor,
      progressColor,
      barWidth,
      barGap,
      barRadius: 3,
      cursorWidth: 0,
      normalize: true,
      responsive: true,
      fillParent: true,
    });
    
    wavesurfer.load(audioUrl);
    
    wavesurfer.on('ready', () => {
      wavesurferRef.current = wavesurfer;
      setIsReady(true);
    });
    
    wavesurfer.on('seek', (position) => {
      if (onPositionChange) {
        onPositionChange(position);
      }
    });
    
    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl, height, waveColor, progressColor, barWidth, barGap, onPositionChange]);
  
  // Handle play/pause
  useEffect(() => {
    if (!wavesurferRef.current || !isReady) return;
    
    if (isPlaying) {
      wavesurferRef.current.play();
    } else {
      wavesurferRef.current.pause();
    }
  }, [isPlaying, isReady]);
  
  return (
    <div className="relative w-full">
      <div 
        ref={containerRef} 
        className="w-full cursor-pointer"
        onClick={onPlayPause}
      />
    </div>
  );
};

export default WaveformDisplay;