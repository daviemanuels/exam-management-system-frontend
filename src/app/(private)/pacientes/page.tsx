"use client";

import { useEffect, useState } from "react";
import {
  getPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente,
} from "@/services/pacientes";

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
import ReactInputMask from "react-input-mask";

import { useForm } from "react-hook-form";

type Paciente = {
  id: string;
  nome: string;
  cpf: string;
  email?: string | null;
  telefone?: string | null;
  dataNascimento?: string | null;
  nacionalidade?: string | null;
  sexo: "Masculino" | "Feminino";
  endereco?: string | null;
};

export default function PacientesPage() {
  const [data, setData] = useState<Paciente[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const InputMask = ReactInputMask as any;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Paciente>();

  function handleCloseModal() {
    setOpenCreate(false);
    setOpenEdit(false);
    setSelectedId(null);
    reset();
  }

  function onlyNumbers(value: string) {
    return value.replace(/\D/g, "");
  }

  function handleOpenEdit(paciente: Paciente) {
    setSelectedId(paciente.id);
    setOpenEdit(true);

    Object.entries(paciente).forEach(([key, value]) => {
      setValue(key as keyof Paciente, value as any);
    });
  }

  async function handleUpdate(dataForm: Paciente) {
    if (!selectedId) return;

    await updatePaciente(selectedId, {
      ...dataForm,
      cpf: onlyNumbers(dataForm.cpf),
      telefone: dataForm.telefone ? onlyNumbers(dataForm.telefone) : undefined,
    });

    handleCloseModal();
    fetchData();
  }

  async function handleCreate(dataForm: Paciente) {
    await createPaciente({
      ...dataForm,
      cpf: onlyNumbers(dataForm.cpf),
      telefone: dataForm.telefone ? onlyNumbers(dataForm.telefone) : undefined,
    });

    handleCloseModal();
    fetchData();
  }

  const onSubmit = (dataForm: Paciente) => {
    if (openEdit) {
      handleUpdate(dataForm);
    } else {
      handleCreate(dataForm);
    }
  };

  async function fetchData() {
    const response = await getPacientes();
    setData(response.data); // 🔥 importante (DTO com paginação)
  }

  useEffect(() => {
    fetchData();
  }, []);

  function formatCPF(cpf: string) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  const columns: ColumnDef<Paciente>[] = [
    {
      header: "Nome",
      accessorKey: "nome",
    },
    {
      header: "CPF",
      accessorKey: "cpf",
      cell: ({ row }) => formatCPF(row.original.cpf),
    },
    {
      header: "Sexo",
      accessorKey: "sexo",
    },
    {
      header: "Telefone",
      accessorKey: "telefone",
    },
    {
      header: "Email",
      accessorKey: "email",
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
              if (!confirm("Deseja excluir este paciente?")) return;

              try {
                await deletePaciente(row.original.id);
                fetchData();
              } catch (err: any) {
                alert(err.response?.data?.error || "Erro ao excluir paciente");
              }
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
      <h1 className="text-2xl font-bold mb-4">Pacientes</h1>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="p-2 border rounded w-full md:w-1/3"
        />

        <button
          onClick={() => setOpenCreate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Cadastrar paciente
        </button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="p-3 text-left cursor-pointer"
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
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            Nenhum paciente encontrado
          </p>
        )}
      </div>

      {/* MODAL */}
      {(openCreate || openEdit) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {openEdit ? "Editar paciente" : "Cadastrar paciente"}
            </h2>

            <div className="flex flex-col gap-2">
              <input
                {...register("nome", { required: "Nome é obrigatório" })}
                placeholder="Nome"
                className="border p-2 rounded"
              />

              {errors.nome && (
                <span className="text-red-500 text-sm">
                  {errors.nome.message}
                </span>
              )}

              <InputMask
                mask="999.999.999-99"
                {...register("cpf", { required: "CPF é obrigatório" })}
              >
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    placeholder="CPF"
                    className="border p-2 rounded"
                  />
                )}
              </InputMask>

              {errors.cpf && (
                <span className="text-red-500 text-sm">
                  {errors.cpf.message}
                </span>
              )}
              <input
                {...register("email")}
                placeholder="Email"
                className="border p-2 rounded"
              />
              <InputMask mask="(99) 99999-9999" {...register("telefone")}>
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    placeholder="Telefone"
                    className="border p-2 rounded"
                  />
                )}
              </InputMask>
              <InputMask mask="99/99/9999" {...register("dataNascimento")}>
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    placeholder="Data de nascimento"
                    className="border p-2 rounded"
                  />
                )}
              </InputMask>
              <input
                {...register("nacionalidade")}
                placeholder="Nacionalidade"
                className="border p-2 rounded"
              />

              <select
                {...register("sexo", { required: "Sexo é obrigatório" })}
                className="border p-2 rounded"
              >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
              {errors.sexo && (
                <span className="text-red-500 text-sm">
                  {errors.sexo.message}
                </span>
              )}

              <input
                {...register("endereco")}
                placeholder="Endereço"
                className="border p-2 rounded"
              />
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
