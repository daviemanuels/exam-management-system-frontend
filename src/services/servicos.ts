import {
  CreateServicoDTO,
  UpdateServicoDTO,
} from "@/types/servicos/ServicoDTO";
import { api } from "./api";

export async function getServicos() {
  const response = await api.get("/servicos");
  return response.data;
}

export async function createServico(data: CreateServicoDTO) {
  const response = await api.post("/servicos", data);
  return response.data;
}

export async function updateServico(id: string, data: UpdateServicoDTO) {
  const response = await api.put(`/servico/${id}`, data);
  return response.data;
}

export async function deleteServico(id: string) {
  const response = await api.delete(`/servico/${id}`);
  return response.data;
}
