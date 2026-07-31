import { api } from "@/services/api";
import type { Price } from "@/services/prices";

export type Product = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  specifications: Record<string, string>;
  createdAt: string;
  bestPrice: Price | null;
};

export type ProductDetails = Product & {
  prices: Price[];
};

export type ProductFilters = {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
};

export type ProductInput = {
  name: string;
  brand: string;
  category: string;
  description?: string;
  specifications?: Record<string, string>;
  image?: File | null;
};

function buildProductFormData(data: Partial<ProductInput>) {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.brand !== undefined) formData.append("brand", data.brand);
  if (data.category !== undefined) formData.append("category", data.category);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.specifications !== undefined) {
    formData.append("specifications", JSON.stringify(data.specifications));
  }
  if (data.image) formData.append("image", data.image);
  return formData;
}

export async function getProducts(filters: ProductFilters = {}) {
  const params: Record<string, string> = {};
  if (filters.category) params.category = filters.category;
  if (filters.brand) params.brand = filters.brand;
  if (filters.search) params.search = filters.search;
  if (filters.minPrice !== undefined && filters.minPrice !== "") {
    params.minPrice = String(filters.minPrice);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== "") {
    params.maxPrice = String(filters.maxPrice);
  }

  const response = await api.get<Product[]>("/products", { params });
  return response.data;
}

export async function getProductById(id: string) {
  const response = await api.get<ProductDetails>(`/products/${id}`);
  return response.data;
}

export async function createProduct(data: ProductInput) {
  const response = await api.post<Product>("/products", buildProductFormData(data));
  return response.data;
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  const response = await api.put<Product>(`/products/${id}`, buildProductFormData(data));
  return response.data;
}

export async function deleteProduct(id: string) {
  const response = await api.delete<{ message: string }>(`/products/${id}`);
  return response.data;
}
