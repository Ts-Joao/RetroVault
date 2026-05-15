'use client'

import type { JwtPayload } from "@retrovault/core";
import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/auth.service";

interface AuthContextType {
  user: JwtPayload | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<JwtPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then((data) => {
        console.log('user:', data) // 👈
        setUser(data)
      })
      .catch((err) => {
        console.error('getMe failed:', err.response?.status, err.response?.data) // 👈
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
