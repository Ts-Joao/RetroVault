"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdPerson } from "react-icons/md";
import { FaLock, FaPhone, FaIdCard } from "react-icons/fa";
import { MdLocationOn, MdEmail } from "react-icons/md";
import { HiEye, HiEyeOff } from "react-icons/hi";

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  defaultCep: string;
  password: string;
  confirmPassword: string;
}

interface FieldError {
  [key: string]: string;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCep(value: string) {
  return value.replace(/\D/g, "").slice(0, 8);
}

function validateForm(form: RegisterForm): FieldError {
  const errors: FieldError = {};

  if (!form.name.trim()) errors.name = "Nome é obrigatório";
  else if (form.name.trim().length < 3) errors.name = "Nome muito curto";

  if (!form.email.trim()) errors.email = "E-mail é obrigatório";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "E-mail inválido";

  const phoneDigits = form.phone.replace(/\D/g, "");
  if (!phoneDigits) errors.phone = "Telefone é obrigatório";
  else if (phoneDigits.length < 10) errors.phone = "Telefone inválido";

  if (form.defaultCep && form.defaultCep.length !== 8)
    errors.defaultCep = "CEP deve ter 8 dígitos";

  if (!form.password) errors.password = "Senha é obrigatória";
  else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(form.password)
  )
    errors.password =
      "Mínimo 8 caracteres, com maiúscula, número e símbolo";

  if (!form.confirmPassword)
    errors.confirmPassword = "Confirme sua senha";
  else if (form.password !== form.confirmPassword)
    errors.confirmPassword = "As senhas não coincidem";

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    defaultCep: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "phone") formatted = formatPhone(value);
    if (name === "defaultCep") formatted = formatCep(value);

    setForm((prev) => ({ ...prev, [name]: formatted }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const payload: Record<string, string> = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.replace(/\D/g, ""),
        password: form.password,
      };
      if (form.defaultCep) payload.defaultCep = form.defaultCep;

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        if (response.status === 409) {
          setErrors((prev) => ({ ...prev, email: "E-mail já cadastrado" }));
        } else {
          setApiError(body?.message || "Erro ao criar conta. Tente novamente.");
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/"), 2500);
    } catch {
      setApiError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#261F1A]">
        <div className="flex flex-col items-center gap-4 rounded bg-[#F2EFDC] px-12 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#BF372A]">
            <svg className="h-8 w-8 text-[#F2EFDC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-mono text-xl font-bold uppercase tracking-widest text-[#261F1A]">
            Conta criada!
          </h2>
          <p className="text-sm text-[#261F1A]">
            Redirecionando para o login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#261F1A] font-serif">
      {/* Banner lateral */}
      <div
        className="flex-1 min-h-full bg-cover bg-center brightness-90"
        style={{ backgroundImage: "url('/banner.jpg')" }}
      />

      {/* Painel de cadastro */}
      <div className="relative flex w-[460px] flex-col items-center justify-center gap-0 bg-[#F2EFDC] px-10 py-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <img src="/logo.png" alt="RetroVault" className="h-[52px]" />
          <span className="text-[18px] font-semibold tracking-[0.02em] text-[#261F1A]">
            Painel do vendedor.
          </span>
        </div>

        <h1 className="mb-6 font-mono text-[26px] font-bold uppercase tracking-[0.05em] text-[#261F1A]">
          CADASTRO
        </h1>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3" noValidate>

          {/* Nome */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 text-sm text-[#BF372A]">
              <MdPerson className="text-xl" />
              NOME
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className={`rounded border bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none placeholder:text-[#A6A39F] transition-colors ${
                errors.name ? "border-red-500" : "border-[#BF372A]"
              }`}
            />
            {errors.name && (
              <span className="text-xs text-red-600">{errors.name}</span>
            )}
          </div>

          {/* E-mail */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 text-sm text-[#BF372A]">
              <MdEmail className="text-xl" />
              E-MAIL
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className={`rounded border bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none placeholder:text-[#A6A39F] transition-colors ${
                errors.email ? "border-red-500" : "border-[#BF372A]"
              }`}
            />
            {errors.email && (
              <span className="text-xs text-red-600">{errors.email}</span>
            )}
          </div>

          {/* Telefone */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 text-sm text-[#BF372A]">
              <FaPhone className="text-base" />
              TELEFONE
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              className={`rounded border bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none placeholder:text-[#A6A39F] transition-colors ${
                errors.phone ? "border-red-500" : "border-[#BF372A]"
              }`}
            />
            {errors.phone && (
              <span className="text-xs text-red-600">{errors.phone}</span>
            )}
          </div>

          {/* CEP */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 text-sm text-[#BF372A]">
              <MdLocationOn className="text-xl" />
              CEP <span className="text-[#A6A39F] text-xs font-normal ml-1">(opcional)</span>
            </label>
            <input
              type="text"
              name="defaultCep"
              value={form.defaultCep}
              onChange={handleChange}
              placeholder="00000000"
              maxLength={8}
              className={`rounded border bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none placeholder:text-[#A6A39F] transition-colors ${
                errors.defaultCep ? "border-red-500" : "border-[#BF372A]"
              }`}
            />
            {errors.defaultCep && (
              <span className="text-xs text-red-600">{errors.defaultCep}</span>
            )}
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 text-sm text-[#BF372A]">
              <FaLock className="text-base" />
              SENHA
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Mín. 8 caracteres"
                className={`w-full rounded border bg-[#F2EFDC] px-3 py-2.5 pr-10 text-sm text-[#261F1A] outline-none placeholder:text-[#A6A39F] transition-colors ${
                  errors.password ? "border-red-500" : "border-[#BF372A]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6A39F] hover:text-[#BF372A] transition-colors"
              >
                {showPassword ? <HiEyeOff size={16} /> : <HiEye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-600">{errors.password}</span>
            )}
          </div>

          {/* Confirmar senha */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 text-sm text-[#BF372A]">
              <FaLock className="text-base" />
              CONFIRMAR SENHA
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repita a senha"
                className={`w-full rounded border bg-[#F2EFDC] px-3 py-2.5 pr-10 text-sm text-[#261F1A] outline-none placeholder:text-[#A6A39F] transition-colors ${
                  errors.confirmPassword ? "border-red-500" : "border-[#BF372A]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6A39F] hover:text-[#BF372A] transition-colors"
              >
                {showConfirm ? <HiEyeOff size={16} /> : <HiEye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-red-600">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Erro global da API */}
          {apiError && (
            <div className="rounded border border-red-400 bg-red-50 px-3 py-2 text-xs text-red-700">
              {apiError}
            </div>
          )}

          {/* Botões */}
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 rounded border border-[#261F1A] bg-transparent py-3 text-sm font-bold tracking-[0.04em] text-[#261F1A] hover:bg-[#261F1A] hover:text-[#F2EFDC] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded bg-[#BF372A] py-3 text-sm font-bold tracking-[0.04em] text-[#F2EFDC] disabled:opacity-70 hover:bg-[#a02d22] transition-colors"
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>

        {/* Rodapé */}
        <div className="mt-5 flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-[#A6A39F]" />
          <span className="text-[13px] text-[#261F1A]">Já tem conta?</span>
          <div className="h-px flex-1 bg-[#A6A39F]" />
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded bg-[#261F1A] px-8 py-3 text-sm font-bold tracking-[0.04em] text-[#F2EFDC] hover:bg-[#3a2e27] transition-colors"
        >
          Fazer login
        </button>
      </div>
    </div>
  );
}