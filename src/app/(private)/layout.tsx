"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { getCookieClient } from "@/lib/cookieClient";

type TokenPayload = {
  id: string;
  role: string;
};

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getCookieClient();

    if (!token) {
      router.replace("/");
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);

      const adminRoutes = [
        "/dashboard",
        "/pacientes",
        "/roles",
        "/servicos",
        "/users",
      ];

      const path = window.location.pathname;

      const isAdminRoute = adminRoutes.some(
        (route) => path === route || path.startsWith(route + "/"),
      );

      if (isAdminRoute && decoded.role !== "Administrador") {
        setLoading(false);
        router.replace("/exames");
        return;
      }

      setLoading(false);
    } catch {
      router.replace("/");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 bg-gray-100 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
