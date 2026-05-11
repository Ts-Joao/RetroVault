import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({ baseURL: "http://localhost:4000" });

let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];

function processQueue(error: unknown) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
}

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(original));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refresh_token");
        const { data } = await api.post("/auth/refresh-mobile", { refreshToken });

        await SecureStore.setItemAsync("token", data.access_token);
        processQueue(null);
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError);
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("refresh_token");
        // navega para o login — depende do seu router
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);