import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];

function processQueue(error: unknown) {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve())); 
    failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry && original.url !== '/auth/refresh') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(original));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh"); 
        processQueue(null);
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;