
"use client";
 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
 
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
 
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
 
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
 
    if (!response.ok) {
      alert("Credenciais inválidas");
      setLoading(false);
      return;
    }
 
    const data = await response.json();
    const token = data.acess_token;
 
    localStorage.setItem("token", token);
    localStorage.setItem("refresh_token", data.refresh_token); // salva o refresh também
 
    const decoded: any = jwtDecode(token);
    localStorage.setItem("userName", decoded.name);
 
    const role = decoded.role;
 
    if (role === "SELLER") {
      router.push("/Painel-seller");
    } else if (role === "ADMIN") {
      router.push("/Painel-adm");
    } else {
      alert("Você não possui acesso");
      localStorage.removeItem("token");
    }
 
    setLoading(false);
  }
 
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "'Georgia', serif",
        backgroundColor: "#261F1A",
      }}
    >
      {/* Left — photo */}
      <div
        style={{
          flex: 1,
          backgroundImage: "url('/store-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.85)",
          minHeight: "100%",
        }}
      />
 
      {/* Right — login panel */}
      <div
        style={{
          width: "420px",
          backgroundColor: "#F2EFDC",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
          gap: "0px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <img src="/logo.png" alt="RetroVault" style={{ height: "52px" }} />
          <span
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#261F1A",
              letterSpacing: "0.02em",
            }}
          >
            Painel do vendedor.
          </span>
        </div>
 
        {/* Title */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#261F1A",
            marginBottom: "24px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            fontFamily: "'Courier New', monospace",
          }}
        >
          LOGIN
        </h1>
 
        <form
          onSubmit={handleLogin}
          style={{ width: "100%", display: "flex", flexDirection: "column", gap: "14px" }}
        >
          {/* CPF field — visually present as in mockup but not used in auth */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontSize: "14px",
                color: "#261F1A",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ color: "#BF372A" }}>👤</span> CPF
            </label>
            <input
              type="text"
              placeholder=""
              style={{
                border: "1.5px solid #A6A39F",
                borderRadius: "4px",
                padding: "10px 12px",
                backgroundColor: "#F2EFDC",
                fontSize: "14px",
                outline: "none",
                color: "#261F1A",
              }}
            />
          </div>
 
          {/* E-mail */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontSize: "14px",
                color: "#261F1A",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ color: "#BF372A" }}>👤</span> E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                border: "1.5px solid #A6A39F",
                borderRadius: "4px",
                padding: "10px 12px",
                backgroundColor: "#F2EFDC",
                fontSize: "14px",
                outline: "none",
                color: "#261F1A",
              }}
            />
          </div>
 
          {/* Senha */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{
                fontSize: "14px",
                color: "#261F1A",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ color: "#BF372A" }}>🔒</span> Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                border: "1.5px solid #A6A39F",
                borderRadius: "4px",
                padding: "10px 12px",
                backgroundColor: "#F2EFDC",
                fontSize: "14px",
                outline: "none",
                color: "#261F1A",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "#BF372A",
                cursor: "pointer",
                marginTop: "2px",
              }}
            >
              esqueceu a senha?
            </span>
          </div>
 
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#BF372A",
              color: "#F2EFDC",
              border: "none",
              borderRadius: "6px",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "8px",
              letterSpacing: "0.04em",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Entrando..." : "Continuar"}
          </button>
        </form>
 
        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            margin: "20px 0 16px",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#A6A39F" }} />
          <span style={{ fontSize: "13px", color: "#261F1A" }}>Novo aqui?</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#A6A39F" }} />
        </div>
 
        <p
          style={{
            fontSize: "13px",
            color: "#261F1A",
            textAlign: "center",
            lineHeight: "1.5",
            marginBottom: "16px",
          }}
        >
          Entre em contato com a sua equipe, para conseguir o seu acesso como
          vendedor de nosso E-commecer. O que você esta esperando?
          <br />
          <br />
          <strong>Entre para o time hoje mesmo.</strong>
        </p>
 
        <button
          style={{
            backgroundColor: "#261F1A",
            color: "#F2EFDC",
            border: "none",
            borderRadius: "6px",
            padding: "12px 32px",
            fontSize: "14px",
            fontWeight: "bold",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          Entre em contato
        </button>
      </div>
    </div>
  );
}