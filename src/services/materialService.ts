import api from "../config/api.config";
import {
  CreateMaterialUsage,
  Employee,
  Material,
  MaterialUsage,
  PaginationResponse,
} from "../types";

export const getMaterials = async (
  page: number,
  filters: { supplierId?: number; category?: string }
): Promise<PaginationResponse<Material[]>> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());

  if (filters.supplierId !== undefined) {
    params.append("supplierId", filters.supplierId.toString());
  }
  if (filters.category) {
    params.append("category", filters.category);
  }
  const response = await api.get(`/materials?${params.toString()}`);
  return response.data;
};

export const getBriefMaterials = async (): Promise<Material[]> => {
  const response = await api.get("/materials/brief");
  return response.data;
};

export const getMaterialById = async (
  id: string | undefined
): Promise<Material> => {
  const response = await api.get(`/materials/${id}`);
  return response.data;
};

export const createMaterial = async (
  material: Omit<Material, "id" | "createdAt" | "updatedAt">
): Promise<Material> => {
  const response = await api.post("/materials", material);
  return response.data;
};

export const updateMaterial = async (
  id: string,
  material: Partial<Material>
): Promise<Material> => {
  const response = await api.put(`/materials/${id}`, material);
  return response.data;
};

export const updateIncrementMaterial = async (
  id: number,
  increment: number
) => {
  const response = await api.patch(`materials/${id}/amount/inc`, increment);
  return response.data;
};

export const updateDecrementMaterial = async (
  id: string,
  increment: number
) => {
  const response = await api.patch(`materials/${id}/amount/dec`, increment);
  return response.data;
};

export const deleteMaterial = async (id: string): Promise<void> => {
  await api.delete(`/materials/${id}`);
};

export const getMaterialUsage = async (): Promise<MaterialUsage[]> => {
  const response = await api.get("/usage");
  return response.data;
};

export const getMaterialUsageLog = async (
  page: number,
  filters: { materialId?: number; employeeId?: number; }
): Promise<PaginationResponse<MaterialUsage[]>> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());

  if (filters.materialId !== undefined) {
    params.append("materialId", filters.materialId.toString());
  }
  if (filters.employeeId) {
    params.append("employeeId", filters.employeeId.toString());
  }
  const response = await api.get(`/usage?${params.toString()}`);
  return response.data;
};

export const getMaterialUsageLogForEmployee = async (employeeId?: string, page?: number): Promise<PaginationResponse<MaterialUsage[]>> => {
  const response = await api.get(`/usage/by-employee/${employeeId}?page=${page}`);
  return response.data;
};

export const logMaterialUsage = async (
  usage: Omit<
    CreateMaterialUsage,
    "id" | "createdAt" | "materialName" | "employeeName"
  >
): Promise<MaterialUsage> => {
  const response = await api.post("/usage", usage);
  return response.data;
};

// TODO
export const getMaterialUsageByDateRange = async (
  startDate: string,
  endDate: string
): Promise<MaterialUsage[]> => {
  const response = await api.get("/usage/report", {
    params: { startDate, endDate },
  });
  return response.data;
};

export const getMaterialUsageByMaterial = async (
  materialId: string
): Promise<MaterialUsage[]> => {
  const response = await api.get(`/usage/material/${materialId}`);
  return response.data;
};

export const getMaterialUsageByEmployee = async (
  employeeId: string
): Promise<MaterialUsage[]> => {
  const response = await api.get(`/usage/employee/${employeeId}`);
  return response.data;
};