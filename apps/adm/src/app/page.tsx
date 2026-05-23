"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { jwtDecode } from "jwt-decode";

export default function LoginPage() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(
        e: React.FormEvent
    ) {

        e.preventDefault();

        const response = await fetch(
            "/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    email,
                    password,
                }),
            }
        );

        if (!response.ok) {

            alert("Credenciais inválidas");
            return;
        }

        const data = await response.json();

        console.log(data);

        const token =
            data.acess_token;

        localStorage.setItem(
            "token",
            token
        );

        const decoded: any =
            jwtDecode(token);

        console.log(decoded);

        const role = decoded.role;

        if (
            role === "ADMIN" ||
            role === "SELLER"
        ) {

            router.push("/Painel");

        } else {

            alert(
                "Você não possui acesso."
            );

            localStorage.removeItem(
                "token"
            );
        }
    }

    return (

        <div>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}