import axios from "axios";
import { useSessionStore } from "@retrovault/store";
import { clearAccessTokenCookie, setAccessTokenCookie } from "./session";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL as string,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];

function processQueue(error: unknown) {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve())); 
    failedQueue = [];
}

api.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config

  const token = useSessionStore.getState().accessToken
  if (token) {
    config.headers = config.headers ?? {}
    ;(config.headers as any).Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 && 
      !original._retry && 
      original.url !== '/auth/refresh' &&
      original.url !== '/auth/me'
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(original));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refresh = await api.post("/auth/refresh");
        const accessToken = refresh.data?.accessToken
        if (accessToken) {
          useSessionStore.getState().setAccessToken(accessToken)
          setAccessTokenCookie(accessToken)
        }
        processQueue(null);
        return api(original);
      } catch (refreshError) {
        useSessionStore.getState().clearUser()
        clearAccessTokenCookie()
        processQueue(refreshError);
        if (typeof window !== 'undefined') {
          const publicRoutes = ['/login', '/register'];
          const isPublic = publicRoutes.some(r => window.location.pathname.startsWith(r));
          if (!isPublic) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
