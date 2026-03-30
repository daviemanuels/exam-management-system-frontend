"use client";

import { useEffect, useState } from "react";
import { createUser, deleteUser, getUsers, updateUser } from "@/services/users";
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
import { getRoles } from "@/services/roles";
import { CreateUserDTO } from "@/types/user/CreateUserDTO";
import { useForm } from "react-hook-form";

type User = {
  id: string;
  nome: string;
  login: string;
  senha?: string;
  confirmSenha: string;
  status: string;
  funcao_usuario: string;
  roleId: string;
  role?: Role;
};

type Role = {
  id: string;
  name: string;
};

export default function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<User>();

  function handleCloseModal() {
    setOpenCreate(false);
    setOpenEdit(false);
    setSelectedUserId(null);
  }

  function handleOpenEdit(user: User) {
    setSelectedUserId(user.id);
    setOpenEdit(true);

    setValue("nome", user.nome);
    setValue("login", user.login);
    setValue("senha", "");
    setValue("confirmSenha", "");
    setValue("funcao_usuario", user.funcao_usuario);
    setValue("status", user.status);
    setValue("roleId", user.role?.id || "");
  }

  async function handleUpdateUser(data: User) {
    if (!selectedUserId) return;

    await updateUser(selectedUserId, {
      nome: data.nome,
      login: data.login,
      senha: data.senha || undefined,
      funcao_usuario: data.funcao_usuario,
      status: data.status!,
      roleId: data.roleId,
    });

    setOpenEdit(false);
    setSelectedUserId(null);
    reset();
    setData(await getUsers());
  }

  async function handleCreateUser(data: User) {
    if (data.senha !== data.confirmSenha) {
      alert("Senhas não conferem");
      return;
    }

    await createUser({
      nome: data.nome,
      login: data.login,
      senha: data.senha,
      funcao_usuario: data.funcao_usuario,
      roleId: data.roleId,
    });

    setOpenCreate(false);
    reset();
    setData(await getUsers());
  }

  const onSubmit = (data: User) => {
    if (openEdit) {
      handleUpdateUser(data);
    } else {
      handleCreateUser(data);
    }
  };

  useEffect(() => {
    async function fetchUsers() {
      const response = await getUsers();
      setData(response);
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (error) {
        console.error("Erro ao buscar roles:", error);
      }
    }

    fetchRoles();
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
              if (!confirm("Tem certeza que deseja excluir este usuário?"))
                return;

              await deleteUser(row.original.id);

              const response = await getUsers();
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
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar usuário..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />

        <button
          onClick={() => setOpenCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Cadastrar usuário
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
      {(openCreate || openEdit) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {openEdit ? "Editar usuário" : "Cadastrar usuário"}
            </h2>

            <div className="flex flex-col gap-2">
              {/* NOME */}
              <input
                className="border p-2 rounded"
                placeholder="Nome"
                {...register("nome")}
              />

              {/* LOGIN */}
              <input
                className="border p-2 rounded"
                placeholder="Login"
                {...register("login")}
              />

              {/* SENHA */}
              <input
                type="password"
                className="border p-2 rounded"
                placeholder="Senha"
                {...register("senha")}
              />

              {/* CONFIRMA SENHA (só create normalmente, mas mantive padrão) */}
              <input
                type="password"
                className="border p-2 rounded"
                placeholder="Repetir senha"
                {...register("confirmSenha")}
              />

              {/* FUNÇÃO USUÁRIO */}
              <input
                className="border p-2 rounded"
                placeholder="Função do usuário"
                {...register("funcao_usuario")}
              />

              {/* ROLE */}
              <select className="border p-2 rounded" {...register("roleId")}>
                <option value="">Selecione uma role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>

              {/* STATUS (NÃO APARECE NO CREATE) */}
              {openEdit && (
                <select className="border p-2 rounded" {...register("status")}>
                  <option value="">Selecione o status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Desativado">Desativado</option>
                </select>
              )}
            </div>

            {/* BOTÕES */}
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
