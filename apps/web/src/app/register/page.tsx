'use client'

import Image from "next/image";
import Link from "next/link";
import { FaGoogle, FaInstagram, FaFacebook, FaLock } from "react-icons/fa";
import { MdEmail, MdPerson } from "react-icons/md";
import { useRouter } from 'next/navigation'
import { useState } from "react";
import { createUser } from "@/lib/services/user.client";
import { useToast } from "@/components/ui/toast-provider";
import { useSessionStore } from '@retrovault/store';

function getBackendMessage(err: unknown) {
  const fallback = 'Não foi possível criar sua conta.'
  if (typeof err !== 'object' || err === null) return fallback
  const response = (err as { response?: { data?: unknown } }).response
  const data = response?.data as { message?: unknown } | undefined
  if (Array.isArray(data?.message)) return data?.message[0] || fallback
  if (typeof data?.message === 'string') return data.message
  return fallback
}

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { clearUser } = useSessionStore()
  const [ name, setName ] = useState<string>('')
  const [ email, setEmail ] = useState<string>('')
  const [ password, setPassword ] = useState<string>('')
  const [ showPassword, setShowPassword ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState(false)

  const sendData = async () => {
    setLoading(true)
    try {
      await createUser(name, email, password)
      clearUser()
      toast('Conta criada com sucesso.', 'success')
      router.push('/login')
    } catch (err) {
      toast(getBackendMessage(err), 'error')
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
            <MdPerson className="text-prim text-xl" />
            <span className="text-sm font-semibold">Nome Completo</span>
          </label>

          <input
            type="text"
            placeholder="Digite seu Nome Completo"
            className="w-full bg-white text-black p-3 rounded-md outline-none border focus:border-prim"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            required
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 text-prim mb-1">
            <FaLock className="text-prim text-xl" />
            <span className="text-sm font-semibold">Senha</span>
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              className="w-full bg-white text-black p-3 rounded-md outline-none border focus:border-prim"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <button type="button" className="mt-2 text-xs text-prim hover:underline" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>

        <button 
          className="w-full bg-prim text-white py-3 cursor-pointer rounded-md font-semibold hover:bg-third transition disabled:opacity-60"
          onClick={sendData}
          disabled={loading}
        >
          {loading ? 'Criando...' : 'Continuar'}
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
