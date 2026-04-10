"use client";

import { useState } from "react";
import Image from "next/image";
import { setCookie } from "cookies-next";
import { api } from "@/services/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        login,
        senha,
      });

      setCookie("session", response.data.token, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });

      router.push("/exames");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      alert(err.response?.data?.message || "Erro ao fazer login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10 sm:py-0">
      <form
        onSubmit={handleLogin}
        className="
          w-full
          max-w-md
          bg-white
          p-6 sm:p-8
          rounded-2xl
          shadow-lg
          text-center
          mx-auto
        "
      >
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo_exam_management_system.png"
            alt="Logo"
            width={180}
            height={180}
            priority
            className="h-auto w-auto max-w-full"
          />
        </div>

        <h1 className="text-2xl font-bold mb-6 text-text">Login</h1>

        <input
          type="text"
          placeholder="Login"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-primary text-white p-3 rounded-lg hover:bg-primaryDark transition"
        >
          Entrar
        </button>

        <p className="text-sm mt-4 text-center">
          Não tem conta?{" "}
          <a href="/register" className="text-primary hover:underline">
            Cadastre-se
          </a>
        </p>
      </form>
    </div>
  );
}
