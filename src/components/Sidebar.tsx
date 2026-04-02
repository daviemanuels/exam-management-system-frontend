"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  function getLinkClass(path: string) {
    return `p-2 rounded cursor-pointer ${
      pathname === path ? "bg-primary" : "hover:bg-primary"
    }`;
  }

  return (
    <aside className="w-64 h-screen bg-primaryDark text-white p-4">
      <h1 className="text-xl font-bold mb-6">Exam System</h1>

      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className={getLinkClass("/dashboard")}>
          Dashboard
        </Link>

        <Link href="/pacientes" className={getLinkClass("/pacientes")}>
          Pacientes
        </Link>

        <Link href="/users" className={getLinkClass("/users")}>
          Usuários
        </Link>

        <Link href="/roles" className={getLinkClass("/roles")}>
          Roles
        </Link>

        <Link href="/exames" className={getLinkClass("/exames")}>
          Exames
        </Link>

        <Link href="/servicos" className={getLinkClass("/servicos")}>
          Serviços
        </Link>

        <Link href="/logs" className={getLinkClass("/logs")}>
          Logs
        </Link>
      </nav>
    </aside>
  );
}
