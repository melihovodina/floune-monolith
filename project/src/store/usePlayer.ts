import { create } from 'zustand';
import { Track } from '../types';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  queue: Track[];
  setTrack: (track: Track) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
}

export const usePlayer = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  queue: [],
  setTrack: (track) => set({ currentTrack: track, isPlaying: true }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  removeFromQueue: (trackId) =>
    set((state) => ({ queue: state.queue.filter((track) => track.id !== trackId) })),
  clearQueue: () => set({ queue: [] }),
}));