'use client'

import Image from "next/image";
import Link from "next/link";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { PiCassetteTapeFill, PiGameControllerFill, PiJoystickFill } from "react-icons/pi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";
import { useSessionStore } from "@retrovault/store";
import { setAccessTokenCookie } from "@/lib/session";

export default function LoginPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  
  const router = useRouter()
  const toast = useToast()
  const { setAccessToken } = useSessionStore()

  const bgIcons = [
    { Icon: PiCassetteTapeFill, pos: "top-[10%] left-[5%] rotate-12" },
    { Icon: PiGameControllerFill, pos: "bottom-[15%] left-[10%] -rotate-12" },
    { Icon: PiJoystickFill, pos: "top-[20%] right-[8%] rotate-45" },
    { Icon: PiCassetteTapeFill, pos: "bottom-[10%] right-[5%] -rotate-6" },
    { Icon: PiGameControllerFill, pos: "top-[40%] left-[2%] rotate-90" },
  ];

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
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
        console.error('Erro no login:', data)
        toast.error('Credenciais inválidas!')
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro ao realizar login!')
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#F8F9FA] px-4 font-chakra-petch relative overflow-hidden">
      
      {/* Background Icons */}
      {bgIcons.map((item, index) => (
        <item.Icon key={index} className={`absolute ${item.pos} text-zinc-200/60 text-7xl md:text-9xl pointer-events-none select-none`} />
      ))}

      {/* Card */}
      <div className="relative bg-white p-8 md:p-10 rounded-2xl w-full max-w-md shadow-xl border border-zinc-200">
        
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-600 rounded-tl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-600 rounded-br-2xl"></div>

        <div className="flex flex-col items-center justify-center mb-8">
          <Image src="/logo.png" alt="logo" width={140} height={45} className="object-contain" priority />
          <div className="h-1 w-12 bg-red-600 mt-4 rounded-full"></div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[2px] flex items-center">
              E-mail <span className="text-red-600 ml-1">*</span>
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors text-lg">
                <MdEmail />
              </div>
              <input
                type="email"
                placeholder="Ex: operador@retrovault.com"
                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold placeholder:text-zinc-400 focus:outline-none focus:border-red-600/50 focus:bg-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-500 text-[10px] font-black uppercase tracking-[2px] flex items-center">
              Senha <span className="text-red-600 ml-1">*</span>
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors">
                <FaLock className="text-sm" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Insira sua senha de acesso"
                className="w-full bg-zinc-50 border-2 border-zinc-100 placeholder:text-zinc-400 rounded-xl py-3.5 pl-11 pr-12 text-sm font-bold focus:outline-none focus:border-red-600/50 focus:bg-white transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-zinc-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg cursor-pointer"
          >
            Acessar Sistema
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/register" className="text-[10px] font-black uppercase text-zinc-400 hover:text-red-600 transition-colors tracking-widest">
            Não possui credencial? Registre-se
          </Link>
        </div>
      </div>
    </main>
  );
}