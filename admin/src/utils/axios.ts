import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const BASE_URL: string = `${import.meta.env.VITE_API_URL}/api/version1/admin`

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    // Lấy token trực tiếp từ Zustand store mà không cần dùng hook
    const accessToken = useAuthStore.getState().accessToken;
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;