"use client";

import { createUser } from "@/services/users";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createUser({
        nome,
        login,
        senha,
      });

      alert("Usuário cadastrado com sucesso");

      // limpar campos
      setNome("");
      setLogin("");
      setSenha("");

      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data?.error || "Erro ao cadastrar usuário");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleRegister}
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
        <h1 className="text-2xl font-bold text-text m-3">Cadastro</h1>

        <input
          type="text"
          placeholder="Nome"
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

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
          Cadastrar
        </button>

        <p className="text-sm mt-4 text-center">
          Já tem conta?{" "}
          <a href="/login" className="text-primary hover:underline">
            Fazer login
          </a>
        </p>
      </form>
    </div>
  );
}
