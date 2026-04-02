import { CreateExameDTO, UpdateExameDTO } from "@/types/exames/ExamesDTO";
import { api } from "./api";

export async function getExames() {
  const response = await api.get("/exames");
  return response.data;
}

export async function createExames(data: CreateExameDTO) {
  const response = await api.post("/exames", data);
  return response.data;
}

export async function updateExames(id: string, data: UpdateExameDTO) {
  const response = await api.put(`/exame/${id}`, data);
  return response.data;
}

export async function deleteExames(id: string) {
  const response = await api.delete(`/exame/${id}`);
  return response.data;
}
