import { PacienteDTO } from "@/types/paciente/PacienteDTO";
import { api } from "./api";

export async function getPacientes() {
  const response = await api.get("/pacientes");
  return response.data;
}

export async function createPaciente(data: PacienteDTO) {
  const response = await api.post("/pacientes", data);
  return response.data;
}

export async function updatePaciente(id: string, data: PacienteDTO) {
  const response = await api.put(`/paciente/${id}`, data);
  return response.data;
}

export async function deletePaciente(id: string) {
  const response = await api.delete(`/paciente/${id}`);
  return response.data;
}
