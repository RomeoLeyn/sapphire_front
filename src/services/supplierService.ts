import api from "../config/api.config";
import { PaginationResponse, Supplier } from "../types";

export const getSuppliers = async (page: number, filters: { materialId?: number; }
): Promise<
  PaginationResponse<Supplier[]>
> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());

  if (filters.materialId !== undefined) {
    params.append("materialId", filters.materialId.toString());
  }

  const response = await api.get(`/suppliers?${params.toString()}`);
  return response.data;
};

export const getBriefSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get("/suppliers/brief");
  return response.data;
};

export const getSupplierById = async (id: string): Promise<Supplier> => {
  const response = await api.get(`/suppliers/${id}`);
  return response.data;
};

export const createSupplier = async (
  supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">
): Promise<Supplier> => {
  const response = await api.post("/suppliers", supplier);
  return response.data;
};

export const updateSupplier = async (
  id: string,
  supplier: Partial<Supplier>
): Promise<Supplier> => {
  const response = await api.put(`/suppliers/${id}`, supplier);
  return response.data;
};

export const updateLastSupplyDate = async (id: number) => {
  const response = await api.patch(
    `/suppliers/${id}/lastSupplyDate`,
    new Date()
  );
  return response.data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  await api.delete(`/suppliers/${id}`);
};

export const getSuppliersByMaterialId = async (id: string) => {
  const response = await api.get(`/materials/${id}/suppliers`);
  return response.data;
};
