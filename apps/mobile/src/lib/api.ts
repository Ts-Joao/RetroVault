import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost'
const BASE = `http://${HOST}:4000/api`
const STORAGE_KEY = '@auth_token'

async function parseJSON(res: Response) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function request(path: string, opts: RequestInit = {}) {
  // attach token from AsyncStorage
  const token = await AsyncStorage.getItem(STORAGE_KEY)
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(opts.headers as any) }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { credentials: 'include', ...opts, headers })

  if (res.status === 401) {
    // try refresh once
    try {
      const newToken = await refresh()
      if (!newToken) throw new Error('refresh failed')
      await AsyncStorage.setItem(STORAGE_KEY, newToken)
      headers['Authorization'] = `Bearer ${newToken}`
      const retried = await fetch(`${BASE}${path}`, { credentials: 'include', ...opts, headers })
      return retried
    } catch (e) {
      throw e
    }
  }

  return res
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  })

  if (!res.ok) {
    const data = await parseJSON(res)
    throw new Error(data?.message || 'Login failed')
  }

  const data = await res.json()
  return data.accessToken as string
}

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
    credentials: 'include',
  })

  if (!res.ok) {
    const data = await parseJSON(res)
    throw new Error(data?.message || 'Registration failed')
  }

  return res
}

export async function refresh() {
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) throw new Error('Refresh failed')

  const data = await res.json()
  return data.accessToken as string
}

export async function logout(token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}/auth/logout`, {
    method: 'POST',
    headers,
    credentials: 'include',
  })

  if (!res.ok) {
    const data = await parseJSON(res)
    throw new Error(data?.message || 'Logout failed')
  }

  return res
}

export async function getProfile() {
  // returns user object from /users/:id
  const meRes = await request('/auth/me', { method: 'GET' })
  if (!meRes.ok) throw new Error('Failed to get user id')
  
  const text = await meRes.text()
  let id: string
  try {
    const parsed = JSON.parse(text)
    id = typeof parsed === 'object' && parsed !== null ? (parsed.id || parsed.sub || text) : String(parsed)
  } catch {
    id = text
  }

  const userRes = await request(`/users/${id}`, { method: 'GET' })
  if (!userRes.ok) throw new Error('Failed to get user profile')
  const user = await userRes.json()
  return user as { id: string; name: string; email: string }
}

export async function searchProducts(query: string): Promise<any[]> {
  const res = await request(`/products/search?q=${encodeURIComponent(query)}`, { method: 'GET' })
  if (!res.ok) throw new Error('Falha ao buscar produtos')
  return res.json()
}

export default { login, register, refresh, logout, request, getProfile, searchProducts }
