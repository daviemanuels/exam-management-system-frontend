"use client";

import { useEffect, useState } from "react";
import {
  getExames,
  createExames,
  deleteExames,
  updateExames,
} from "@/services/exames";
import { getPacientes } from "@/services/pacientes";

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { getServicos } from "@/services/servicos";
import { Exame } from "@/types/exames/ExamesDTO";
import { PacienteDTO } from "@/types/paciente/PacienteDTO";
import { Servico } from "@/types/servicos/ServicoDTO";
import Select from "react-select";
import { gerarProtocoloPdf } from "@/utils/gerarProtocoloPdf";

export default function ExamesPage() {
  const [data, setData] = useState<Exame[]>([]);
  const [pacientes, setPacientes] = useState<PacienteDTO[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [openCreate, setOpenCreate] = useState(false);

  const [tipo, setTipo] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>(
    [],
  );

  const options = pacientes.map((p) => ({
    value: p.id,
    label: p.nome,
  }));

  const pacienteSelecionado = pacientes.find((p) => p.id === pacienteId);

  async function fetchData() {
    const exames = await getExames();
    const pacientes = await getPacientes();
    const servicos = await getServicos();

    setData(exames.data);
    setPacientes(pacientes.data);
    setServicos(servicos);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleCloseModal() {
    setOpenCreate(false);
    setOpenEdit(false);
    setSelectedId(null);

    setTipo("");
    setPacienteId("");
    setServicosSelecionados([]);
  }

  async function handleSave() {
    if (openEdit && selectedId) {
      await updateExames(selectedId, {
        tipo,
        pacienteId,
        servicos: servicosSelecionados,
      });
    } else {
      await createExames({
        tipo,
        pacienteId,
        servicos: servicosSelecionados,
      });
      console.log(createExames);
    }

    handleCloseModal();
    fetchData();
  }

  function toggleServico(id: string) {
    setServicosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  function handleOpenEdit(exame: Exame) {
    setSelectedId(exame.id);
    setOpenEdit(true);

    // tipo
    setTipo(exame.tipo);

    // paciente
    setPacienteId(exame.paciente.id);

    // 🔥 serviços (transforma para string[])
    const servicosIds = exame.servicos.map((s) => s.servico.id);
    setServicosSelecionados(servicosIds);
  }

  const columns: ColumnDef<Exame>[] = [
    {
      header: "Paciente",
      cell: ({ row }) => row.original.paciente.nome,
    },
    {
      header: "Tipo",
      accessorKey: "tipo",
    },
    {
      header: "Serviços",
      cell: ({ row }) =>
        row.original.servicos.map((s) => s.servico.nome).join(", "),
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
              if (!confirm("Deseja excluir este exame?")) return;

              try {
                await deleteExames(row.original.id);
                fetchData();
              } catch (err: any) {
                alert(err.response?.data?.error || "Erro ao excluir exame");
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Excluir
          </button>
          <button
            onClick={() => gerarProtocoloPdf(row.original)}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Gerar Protocolo
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

  const selectedOption = options.find((opt) => opt.value === pacienteId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Exames</h1>

      <button
        onClick={() => setOpenCreate(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        + Novo exame
      </button>

      <table className="w-full bg-white shadow rounded">
        <thead>
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

      {/* MODAL */}
      {(openCreate || openEdit) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Novo exame</h2>

            {/* TIPO */}
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            >
              <option value="">Tipo</option>
              <option value="ANATOMO">Anátomo</option>
              <option value="COLPO">Colpo</option>
              <option value="IMUNO">Imuno</option>
              <option value="OUTROS">Outros</option>
            </select>

            {/* PACIENTE */}
            <Select
              options={options}
              value={selectedOption || null}
              placeholder="Selecione o paciente"
              onChange={(selected) => setPacienteId(selected?.value || "")}
              isClearable
            />

            {/* 🔥 DADOS DO PACIENTE */}
            {pacienteSelecionado && (
              <div className="bg-gray-100 p-3 rounded mb-3 text-sm">
                <p>
                  <b>CPF:</b> {pacienteSelecionado.cpf}
                </p>
                <p>
                  <b>Telefone:</b> {pacienteSelecionado.telefone}
                </p>
                <p>
                  <b>Email:</b> {pacienteSelecionado.email}
                </p>
              </div>
            )}

            {/* SERVIÇOS */}
            <div className="mb-3 mt-2">
              <p className="font-semibold mb-1">Serviços</p>

              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                {servicos.map((s) => (
                  <label key={s.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={servicosSelecionados.includes(s.id)}
                      onChange={() => toggleServico(s.id)}
                    />
                    {s.nome}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
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
