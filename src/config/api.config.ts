import axios from 'axios';
import { ApiConfig } from '../types';

const defaultConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const api = axios.create(defaultConfig);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const updateApiConfig = (newConfig: Partial<ApiConfig>) => {
  if (newConfig.baseURL) {
    api.defaults.baseURL = newConfig.baseURL;
  }
  if (newConfig.timeout) {
    api.defaults.timeout = newConfig.timeout;
  }
  if (newConfig.headers) {
    api.defaults.headers.common = {
      ...api.defaults.headers.common,
      ...newConfig.headers,
    };
  }
};

export default api;