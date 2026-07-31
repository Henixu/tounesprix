import { api } from "@/services/api";

export type Store = {
  _id: string;
  name: string;
  logo: string;
  city: string;
  website: string;
};

export type StorePayload = {
  name: string;
  logo?: string;
  city?: string;
  website?: string;
};

export async function getStores() {
  const response = await api.get<Store[]>("/stores");
  return response.data;
}

export async function getStoreById(id: string) {
  const response = await api.get<Store>(`/stores/${id}`);
  return response.data;
}

export async function createStore(data: StorePayload) {
  const response = await api.post<Store>("/stores", data);
  return response.data;
}

export async function updateStore(id: string, data: Partial<StorePayload>) {
  const response = await api.put<Store>(`/stores/${id}`, data);
  return response.data;
}

export async function deleteStore(id: string) {
  const response = await api.delete<{ message: string }>(`/stores/${id}`);
  return response.data;
}
