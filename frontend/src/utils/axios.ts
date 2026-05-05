import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const BASE_URL: string = `${import.meta.env.VITE_API_URL}/api/version1`

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
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

// Response Interceptor: Xử lý tự động khi token hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Bắt lỗi 401 (Hoặc 403 tùy backend của bạn cấu hình cho việc hết hạn token)
    // Và check thêm cờ _retry để tránh bị lặp vô tận (infinite loop)
    if ((error.response?.status === 401) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi api refresh token
        // Lưu ý: Tuyệt đối không dùng chính instance 'api' đang bị lỗi để gọi refresh 
        // để tránh loop interceptor. Nên dùng axios thuần hoặc tạo 1 instance khác.
        const response = await axios.post("/api/version1/admin/auth/refresh-token", {}, {
            withCredentials: true 
        });

        const newAccessToken = response.data.accessToken; // Tùy cấu trúc trả về của bạn

        // 1. Cập nhật token mới vào Zustand store
        useAuthStore.getState().setAccessToken(newAccessToken);

        // 2. Gắn token mới vào request đang bị lỗi và gọi lại
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Nếu refresh token cũng thất bại (ví dụ: refresh token cũng hết hạn luôn)
        // Thì bắt buộc phải logout user và đẩy về trang đăng nhập
        useAuthStore.getState().logOut();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;