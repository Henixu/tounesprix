import { api } from "@/services/api";
import type { UserRole } from "@/services/auth";

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export async function getUsers() {
  const response = await api.get<AdminUser[]>("/users");
  return response.data;
}

export async function updateUserRole(id: string, role: UserRole) {
  const response = await api.put<AdminUser>(`/users/${id}/role`, { role });
  return response.data;
}

export async function deleteUser(id: string) {
  const response = await api.delete<{ message: string }>(`/users/${id}`);
  return response.data;
}
