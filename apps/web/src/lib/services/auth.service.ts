import api from "../axios"
import type { JwtPayload } from "@retrovault/core"

interface LoginDto {
    email: string
    password: string
}

export async function getMe() {
  const { data } = await api.get<JwtPayload>('/auth/me')
  return data
}

export async function login(body: LoginDto) {
  try {
    const { data } = await api.post<{ message: string; accessToken: string }>('/auth/login', body);
    return data;
  } catch (err: any) {
    throw err;
  }
}

export async function refreshSession() {
  const { data } = await api.post<{ accessToken: string }>('/auth/refresh')
  return data
}

export async function logout() {
  const { data } = await api.post<{ message: string }>('/auth/logout')
  return data
}
