import { api } from "@/services/api";
import type { Store } from "@/services/stores";

export type Price = {
  _id: string;
  productId: string;
  storeId: Store;
  price: number;
  date: string;
};

export type PricePayload = {
  productId: string;
  storeId: string;
  price: number;
  date?: string;
};

export async function getPricesByProduct(productId: string) {
  const response = await api.get<Price[]>(`/prices/product/${productId}`);
  return response.data;
}

export async function getBestPriceForProduct(productId: string) {
  const response = await api.get<Price>(`/prices/product/${productId}/best`);
  return response.data;
}

export async function createPrice(data: PricePayload) {
  const response = await api.post<Price>("/prices", data);
  return response.data;
}
