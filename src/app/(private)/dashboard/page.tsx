"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "@/services/dashboard";
import { Charts } from "@/components/Charts";

type DashboardData = {
  totais: {
    pacientes: number;
    exames: number;
  };
  status: { status: string; total: number }[];
  tipos: { tipo: string; total: number }[];
  meses: { mes: string; total: number }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await getDashboard();
      setData(response);
    }

    fetchData();
  }, []);

  if (!data) return <p>Carregando...</p>;

  return (
    <div className="h-[calc(100vh-100px)] overflow-hidden flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Exames</p>
          <h2 className="text-2xl font-bold">{data.totais.exames}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Pacientes</p>
          <h2 className="text-2xl font-bold">{data.totais.pacientes}</h2>
        </div>
      </div>

      {/* Gráficos */}
      <Charts status={data.status} tipos={data.tipos} meses={data.meses} />
    </div>
  );
}
