import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';

// 1. Định nghĩa Interface cho API trả về khi refresh token
interface RefreshTokenResponse {
  accessToken: string;
}

// 2. Mở rộng cấu hình của Axios để thêm cờ _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 3. Định nghĩa kiểu dữ liệu cho các promise đang nằm chờ trong hàng đợi
interface FailedQueueItem {
  resolve: (value: string | null) => void;
  reject: (reason: AxiosError | Error) => void;
}

const BASE_URL: string = `${import.meta.env.VITE_API_URL}/api/version1/admin`;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// State quản lý refresh token
let isRefreshing: boolean = false;
let failedQueue: FailedQueueItem[] = [];

// Hàm xử lý các request đang chờ trong queue
const processQueue = (error: AxiosError | Error | null, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor: Gắn access token vào mỗi request
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Interceptor: Xử lý lỗi 401 và tự động refresh token
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Nếu không có originalRequest (lỗi mạng, timeout...), ném lỗi ra luôn
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Bỏ qua interceptor cho các API auth để tránh vòng lặp vô tận
    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh-token')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {

      // Nếu đang có request refresh đang chạy, đưa request này vào hàng đợi
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return instance(originalRequest);
          })
          .catch((err: AxiosError | Error) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // FIX 2: Dùng đúng endpoint refresh-token của backend
        // FIX 3: Không cần gửi body vì backend đọc refresh token từ httpOnly cookie `jwt`
        //           `withCredentials: true` đảm bảo cookie được gửi kèm tự động
        const res = await axios.post<RefreshTokenResponse>(
          `${BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = res.data;
        localStorage.setItem('access_token', accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);

        return await instance(originalRequest);

      } catch (refreshError) {
        const err = refreshError as AxiosError | Error;

        processQueue(err, null);

        // Xóa access token cũ và redirect về trang login
        localStorage.removeItem('access_token');

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;