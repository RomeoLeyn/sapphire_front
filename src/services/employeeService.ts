import api from '../config/api.config';
import { Employee, InfoAboutEmployee, PaginationResponse } from '../types';

export const getEmployees = async (page: number, filters: { position?: string; role?: string; status?: string }): Promise<PaginationResponse<Employee[]>> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());

  if (filters.position !== undefined) {
    params.append("position", filters.position);
  }
  if (filters.role) {
    params.append("role", filters.role);
  }
  if (filters.status) {
    params.append("status", filters.status);
  }
  const response = await api.get(`/employees?${params.toString()}`);
  return response.data;
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
  const response = await api.get(`/employees/${id}`);
  return response.data;
};

export const getBriefEmployees = async (): Promise<Employee[]> => {
  const response = await api.get("/employees/brief");
  return response.data;
};

export const createEmployee = async (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
  const response = await api.post('/employees', employee);
  return response.data;
};

export const updateEmployee = async (id: string, employee: Pick<Employee, 'fullName' | 'email' | 'username' | 'phoneNumber'>): Promise<Employee> => {
  const response = await api.put(`/employees/${id}`, employee);
  return response.data;
};

export const updateInfoAboutEmployee = async (userId: string, info: InfoAboutEmployee) => {
  const response = await api.patch(`/employees/${userId}`, info);
  return response.data;
}

export const deleteEmployee = async (id: string): Promise<void> => {
  await api.delete(`/employees/${id}`);
};