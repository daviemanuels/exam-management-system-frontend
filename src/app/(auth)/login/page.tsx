"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    console.log({ login, senha });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center"
      >
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo_exam_management_system.png"
            alt="Logo"
            width={200}
            height={200}
            priority
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
