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
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  setQueueAndTrack: (queue: Track[], track: Track) => void;
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
    set((state) => ({ queue: state.queue.filter((track) => track._id !== trackId) })),

  clearQueue: () => set({ queue: [] }),

  playNextTrack: () =>
    set((state) => {
      const currentIndex = state.queue.findIndex((track) => track._id === state.currentTrack?._id);
      console.log(currentIndex)
      const nextTrack = state.queue[currentIndex + 1] || state.queue[0];
      console.log(nextTrack)
      return { currentTrack: nextTrack, isPlaying: true };
    }),

  playPreviousTrack: () =>
    set((state) => {
      const currentIndex = state.queue.findIndex((track) => track._id === state.currentTrack?._id);
      console.log(currentIndex)
      const previousTrack = state.queue[currentIndex - 1] || state.queue[state.queue.length - 1];
      console.log(previousTrack)
      return { currentTrack: previousTrack, isPlaying: true };
    }),

  setQueueAndTrack: (queue, track) =>
    set({ queue, currentTrack: track, isPlaying: true }),
}));