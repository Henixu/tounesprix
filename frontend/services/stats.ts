import { api } from "@/services/api";
import type { Price } from "@/services/prices";
import type { Product } from "@/services/products";
import type { Store } from "@/services/stores";

export type BestOfferStat = {
  product: Product;
  price: number;
  store: Store | null;
};

export type StatsOverview = {
  productCount: number;
  storeCount: number;
  averagePrice: number;
  cheapest: BestOfferStat | null;
  mostExpensive: BestOfferStat | null;
};

export type CategoryStat = { category: string; count: number };
export type BrandStat = { brand: string; count: number };
export type BestPriceStoreStat = { store: Store | null; count: number };

export async function getStatsOverview() {
  const response = await api.get<StatsOverview>("/stats/overview");
  return response.data;
}

export async function getStatsByCategory() {
  const response = await api.get<CategoryStat[]>("/stats/by-category");
  return response.data;
}

export async function getStatsByBrand() {
  const response = await api.get<BrandStat[]>("/stats/by-brand");
  return response.data;
}

export async function getBestPriceStores() {
  const response = await api.get<BestPriceStoreStat[]>("/stats/best-price-stores");
  return response.data;
}

export async function getPriceEvolution(productId: string) {
  const response = await api.get<Price[]>(`/stats/price-evolution/${productId}`);
  return response.data;
}
