"use client";

import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  function handleLogout() {
    // ❌ remove o token
    deleteCookie("session");

    // 🔁 redireciona pro login
    router.replace("/login");
  }

  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-text">Dashboard</h2>

      <div>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
