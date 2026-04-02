"use client";

import { useEffect, useState } from "react";
import {
  getServicos,
  createServico,
  updateServico,
  deleteServico,
} from "@/services/servicos";

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { useForm } from "react-hook-form";
import { Servico } from "@/types/servicos/ServicoDTO";

export default function ServicosPage() {
  const [data, setData] = useState<Servico[]>([]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Servico>();

  // 🔄 Fetch
  async function fetchData() {
    const response = await getServicos();
    setData(response); // 🔥 padrão que definimos
  }

  useEffect(() => {
    fetchData();
  }, []);

  // 🔒 Modal
  function handleCloseModal() {
    setOpenCreate(false);
    setOpenEdit(false);
    setSelectedId(null);
    reset();
  }

  // ✏️ Editar
  function handleOpenEdit(servico: Servico) {
    setSelectedId(servico.id);
    setOpenEdit(true);

    setValue("nome", servico.nome);
    setValue("status", servico.status ? "true" : "false");
  }

  // 🚀 Create
  async function handleCreate(dataForm: Servico) {
    await createServico({
      nome: dataForm.nome,
    });

    handleCloseModal();
    fetchData();
  }

  // ✏️ Update
  async function handleUpdate(dataForm: any) {
    if (!selectedId) return;

    await updateServico(selectedId, {
      nome: dataForm.nome,
      status: dataForm.status === "true", // 🔥 conversão aqui
    });

    handleCloseModal();
    fetchData();
  }

  const onSubmit = (dataForm: Servico) => {
    if (openEdit) {
      handleUpdate(dataForm);
    } else {
      handleCreate(dataForm);
    }
  };

  // 📊 Tabela
  const columns: ColumnDef<Servico>[] = [
    {
      header: "Nome",
      accessorKey: "nome",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.original.status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.original.status ? "Ativo" : "Desativado"}
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
              if (!confirm("Deseja excluir este serviço?")) return;

              try {
                await deleteServico(row.original.id);
                fetchData();
              } catch (err: any) {
                alert(err.response?.data?.error || "Erro ao excluir serviço");
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
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Serviços</h1>

      <button
        onClick={() => setOpenCreate(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        + Novo serviço
      </button>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="p-3 text-left">
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
            Nenhum serviço encontrado
          </p>
        )}
      </div>

      {/* MODAL */}
      {(openCreate || openEdit) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {openEdit ? "Editar serviço" : "Cadastrar serviço"}
            </h2>

            <div className="flex flex-col gap-2">
              <input
                {...register("nome", { required: "Nome é obrigatório" })}
                placeholder="Nome do serviço"
                className="border p-2 rounded"
              />

              {errors.nome && (
                <span className="text-red-500 text-sm">
                  {errors.nome.message}
                </span>
              )}
            </div>

            {openEdit && (
              <select
                {...register("status", { required: true })}
                className="border p-2 rounded mt-3"
              >
                <option value="">Selecione o status</option>
                <option value="true">Ativo</option>
                <option value="false">Desativado</option>
              </select>
            )}

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
