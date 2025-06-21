import api from "../config/api.config";
import { DashboardInfo } from "../types";

export const getDashboardInfroForAmdin = async (): Promise<DashboardInfo> => {
    const response = await api.get('/dashboard/admin');
    return response.data;
}

export const getDashboardInfroForEmpoloyee = async (id: number) => {
    const response = await api.get(`/dashboard/employee/${id}`);
    return response.data;
}