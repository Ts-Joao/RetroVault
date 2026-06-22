'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { PiCassetteTapeFill, PiGameControllerFill, PiJoystickFill } from 'react-icons/pi'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/toast-provider'
import { useSessionStore } from '@retrovault/store'
import { setAccessTokenCookie } from '@/lib/session'
import { PasswordResetModal } from '@/components/auth/password-reset-modal'

export default function LoginPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showReset, setShowReset] = useState<boolean>(false)

  const router = useRouter()
  const toast = useToast()
  const { setAccessToken } = useSessionStore()

  const bgIcons = [
    { Icon: PiCassetteTapeFill, pos: 'top-[10%] left-[5%] rotate-12' },
    { Icon: PiGameControllerFill, pos: 'bottom-[15%] left-[10%] -rotate-12' },
    { Icon: PiJoystickFill, pos: 'top-[20%] right-[8%] rotate-45' },
    { Icon: PiCassetteTapeFill, pos: 'bottom-[10%] right-[5%] -rotate-6' },
    { Icon: PiGameControllerFill, pos: 'top-[40%] left-[2%] rotate-90' },
  ]

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (response.ok) {
        const { accessToken } = data
        if (accessToken) {
          setAccessToken(accessToken)
          setAccessTokenCookie(accessToken)
        }
        toast.success('Login realizado com sucesso!')
        router.push('/')
      } else {
        toast.error('Credenciais inválidas!')
      }
    } catch {
      toast.error('Erro ao realizar login!')
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#F4F4F6] px-4 font-chakra-petch relative overflow-hidden">
      {bgIcons.map((item, index) => (
        <item.Icon key={index} className="absolute text-zinc-300/40 text-7xl md:text-9xl pointer-events-none select-none" />
      ))}

      <div className="relative bg-white p-8 md:p-10 rounded-2xl w-full max-w-md shadow-xl border border-zinc-200">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#CD463A] rounded-tl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#CD463A] rounded-br-2xl" />

        <div className="flex flex-col items-center justify-center mb-8">
          <Image src="/logo.png" alt="logo" width={140} height={45} className="object-contain" priority />
          <div className="h-1 w-12 bg-[#CD463A] mt-4 rounded-full" />
        </div>

        <form onSubmit={(e) => { e.preventDefault() }} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-zinc-400 text-[10px] font-black uppercase tracking-wider flex items-center">
              E-mail <span className="text-[#CD463A] ml-1">*</span>
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#CD463A] transition-colors text-base">
                <MdEmail />
              </div>
              <input
                type="email"
                placeholder="Ex: operador@retrovault.com"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold uppercase tracking-wide focus:outline-none focus:border-zinc-400 focus:bg-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-zinc-400 text-[10px] font-black uppercase tracking-wider flex items-center">
                Senha <span className="text-[#CD463A] ml-1">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-[9px] font-black uppercase text-zinc-400 hover:text-[#CD463A] transition-colors tracking-widest cursor-pointer"
              >
                Esqueci a senha
              </button>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#CD463A] transition-colors">
                <FaLock className="text-xs" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Insira sua senha de acesso"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pl-11 pr-12 text-sm font-bold focus:outline-none focus:border-zinc-400 focus:bg-white transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#CD463A] transition-colors cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-zinc-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#CD463A] hover:shadow-[0_4px_20px_rgba(205,70,58,0.25)] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            Acessar Sistema
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/register" className="text-[10px] font-black uppercase text-zinc-400 hover:text-[#CD463A] transition-colors tracking-widest">
            Não possui credencial? Registre-se
          </Link>
        </div>
      </div>

      <PasswordResetModal isOpen={showReset} onClose={() => setShowReset(false)} />
    </main>
  )
}