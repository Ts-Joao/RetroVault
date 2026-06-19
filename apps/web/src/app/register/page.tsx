'use client'

import Image from "next/image";
import Link from "next/link";
import { FaLock, FaEye, FaEyeSlash, FaMapMarkerAlt, FaPhoneAlt, FaCheck, FaTimes } from "react-icons/fa";
import { MdEmail, MdPerson } from "react-icons/md";
import { PiCassetteTapeFill, PiGameControllerFill, PiJoystickFill } from "react-icons/pi";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast-provider";

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cep, setCep] = useState('')
  const [phone, setPhone] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const toast = useToast()

  const bgIcons = [
    { Icon: PiCassetteTapeFill, pos: "top-[5%] right-[15%] -rotate-45" },
    { Icon: PiGameControllerFill, pos: "bottom-[5%] left-[20%] rotate-12" },
    { Icon: PiJoystickFill, pos: "top-[50%] right-[2%] -rotate-90" },
    { Icon: PiCassetteTapeFill, pos: "top-[15%] left-[10%] rotate-6" },
  ];

  const requirements = useMemo(() => {
    return [
      { label: "Mínimo de 8 caracteres", met: password.length >= 8 },
      { label: "Pelo menos 1 letra maiúscula", met: /[A-Z]/.test(password) },
      { label: "Pelo menos 1 letra minúscula", met: /[a-z]/.test(password) },
      { label: "Pelo menos 1 número", met: /[0-9]/.test(password) },
      { label: "Pelo menos 1 caractere especial (@, #, $, etc.)", met: /[^A-Za-z0-9]/.test(password) }
    ];
  }, [password]);

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'Ausente', color: 'bg-zinc-100' };

    const passedCount = requirements.filter(req => req.met).length;
    const percentage = (passedCount / requirements.length) * 100;

    if (passedCount <= 2) return { score: percentage, label: 'Insegura', color: 'bg-red-500' };
    if (passedCount <= 4) return { score: percentage, label: 'Média', color: 'bg-orange-400' };
    return { score: percentage, label: 'Excelente / Forte', color: 'bg-emerald-500' };
  }, [password, requirements]);

  function handleCepChange(value: string) {
    const raw = value.replace(/\D/g, '')
    const formatted = raw.replace(/^(\d{5})(\d{3})/, '$1-$2')
    setCep(formatted.substring(0, 9))
  }

  function handlePhoneChange(value: string) {
    const raw = value.replace(/\D/g, '')
    const formatted = raw.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{5})(\d{4})$/, '$1-$2')
    setPhone(formatted.substring(0, 15))
  }

  const sendData = async () => {
    try {
      const rawCep = cep.replace(/\D/g, '')
      const rawPhone = phone.replace(/\D/g, '')

      const body: Record<string, string> = {
        name,
        email,
        password,
        phone: rawPhone,
      }

      if (rawCep) {
        body.cep = rawCep
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast.success('Cadastro realizado com sucesso!')
        router.push('/login')
      } else {
        const data = await response.json()
        console.error('Erro no cadastro:', data)
        toast.error('Erro ao realizar cadastro!')
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro ao realizar cadastro!')
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#F8F9FA] px-4 py-10 font-chakra-petch relative overflow-hidden">

      {/* Background Icons */}
      {bgIcons.map((item, index) => (
        <item.Icon key={index} className={`absolute ${item.pos} text-zinc-200/60 text-8xl md:text-[10rem] pointer-events-none select-none`} />
      ))}

      <div className="relative bg-white p-8 md:p-10 rounded-[2rem] w-full max-w-xl shadow-2xl border-2 border-zinc-100">

        {/* Engineering Corners */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-red-600 rounded-tr-[2rem]"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-red-600 rounded-bl-[2rem]"></div>

        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="logo" width={130} height={40} className="object-contain" priority />
          <h1 className="text-[10px] font-black uppercase text-red-600 tracking-[4px] mt-4">cadastre-se</h1>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); sendData(); }} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-600 text-[10px] font-black uppercase">Nome Completo <span className="text-red-600">*</span></label>
              <div className="relative group">
                <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors text-lg" />
                <input
                  type="text"
                  placeholder="Seu nome e sobrenome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-3 pl-11 pr-4 text-sm font-bold placeholder:text-zinc-400 focus:outline-none focus:border-red-600 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-zinc-600 text-[10px] font-black uppercase">E-mail <span className="text-red-600">*</span></label>
              <div className="relative group">
                <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors text-lg" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-3 pl-11 pr-4 text-sm font-bold placeholder:text-zinc-400 focus:outline-none focus:border-red-600 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-zinc-600 text-[10px] font-black uppercase flex items-center gap-1">
                CEP <span className="text-zinc-500 lowercase italic tracking-normal">(opcional)</span>
              </label>
              <div className="relative group">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors" />
                <input
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-3 pl-11 pr-4 text-sm font-bold placeholder:text-zinc-400 focus:outline-none focus:border-red-600 transition-all"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-zinc-600 text-[10px] font-black uppercase">Celular <span className="text-red-600">*</span></label>
              <div className="relative group">
                <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors" />
                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-3 pl-11 pr-4 text-sm font-bold placeholder:text-zinc-400 focus:outline-none focus:border-red-600 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-500 text-[10px] font-black uppercase">Senha <span className="text-red-600">*</span></label>
            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-600 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Insira os parâmetros de proteção"
                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-xl py-3.5 pl-11 pr-12 text-sm font-bold placeholder:text-zinc-400 focus:outline-none focus:border-red-600 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-600 transition-colors cursor-pointer">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Barra de Força Dinâmica com 5 Níveis */}
            <div className="space-y-2 pt-1">
              <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: `${passwordStrength.score}%` }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">Status de Segurança</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-700">{passwordStrength.label}</span>
              </div>
            </div>

            {/* Requisitos Atualizados em tempo real */}
            {password && (
              <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100 space-y-1.5 mt-2">
                {requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-sans font-semibold transition-colors duration-200">
                    {req.met ? (
                      <FaCheck className="text-emerald-500 text-xs shrink-0" />
                    ) : (
                      <FaTimes className="text-zinc-300 text-xs shrink-0" />
                    )}
                    <span className={req.met ? "text-zinc-700 line-through decoration-zinc-400/50" : "text-zinc-400"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkbox Centralizado */}
          <div className="flex items-center justify-center pt-2 pb-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" className="sr-only" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} required />
                <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${termsAccepted ? 'bg-red-600 border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.3)]' : 'bg-zinc-50 border-zinc-200 group-hover:border-red-600'}`}>
                  {termsAccepted && <FaCheck className="text-white text-[10px]" />}
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider group-hover:text-zinc-600 transition-colors">
                Eu aceito os termos e protocolos do cofre.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg cursor-pointer"
          >
            Registrar Operador
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-[10px] font-black uppercase text-zinc-400 hover:text-red-600 transition-colors">
            Já possui acesso? Voltar ao login
          </Link>
        </div>
      </div>
    </main>
  );
}