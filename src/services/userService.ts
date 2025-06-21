import api from "../config/api.config"

export const getUserById = async (id: number) => {
    const response = await api.get(`employees/${id}`);
    return response.data;
}