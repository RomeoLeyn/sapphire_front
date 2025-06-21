import api from "../config/api.config";
import { MaterialSupply, PaginationResponse } from "../types";

export const getSupplies = async (
  page: number,
  filters: { materialId?: number; supplierId?: number; status: string }
): Promise<PaginationResponse<MaterialSupply[]>> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());

  if (filters.materialId !== undefined) {
    params.append("materialId", filters.materialId.toString());
  }
  if (filters.supplierId) {
    params.append("supplierId", filters.supplierId.toString());
  }
  if (filters.status) {
    params.append("status", filters.status);
  }
  const response = await api.get(`/supplies?${params.toString()}`);
  return response.data;
};

export const createSupplies = async (
  supplies: Omit<MaterialSupply, "id" | "createdAt" | "updatedAt">
): Promise<MaterialSupply> => {
  const response = await api.post("/supplies", supplies);
  return response.data;
};

export const changeSuppliesStatus = async (id: string, status: string) => {
  const response = await api.patch(`/supplies/${id}/status`, status);
  return response.data;
};

export const updateSupplies = async (
  id: string,
  supplies: Partial<MaterialSupply>
): Promise<MaterialSupply> => {
  const response = await api.put(`/suppliers/${id}`, supplies);
  return response.data;
};

export const deleteSupplies = async (id: string): Promise<void> => {
  await api.delete(`/suppliers/${id}`);
};
