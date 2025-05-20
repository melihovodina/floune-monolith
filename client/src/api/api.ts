import axios from 'axios';
import { TracksSortBy, UsersSortBy } from '../types';

const API_URL = 'http://localhost:5000';
export const axiosInstance = axios.create({
  baseURL: API_URL,
});

const getToken = () => localStorage.getItem('token');
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (data: { email: string; password: string }) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

export const register = async (data: { email: string; password: string; name: string }) => {
  return axios.post(`${API_URL}/auth/registration`, data);
};

export const getAllUsers = async (count: number, offset: number, sortBy: UsersSortBy = 'createdAt') => {
  return axiosInstance.get('users', {
    params: { count, offset, sortBy },
  });
};

export const getUserByName = async (name: string) => {
  return axiosInstance.get(`/users/name/${name}`);
};

export const getProfile = async () => {
  return axiosInstance.get('/users/profile');
};

export const updateProfile = async (data: FormData) => {
  return axiosInstance.patch('/users/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const addTrackToFavorites = async (trackId: string) => {
  return axiosInstance.patch(`/users/favorite/${trackId}`);
};

export const removeTrackFromFavorites = async (trackId: string) => {
  return axiosInstance.patch(`/users/unfavorite/${trackId}`);
};

export const followUser = async (targetUserId: string) => {
  return axiosInstance.patch(`/users/follow/${targetUserId}`);
};

export const unfollowUser = async (targetUserId: string) => {
  return axiosInstance.patch(`/users/unfollow/${targetUserId}`);
};

export const getAllTracks = async (count: number, offset: number, sortBy: TracksSortBy = 'createdAt') => {
  return axiosInstance.get('/tracks', {
    params: { count, offset, sortBy },
  });
};

export const searchTracks = async (query: string) => {
  return axiosInstance.get('/tracks/search', {
    params: { query },
  });
};

export const getTrackById = async (id: string) => {
  return axiosInstance.get(`/tracks/${id}`);
};

export const getTracksByIds = async (ids: string[]) => {
  return axiosInstance.post('/tracks/by-ids', { ids });
};

export const createTrack = async (data: FormData) => {
  return axiosInstance.post('/tracks', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteTrack = async (id: string) => {
  return axiosInstance.delete(`/tracks/${id}`);
};

export const listenTrack = async (id: string) => {
  return axiosInstance.post(`/tracks/listen/${id}`);
};