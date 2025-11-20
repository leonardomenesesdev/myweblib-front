import api from "./api";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/User";

export async function registerUser(payload: RegisterRequest) {
  return api.post("/auth/register", payload);
}
export async function loginUser(credentials: LoginRequest) {
  // O Axios retorna um objeto que contém 'data', que contém o nosso 'token'
  return api.post<LoginResponse>("/auth/login", credentials);
}

// Utilitário para salvar o token (Clean Code)
export function setAuthToken(token: string) {
  localStorage.setItem("token", token);
  // Configura o Axios para enviar esse token em todas as futuras requisições
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function logoutUser() {
  localStorage.removeItem("token");
  delete api.defaults.headers.common['Authorization'];
}