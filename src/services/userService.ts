import api from "./api";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/User";
// Importe a tipagem de Livro, pois essa lista retorna livros resumidos
import type { Book } from "../types/Book"; 

// 1. Defina o Enum aqui ou em um arquivo types/Enums.ts (recomendado)
export const StatusLeitura = {
  QUERO_LER: "QUERO_LER",
  LENDO: "LENDO",
  LIDO: "LIDO"
} as const; // 'as const' trava os valores como literais e não apenas strings

// 2. Extração do Tipo (TypeScript)
// Isso cria um tipo que aceita apenas: "QUERO_LER" | "LENDO" | "LIDO"
export type StatusLeitura = (typeof StatusLeitura)[keyof typeof StatusLeitura];

export async function registerUser(payload: RegisterRequest) {
  return api.post("/auth/register", payload);
}

export async function loginUser(credentials: LoginRequest) {
  return api.post<LoginResponse>("/auth/login", credentials);
}

export function setAuthToken(token: string) {
  localStorage.setItem("token", token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function setUserData(user: { id: number }) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getCurrentUserId(): number | null {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.id;
  } catch {
    return null;
  }
}

export async function getCurrentUser(id: number) {
  const token = localStorage.getItem("token");

  const response = await api.get(`/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // Boa prática: limpar dados do user também
  delete api.defaults.headers.common['Authorization'];
}

export async function getLivrosDoUsuarioPorStatus(status: StatusLeitura): Promise<Book[]> {
  const token = localStorage.getItem("token");
  const response = await api.get<Book[]>(`/status/usuario/${status}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }
})
return response.data
}

export async function getPerfilCompleto(userId: number) {
  const token = localStorage.getItem("token");

  const response = await api.get(`/user/perfil/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
} 