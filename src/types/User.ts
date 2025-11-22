export interface RegisterRequest {
  nome: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  nome: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string; 
}

export interface LoginResponse {
  token: string;
  id: number
}

export interface BookStatistics {
  queroLer: number;
  lendo: number;
  lido: number;
  favoritos: number;  // Backend manda 0 por enquanto, mas manda
  avaliacoes: number; // Backend manda 0 por enquanto, mas manda
}

export interface UserProfile {
  id: number;
  nome: string;
  email: string;
  avatar?: string;
  bio?: string;
  dataCadastro: string; 
  estatisticas: BookStatistics; // ✅ O objeto mágico
}

// Adicionei aqui para facilitar
export type TabType = 'quero-ler' | 'lendo' | 'lido' | 'favoritos';