import api from "./api";
import type { Book } from "../types/Book";
import type { UserProfile } from "../types/User"; 


export interface UserAdminDTO {
  id: number;
  nome: string;
  email: string;
  role: string; 
}

export const getAllUsers = async (): Promise<UserAdminDTO[]> => {
  const response = await api.get<UserAdminDTO[]>("/user");
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/user/${id}`);
};


export const updateUser = async (id: number, userData: Partial<UserAdminDTO>): Promise<UserAdminDTO> => {
    const response = await api.put(`/user/${id}`, userData);
    return response.data;
}

