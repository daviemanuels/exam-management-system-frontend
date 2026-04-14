"use client";

import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  nome: string;
  email?: string;
  role?: string;
};

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();

  const token = getCookie("session") as string | undefined;

  let userName = "";

  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      userName = decoded.nome;
    } catch (err) {
      console.error("Erro ao decodificar token", err);
    }
  }

  function handleLogout() {
    deleteCookie("session");
    router.replace("/login");
  }

  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-4 md:px-6">
      {/* ESQUERDA */}
      <div className="flex items-center gap-3">
        {/* Botão menu (mobile) */}
        <button onClick={onMenuClick} className="md:hidden text-xl">
          ☰
        </button>

        <h2 className="text-sm md:text-lg font-semibold text-text">
          Bem-vindo, {userName || "usuário"}
        </h2>
      </div>

      {/* DIREITA */}
      <button
        onClick={handleLogout}
        className="text-xs md:text-sm bg-red-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </header>
  );
}
