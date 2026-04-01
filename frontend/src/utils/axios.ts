import axios, { type AxiosInstance } from "axios";

const BASE_URL: string = `${import.meta.env.VITE_API_URL}/api/version1`

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

export default api;