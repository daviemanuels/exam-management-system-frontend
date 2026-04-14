"use client";

import { useEffect, useState } from "react";
import { getLogs } from "@/services/logs";

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";

type Log = {
  id: string;
  message: string;
  createdAt: string;
  user: {
    nome: string;
    login: string;
  };
};

export default function LogsPage() {
  const [data, setData] = useState<Log[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  async function fetchData(search = "") {
    const response = await getLogs({
      search,
      page: 1,
      limit: 20,
    });

    setData(response.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // busca com delay simples
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData(globalFilter);
    }, 400);

    return () => clearTimeout(delay);
  }, [globalFilter]);

  function formatDate(date: string) {
    return new Date(date).toLocaleString("pt-BR");
  }

  const columns: ColumnDef<Log>[] = [
    {
      header: "Mensagem",
      accessorKey: "message",
    },
    {
      header: "Usuário",
      cell: ({ row }) => row.original.user?.nome || "—",
    },
    {
      header: "Login",
      cell: ({ row }) => row.original.user?.login || "—",
    },
    {
      header: "Data",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Logs do Sistema</h1>

      {/* BUSCA */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar logs..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />
      </div>

      {/* TABELA */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="p-2 md:p-3 text-left cursor-pointer text-sm md:text-base"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="p-2 md:p-3 text-sm md:text-base break-words max-w-[300px]"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <p className="p-4 text-center text-gray-500">Nenhum log encontrado</p>
        )}
      </div>
    </div>
  );
}
