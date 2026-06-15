import axios from "axios";
import { cookies } from "next/headers";

export async function getServerApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;

      // Só trata 401 se não estiver tentando fazer refresh
      if (status !== 401 || error.config?.url === "/auth/refresh") {
        return Promise.reject(error);
      }

      const original = error.config;

      try {
        //faz o refresh e tenta novamente a requisição original
        await api.post("/auth/refresh");
        return api(original);
      } catch (refreshError) {
        //se o refresh falhar, desloga o usuário
        try {
          await api.post("/auth/logout");
        } catch (logoutError) {
          // Ignora erro no logout
        }
        throw refreshError;
      }
    }
  );

  return api;
}
