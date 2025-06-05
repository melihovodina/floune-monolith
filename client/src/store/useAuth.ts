import { create } from 'zustand';

interface AuthUser {
  _id: string;
  name: string;
  role: 'user' | 'admin' | 'artist';
  token: string;
  likedTracks: string[];
  following: string[];
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => {
  const token = localStorage.getItem('token');
  const user: AuthUser | null = null;
  const isAuthenticated = !!token;

  return {
    user,
    isAuthenticated,
    setAuth: (user) => {
      if (user) {
        localStorage.setItem('token', user.token);
        set({ user, isAuthenticated: true });
      } else {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      }
    },
    logout: () => {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    },
  };
});