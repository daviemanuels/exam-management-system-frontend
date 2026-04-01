import { CreateRoleDTO, UpdateRoleDTO } from "@/types/role/RoleDTO";
import { api } from "./api";

export async function getRoles() {
  const response = await api.get("/roles");
  return response.data;
}

export async function createRole(data: CreateRoleDTO) {
  const response = await api.post("/roles", data);
  return response.data;
}

export async function updateRole(id: string, data: UpdateRoleDTO) {
  const response = await api.put(`/role/${id}`, data);
  return response.data;
}

export async function deleteRole(id: string) {
  const response = await api.delete(`/role/${id}`);
  return response.data;
}
