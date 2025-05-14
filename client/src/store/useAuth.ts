import { create } from 'zustand';

interface AuthUser {
  _id: string;
  token: string;
  likedTracks: string[];
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => {
  const storedUser = localStorage.getItem('authUser');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAuthenticated = !!user?.token;

  return {
    user,
    isAuthenticated,
    setAuth: (user) => {
      if (user) {
        localStorage.setItem('authUser', JSON.stringify(user));
        set({ user, isAuthenticated: true });
      } else {
        localStorage.removeItem('authUser');
        set({ user: null, isAuthenticated: false });
      }
    },
    logout: () => {
      localStorage.removeItem('authUser');
      set({ user: null, isAuthenticated: false });
    },
  };
});