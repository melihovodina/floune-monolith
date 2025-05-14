import { create } from 'zustand';
import { Track } from '../types';
import * as api from '../api/api';

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playTrack: (track: Track) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  
  playTrack: async (track) => {
    try {
      await api.listenTrack(track.id);
      set({ currentTrack: track, isPlaying: true, progress: 0 });
    } catch (error) {
      console.error('Failed to record track listen:', error);
      set({ currentTrack: track, isPlaying: true, progress: 0 });
    }
  },
  
  addToQueue: (track) => {
    set((state) => ({ queue: [...state.queue, track] }));
  },
  
  removeFromQueue: (trackId) => {
    set((state) => ({
      queue: state.queue.filter((track) => track.id !== trackId)
    }));
  },
  
  clearQueue: () => set({ queue: [] }),
  
  playNext: () => {
    const { queue, currentTrack } = get();
    if (queue.length === 0) return;
    
    const currentIndex = currentTrack 
      ? queue.findIndex(track => track.id === currentTrack.id)
      : -1;
    
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % queue.length;
    set({ 
      currentTrack: queue[nextIndex], 
      isPlaying: true,
      progress: 0
    });
  },
  
  playPrevious: () => {
    const { queue, currentTrack } = get();
    if (queue.length === 0 || !currentTrack) return;
    
    const currentIndex = queue.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    set({ 
      currentTrack: queue[prevIndex], 
      isPlaying: true,
      progress: 0
    });
  },
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setVolume: (volume) => set({ volume }),
  
  setProgress: (progress) => set({ progress }),
  
  setDuration: (duration) => set({ duration })
}));