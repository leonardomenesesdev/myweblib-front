import api from "./api";
import type { Book } from "../types/Book";
import type { UserProfile } from "../types/User"; // Assumindo que você tem ou pode adaptar essa interface

// --- USERS ---

export interface UserAdminDTO {
  id: number;
  nome: string;
  email: string;
  role: string; // "ADMIN" | "USER"
}

export const getAllUsers = async (): Promise<UserAdminDTO[]> => {
  const response = await api.get<UserAdminDTO[]>("/user");
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/user/${id}`);
};

// Note: O update de usuário no seu controller é PUT /user/{id} com body Usuario. 
// Se quiser editar role/nome/email, precisará passar o objeto completo ou parcial.
export const updateUser = async (id: number, userData: Partial<UserAdminDTO>): Promise<UserAdminDTO> => {
    // Seu backend espera a entidade Usuario no body
    const response = await api.put(`/user/${id}`, userData);
    return response.data;
}

// --- LIVROS ---
// Reutilizaremos as funções do bookService.ts (criarLivro, atualizarLivro, deletarLivro) 
// dentro do componente para manter o padrão.