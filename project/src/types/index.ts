export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  banned: boolean;
  role: 'user' | 'artist' | 'admin';
  likedTracks: string[];
  uploadedTracks: string[];
  likedAlbums: string[];
  uploadedAlbums: string[];
  following: string[];
  followers: number;
  picture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Track {
  id: string;
  name: string;
  artistName: string;
  artistId: string
  text: string;
  listens: number;
  likes: number;
  picture: string;
  audio: string;
  createdAt: string;
  updatedAt: string;
}