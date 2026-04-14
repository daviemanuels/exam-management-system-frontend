import { api } from "@/services/api";
import { CreateUserDTO } from "@/types/user/UserDTO";

export async function getUsers() {
  const response = await api.get("/users");
  return response.data;
}

export async function createUser(data: CreateUserDTO) {
  const response = await api.post("/users", data);
  return response.data;
}

export async function updateUser(id: string, data: CreateUserDTO) {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: string) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}
