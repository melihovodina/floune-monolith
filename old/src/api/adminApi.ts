import { axiosInstance } from './api';

const API_URL = '/users';

export const createUser = async (data: FormData) => {
  return axiosInstance.post(API_URL, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getUserById = async (id: string) => {
  return axiosInstance.get(`${API_URL}/${id}`);
};

export const updateUser = async (id: string, data: FormData) => {
  return axiosInstance.patch(`${API_URL}/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const banUser = async (id: string) => {
  return axiosInstance.patch(`${API_URL}/ban/${id}`);
};

export const deleteUser = async (id: string) => {
  return axiosInstance.delete(`${API_URL}/${id}`);
};