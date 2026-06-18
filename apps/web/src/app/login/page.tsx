'use client'

import Image from "next/image";
import Link from "next/link";
import { FaGoogle, FaInstagram, FaFacebook, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { login } from "@/lib/services/auth.service";
import { useToast } from "@/components/ui/toast-provider";
import { useSessionStore } from '@retrovault/store';
import { setAccessTokenCookie } from "@/lib/session";

function decodeJwtPayload(token: string) {
  try {
    const payload = token.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

function getBackendMessage(err: unknown) {
  const fallback = 'Não foi possível entrar.'
  if (typeof err !== 'object' || err === null) return fallback
  const response = (err as { response?: { data?: unknown } }).response
  const data = response?.data as { message?: unknown } | undefined
  if (Array.isArray(data?.message)) return data?.message[0] || fallback
  if (typeof data?.message === 'string') return data.message
  return fallback
}

export default function LoginPage() {
  const router = useRouter()
  const toast = useToast()
  const { setUser, setAccessToken } = useSessionStore()
  const [ email, setEmail ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const [ showPassword, setShowPassword ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState(false)

  const sendData = async () => {
    setLoading(true)
    try {
      const result = await login({ email, password })
      if (result?.accessToken) {
        setAccessToken(result.accessToken)
        setAccessTokenCookie(result.accessToken)
        const payload = decodeJwtPayload(result.accessToken)
        if (payload) setUser(payload)
      }
      toast.success('Login realizado com sucesso')
      router.push('/')
    } catch (err) {
      toast.error(getBackendMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-bg px-4">
      <div className="bg-second p-10 rounded-2xl w-full max-w-md shadow-2xl border-4 border-prim-light">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="logo" width={180} height={180} />
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 text-prim mb-1">
            <MdEmail className="text-prim text-xl" />
            <span className="text-sm font-semibold">E-mail</span>
          </label>

          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="w-full bg-white text-black p-3 rounded-md outline-none border focus:border-prim"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 text-prim mb-1">
            <FaLock className="text-prim text-xl" />
            <span className="text-sm font-semibold">Senha</span>
          </label>

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Digite sua senha"
            className="w-full bg-white text-black p-3 rounded-md outline-none border focus:border-prim"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="button" onClick={() => setShowPassword((value) => !value)} className="mt-2 text-xs text-prim hover:underline">
            {showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          </button>
        </div>

        <Link href="/register">
          <p className="text-sm text-prim mb-6 cursor-pointer hover:underline">
            Criar uma conta
          </p>
        </Link>

        <button
          className="w-full bg-prim text-white py-3 cursor-pointer rounded-md font-semibold hover:bg-third transition disabled:opacity-60"
          onClick={sendData}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Continuar'}
        </button>

        <p className="text-center text-sm font-semibold text-prim mt-6">
          Login com
        </p>

        <div className="flex justify-center gap-10 mt-6">
          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition">
            <FaGoogle className="text-prim" size={40} />
            <span className="text-xs mt-1 text-prim font-bold">Google</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition">
            <FaInstagram className="text-prim" size={40} />
            <span className="text-xs mt-1 text-prim font-bold">Instagram</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition">
            <FaFacebook className="text-prim" size={40} />
            <span className="text-xs mt-1 text-prim font-bold">Facebook</span>
          </div>
        </div>
      </div>
    </main>
  );
}
