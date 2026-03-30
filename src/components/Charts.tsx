"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  status: { status: string; total: number }[];
  tipos: { tipo: string; total: number }[];
  meses: { mes: string; total: number }[];
};

export function Charts({ status, tipos, meses }: Props) {
  // ✅ STATUS (pizza)
  const statusOptions = {
    labels: status.map((s) => s.status),
  };

  const statusSeries = status.map((s) => s.total);

  // ✅ TIPOS (barra)
  const tiposOptions = {
    xaxis: {
      categories: tipos.map((t) => t.tipo),
    },
  };

  const tiposSeries = [
    {
      name: "Exames",
      data: tipos.map((t) => t.total),
    },
  ];

  // ✅ MESES (linha)
  const mesesOptions = {
    xaxis: {
      categories: meses.map((m) => m.mes),
    },
  };

  const mesesSeries = [
    {
      name: "Exames por mês",
      data: meses.map((m) => m.total),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <div className="bg-white p-4 rounded shadow flex flex-col">
        <h2 className="mb-2 font-semibold">Status dos Exames</h2>
        <div className="flex-1">
          <Chart
            type="pie"
            series={statusSeries}
            options={statusOptions}
            height="100%"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow flex flex-col">
        <h2 className="mb-2 font-semibold">Tipos de Exame</h2>
        <div className="flex-1">
          <Chart
            type="bar"
            series={tiposSeries}
            options={tiposOptions}
            height="100%"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow flex flex-col md:col-span-2">
        <h2 className="mb-2 font-semibold">Exames por Mês</h2>
        <div className="flex-1">
          <Chart
            type="line"
            series={mesesSeries}
            options={mesesOptions}
            height="100%"
          />
        </div>
      </div>
    </div>
  );
}
