"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "@/services/dashboard";

type DashboardData = {
  totais: {
    pacientes: number;
    exames: number;
  };
  status: string;
  tipos: string;
  meses: string;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getDashboard();
        setData(response);
      } catch (error) {
        console.error("Erro ao carregar dashboard", error);
      }
    }

    fetchData();
  }, []);

  if (!data) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          Total de Exames: {data.totais.exames}
        </div>

        <div className="bg-white p-4 rounded shadow">
          Pacientes: {data.totais.pacientes}
        </div>

        <div className="bg-white p-4 rounded shadow">
          {/* exemplo simples */}
          Registros por Status: {data.status.length}
        </div>
      </div>
    </div>
  );
}
