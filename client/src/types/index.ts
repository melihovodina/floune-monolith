export interface User {
  _id: string;
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
  _id: string;
  name: string;
  artistName: string;
  artistId: string
  text: string;
  duration: number;
  listens: number;
  likes: number;
  picture: string;
  audio: string;
  createdAt: string;
  updatedAt: string;
}

export interface Concert {
  _id: string;
  artist: string | {
    _id: string;
    name: string;
    picture?: string;
  };
  artistName: string;
  city: string;
  venue: string;
  date: string;
  description: string;
  ticketsQuantity: number;
  ticketPrice: number;
  approved: boolean;
  picturePath?: string;
}

export type UsersSortBy = 'followers' | 'createdAt' | 'user' | 'artist' | 'admin';
export type TracksSortBy = 'createdAt' | 'likes' | 'listens';