'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { FaTimes, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { useToast } from '@/components/ui/toast-provider'

type Step = 'email' | 'code' | 'password' | 'success'

interface PasswordResetModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PasswordResetModal({ isOpen, onClose }: PasswordResetModalProps) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const [resetToken, setResetToken] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const codeRefs = useRef<(HTMLInputElement | null)[]>([])
  const toast = useToast()

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('email')
        setEmail('')
        setCode(['', '', '', '', '', ''])
        setResetToken('')
        setPassword('')
        setConfirmPassword('')
      }, 300)
    }
  }, [isOpen])

  useEffect(() => {
    if (step === 'code') {
      setTimeout(() => codeRefs.current[0]?.focus(), 100)
    }
  }, [step])

  if (!isOpen) return null

  const handleRequestReset = async () => {
    if (!email) return
    setLoading(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password-reset/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStep('code')
    } catch {
      toast.error('Erro ao enviar o código. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...code]
    next[index] = value.slice(-1)
    setCode(next)
    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus()
    }
  }

  const handleCodeKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) codeRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) codeRefs.current[index + 1]?.focus()
  }

  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setCode(pasted.split(''))
      codeRefs.current[5]?.focus()
    }
  }

  const handleVerifyCode = async () => {
    const fullCode = code.join('')
    if (fullCode.length < 6) return
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password-reset/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Código inválido.')
      setResetToken(data.resetToken)
      setStep('password')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Código inválido.')
      setCode(['', '', '', '', '', ''])
      codeRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }
    if (password.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password-reset/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, password, confirmPassword }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message ?? 'Erro ao redefinir a senha.')
      }
      setStep('success')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao redefinir a senha.')
    } finally {
      setLoading(false)
    }
  }

  const codeComplete = code.every(Boolean)

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 font-chakra-petch">
        <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
          
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#CD463A] rounded-tl-2xl z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#CD463A] rounded-br-2xl z-10 pointer-events-none" />

          <button onClick={onClose} className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-[#CD463A] transition-colors cursor-pointer">
            <FaTimes className="text-base" />
          </button>

          {step !== 'success' && (
            <div className="h-1.5 w-full bg-zinc-100">
              <div
                className="h-full bg-[#CD463A] transition-all duration-500 ease-out"
                style={{ width: step === 'email' ? '33%' : step === 'code' ? '66%' : '100%' }}
              />
            </div>
          )}

          <div className="p-8 md:p-10">
            {step === 'email' && (
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#CD463A] mb-1">Passo 1 de 3</p>
                  <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Esqueceu a senha?</h2>
                  <p className="text-xs text-zinc-500 mt-1.5 font-medium uppercase tracking-wide">Insira seu e-mail cadastrado para enviarmos um token de verificação.</p>
                </div>

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
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-bold uppercase tracking-wide placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:bg-white transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRequestReset()}
                    />
                  </div>
                </div>

                <button
                  onClick={handleRequestReset}
                  disabled={!email || loading}
                  className="w-full bg-zinc-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#CD463A] hover:shadow-[0_4px_20px_rgba(205,70,58,0.25)] hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {loading ? 'Processando...' : 'Enviar token →'}
                </button>
              </div>
            )}

            {step === 'code' && (
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#CD463A] mb-1">Passo 2 de 3</p>
                  <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Verificação de Acesso</h2>
                  <p className="text-xs text-zinc-500 mt-1.5 font-medium uppercase tracking-wide">
                    Enviamos um token numérico para <span className="font-bold text-zinc-800 normal-case">{email}</span>.
                  </p>
                </div>

                <div>
                  <label className="text-zinc-400 text-[10px] font-black uppercase tracking-wider block mb-3">Token de Segurança</label>
                  <div className="flex gap-2 justify-between" onPaste={handleCodePaste}>
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { codeRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(i, e)}
                        className={`w-12 h-14 text-center text-xl font-black rounded-xl border bg-zinc-50 focus:outline-none focus:bg-white transition-all ${
                          digit ? 'border-[#CD463A] text-zinc-900' : 'border-zinc-200 text-zinc-400'
                        } focus:border-zinc-400`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleVerifyCode}
                  disabled={!codeComplete || loading}
                  className="w-full bg-zinc-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#CD463A] hover:shadow-[0_4px_20px_rgba(205,70,58,0.25)] hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {loading ? 'Validando...' : 'Confirmar token →'}
                </button>

                <div className="flex flex-col gap-2 pt-2 text-center">
                  <button onClick={() => setStep('email')} className="text-[10px] font-black uppercase text-zinc-400 hover:text-[#CD463A] transition-colors tracking-widest">
                    ← Alterar Credencial
                  </button>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">
                    Não recebeu? <button onClick={handleRequestReset} className="text-[#CD463A] font-black hover:underline ml-1">Reenviar</button>
                  </p>
                </div>
              </div>
            )}

            {step === 'password' && (
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#CD463A] mb-1">Passo 3 de 3</p>
                  <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Nova Assinatura</h2>
                  <p className="text-xs text-zinc-500 mt-1.5 font-medium uppercase tracking-wide">Insira sua nova senha de segurança.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[10px] font-black uppercase tracking-wider flex items-center">
                      Nova Senha <span className="text-[#CD463A] ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#CD463A] transition-colors">
                        <FaLock className="text-xs" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 8 dígitos"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pl-11 pr-12 text-sm font-bold focus:outline-none focus:border-zinc-400 focus:bg-white transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#CD463A] transition-colors cursor-pointer">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-400 text-[10px] font-black uppercase tracking-wider flex items-center">
                      Confirmar Senha <span className="text-[#CD463A] ml-1">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#CD463A] transition-colors">
                        <FaLock className="text-xs" />
                      </div>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repita a nova senha"
                        className={`w-full bg-zinc-50 border rounded-xl py-3.5 pl-11 pr-12 text-sm font-bold focus:outline-none focus:bg-white transition-all ${
                          confirmPassword && confirmPassword !== password ? 'border-red-300 focus:border-red-400' :
                          confirmPassword && confirmPassword === password ? 'border-green-300 focus:border-green-400' : 'border-zinc-200 focus:border-zinc-400'
                        }`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#CD463A] transition-colors cursor-pointer">
                        {showConfirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <p className="text-[9px] text-red-500 font-black uppercase tracking-wider mt-1">As senhas divergentes.</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={!password || !confirmPassword || password !== confirmPassword || loading}
                  className="w-full bg-zinc-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#CD463A] hover:shadow-[0_4px_20px_rgba(205,70,58,0.25)] hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {loading ? 'Salvando...' : 'Atualizar Assinatura →'}
                </button>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center text-center space-y-5 py-2">
                <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                  <FaCheckCircle className="text-2xl text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-zinc-900 uppercase tracking-tight">Sistema Atualizado</h2>
                  <p className="text-xs text-zinc-500 mt-1.5 font-medium uppercase tracking-wide">Sua credencial de acesso foi redefinida com sucesso.</p>
                </div>
                <button onClick={onClose} className="w-full bg-zinc-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#CD463A] hover:shadow-[0_4px_20px_rgba(205,70,58,0.25)] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer">
                  Autenticar Agora →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}