import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuth = create<AuthState>((set) => {
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user') || 'null') : null;

  return {
    user,
    isAuthenticated: !!token,
    setUser: (user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
      set({ user });
    },
    setIsAuthenticated: (isAuthenticated) => {
      if (!isAuthenticated) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      set({ isAuthenticated });
    },
  };
});