"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { MdPerson } from "react-icons/md";
import { FaLock } from "react-icons/fa";

interface JwtPayload {
  name: string;
  role: "SELLER" | "ADMIN";
  sub: string;
  exp: number;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // necessário para receber o cookie do refresh_token
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(body?.message || "Credenciais inválidas");
      return;
    }

    const data = await response.json();

    // backend retorna "accessToken" agora (não mais "acess_token")
    const token = data.accessToken;

    if (!token) {
      setError("Resposta inválida do servidor");
      return;
    }

    localStorage.setItem("token", token);
    // refresh_token agora vem em cookie HttpOnly, não precisa salvar manualmente

    const decoded = jwtDecode<{ sub: string; email: string; role: string }>(token);
    console.log("JWT decoded:", decoded);

    // name não está no JWT, salva o email como identificador
    localStorage.setItem("userEmail", decoded.email);
    localStorage.setItem("userId", decoded.sub);

    if (decoded.role === "SELLER") {
      router.push("/Painel-seller");
    } else if (decoded.role === "ADMIN") {
      router.push("/Painel-adm");
    } else {
      setError(`Perfil sem acesso: ${decoded.role}`);
      localStorage.removeItem("token");
    }
  } catch (err) {
    console.error("Erro no login:", err);
    setError("Erro de conexão com o servidor");
  } finally {
    setLoading(false);
  }
}
  return (
<div className="flex h-screen w-screen bg-[#261F1A] font-serif">
  <div
    className="flex-1 min-h-full bg-cover bg-center brightness-90"
    style={{ backgroundImage: "url('/banner.jpg')" }}
  />

  <div className="relative flex w-[420px] flex-col items-center justify-center gap-0 bg-[#F2EFDC] px-10 py-12">
    <div className="mb-7 flex items-center gap-3">
      <img
        src="/logo.png"
        alt="RetroVault"
        className="h-[52px]"
      />

      <span className="text-[18px] font-semibold tracking-[0.02em] text-[#261F1A]">
        Painel do vendedor.
      </span>
    </div>

    <h1 className="mb-6 font-mono text-[28px] font-bold uppercase tracking-[0.05em] text-[#261F1A]">
      LOGIN
    </h1>

    <form
      onSubmit={handleLogin}
      className="flex w-full flex-col gap-4"
    >

      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-1.5 text-sm text-[#261F1A]">
          <MdPerson className=" text-red-500 text-2xl  "/>
          <p className=" text-red-500 ">E-mail</p>
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded border border-[#BF372A] bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-1.5 text-sm text-[#261F1A]">
          <FaLock className="text-[#BF372A]" />
          <p className="text-[#BF372A]">Senha</p>
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded border  border-[#BF372A] bg-[#F2EFDC] px-3 py-2.5 text-sm text-[#261F1A] outline-none"
        />

        <span className="mt-0.5 cursor-pointer text-xs text-[#BF372A]">
          esqueceu a senha?
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded bg-[#BF372A] p-3 text-base font-bold tracking-[0.04em] text-[#F2EFDC] disabled:opacity-70"
      >
        {loading ? "Entrando..." : "Continuar"}
      </button>
    </form>

    <div className="my-5 flex w-full items-center gap-3">
      <div className="h-px flex-1 bg-[#A6A39F]" />
      <span className="text-[13px] text-[#261F1A]">
        Novo aqui?
      </span>
      <div className="h-px flex-1 bg-[#A6A39F]" />
    </div>

    <p className="mb-4 text-center text-[13px] leading-6 text-[#261F1A]">
      Entre em contato com a sua equipe, para conseguir o seu acesso como
      vendedor de nosso E-commerce. O que você está esperando?
      <br />
      <br />
      <strong>Entre para o time hoje mesmo.</strong>
    </p>

    <button className="rounded bg-[#261F1A] px-8 py-3 text-sm font-bold tracking-[0.04em] text-[#F2EFDC]">
      Entre em contato
    </button>
  </div>
</div>
  );
}