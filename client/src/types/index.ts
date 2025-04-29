export interface User {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  isArtist: boolean;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistRequest {
  id: string;
  userId: string;
  user: User;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Track {
  id: string;
  title: string;
  description?: string;
  coverArt?: string;
  audioUrl: string;
  duration: number;
  waveformData?: number[];
  userId: string;
  user: User;
  plays: number;
  likes: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  timestamp?: number; // Position in the track in seconds
  userId: string;
  user: User;
  trackId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverArt?: string;
  userId: string;
  user: User;
  tracks: Track[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}