"use client";

import { useEffect, useState } from "react";
import { getUsers } from "@/services/users";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";

type User = {
  id: string;
  nome: string;
  login: string;
  status: string;
  role?: {
    name: string;
  };
};

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      const response = await getUsers();
      setData(response);
    }

    fetchUsers();
  }, []);

  const columns: ColumnDef<User>[] = [
    {
      header: "Nome",
      accessorKey: "nome",
    },
    {
      header: "Login",
      accessorKey: "login",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.original.status === "Ativo"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: "Role",
      cell: ({ row }) => row.original.role?.name || "Sem role",
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
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>

      {/* 🔍 Filtro */}
      <input
        type="text"
        placeholder="Buscar usuário..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 p-2 border rounded w-full md:w-1/3"
      />

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="p-3 text-left text-sm font-semibold cursor-pointer select-none"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}

                    {/* 🔽 Indicador de ordenação */}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            Nenhum usuário encontrado
          </p>
        )}
      </div>

      {/* 📄 Paginação */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="text-sm">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
