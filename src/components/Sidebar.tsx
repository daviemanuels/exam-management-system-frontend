"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookieClient } from "@/lib/cookieClient";

type TokenPayload = {
  id: string;
  role: string;
};

export function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const pathname = usePathname();

  const [role, setRole] = useState<string | null>(null);
  const [openCadastro, setOpenCadastro] = useState(false);

  useEffect(() => {
    const token = getCookieClient();

    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Erro ao decodificar token");
      }
    }
  }, []);

  function getLinkClass(path: string) {
    return `p-2 rounded cursor-pointer ${
      pathname === path ? "bg-primary" : "hover:bg-primary"
    }`;
  }

  const isAdmin = role === "Administrador";

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-primaryDark text-white p-4
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block
        `}
      >
        {/* Botão fechar mobile */}
        <button className="md:hidden mb-4" onClick={() => setOpen(false)}>
          ✕
        </button>

        <h1 className="text-xl font-bold mb-6">Exam System</h1>

        <nav className="flex flex-col gap-2">
          {isAdmin && (
            <Link href="/dashboard" className={getLinkClass("/dashboard")}>
              Dashboard
            </Link>
          )}

          {isAdmin && (
            <div>
              <div
                onClick={() => setOpenCadastro(!openCadastro)}
                className="p-2 rounded cursor-pointer hover:bg-primary flex justify-between"
              >
                <span>Cadastrar</span>
                <span>{openCadastro ? "▲" : "▼"}</span>
              </div>

              {openCadastro && (
                <div className="ml-4 mt-1 flex flex-col gap-1">
                  <Link
                    href="/pacientes"
                    className={getLinkClass("/pacientes")}
                  >
                    Pacientes
                  </Link>

                  <Link href="/users" className={getLinkClass("/users")}>
                    Usuários
                  </Link>

                  <Link href="/roles" className={getLinkClass("/roles")}>
                    Roles
                  </Link>

                  <Link href="/servicos" className={getLinkClass("/servicos")}>
                    Serviços
                  </Link>
                </div>
              )}
            </div>
          )}

          <Link href="/exames" className={getLinkClass("/exames")}>
            Exames
          </Link>

          {isAdmin && (
            <Link href="/logs" className={getLinkClass("/logs")}>
              Logs
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
}
