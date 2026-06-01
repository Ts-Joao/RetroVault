'use client'

import type { JwtPayload } from "@retrovault/core";
import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/auth.service";

interface AuthContextType {
  user: JwtPayload | null
  isLoading: boolean
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refresh: async () => {}
})  

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<JwtPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = () => {
    return getMe()
      .then(setUser)
      .catch(() => setUser(null))
  }

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
