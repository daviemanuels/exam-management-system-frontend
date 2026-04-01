"use client";

import { useEffect, useState } from "react";
import { getRoles, createRole, updateRole, deleteRole } from "@/services/roles";

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

import { useForm } from "react-hook-form";

type Role = {
  id: string;
  name: string;
  status: "Ativo" | "Desativado";
};

export default function RolesPage() {
  const [data, setData] = useState<Role[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<Role>();

  function handleCloseModal() {
    setOpenCreate(false);
    setOpenEdit(false);
    setSelectedRoleId(null);
    reset();
  }

  function handleOpenEdit(role: Role) {
    setSelectedRoleId(role.id);
    setOpenEdit(true);

    setValue("name", role.name);
    setValue("status", role.status);
  }

  async function handleUpdateRole(data: Role) {
    if (!selectedRoleId) return;

    await updateRole(selectedRoleId, {
      name: data.name,
      status: data.status,
    });

    handleCloseModal();
    setData(await getRoles());
  }

  async function handleCreateRole(data: Role) {
    await createRole({
      name: data.name,
    });

    handleCloseModal();
    setData(await getRoles());
  }

  const onSubmit = (data: Role) => {
    if (openEdit) {
      handleUpdateRole(data);
    } else {
      handleCreateRole(data);
    }
  };

  useEffect(() => {
    async function fetchRoles() {
      const response = await getRoles();
      setData(response);
    }

    fetchRoles();
  }, []);

  const columns: ColumnDef<Role>[] = [
    {
      header: "Nome",
      accessorKey: "name",
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
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenEdit(row.original)}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Alterar
          </button>

          <button
            onClick={async () => {
              if (!confirm("Tem certeza que deseja excluir esta role?")) return;

              await deleteRole(row.original.id);

              const response = await getRoles();
              setData(response);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Excluir
          </button>
        </div>
      ),
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
      <h1 className="text-2xl font-bold mb-4">Roles</h1>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar role..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />

        <button
          onClick={() => setOpenCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Cadastrar role
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="p-3 text-left text-sm font-semibold cursor-pointer"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}

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
            Nenhuma role encontrada
          </p>
        )}
      </div>

      {/* PAGINAÇÃO */}
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

      {/* MODAL */}
      {(openCreate || openEdit) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {openEdit ? "Editar role" : "Cadastrar role"}
            </h2>

            <div className="flex flex-col gap-2">
              <input
                className="border p-2 rounded"
                placeholder="Nome da role"
                {...register("name")}
              />

              {openEdit && (
                <select className="border p-2 rounded" {...register("status")}>
                  <option value="">Selecione o status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Desativado">Desativado</option>
                </select>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit(onSubmit)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
