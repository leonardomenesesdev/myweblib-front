import api from "./api";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/User";

export async function registerUser(payload: RegisterRequest) {
  return api.post("/auth/register", payload);
}
export async function loginUser(credentials: LoginRequest) {
  // O Axios retorna um objeto que contém 'data', que contém o nosso 'token'
  return api.post<LoginResponse>("/auth/login", credentials);
}

export function setAuthToken(token: string) {
  localStorage.setItem("token", token);
  // Configura o Axios para enviar esse token em todas as futuras requisições
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

export function getCurrentUser(id: number) {
  try {
    return api.get(`/user/${id}`);

  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw error;
  }
}

export function logoutUser() {
  localStorage.removeItem("token");
  delete api.defaults.headers.common['Authorization'];
}

