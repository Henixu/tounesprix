import { api } from "@/services/api";

export type UserRole = "admin" | "user";

export type AuthResponse = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export async function login(data: LoginPayload) {
  const response = await api.post<AuthResponse>("/users/login", data);
  return response.data;
}

export async function register(data: RegisterPayload) {
  const response = await api.post<AuthResponse>("/users/register", data);
  return response.data;
}
