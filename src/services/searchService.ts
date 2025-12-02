import api from './api'; 
import { getByAutorOrTitulo } from './bookService';
import type { Book } from '@/types/Book';

export interface UserDetailsDTO {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export interface SearchResults {
  livros: Book[];
  usuarios: UserDetailsDTO[];
}

export async function buscarUsuarios(nome: string): Promise<UserDetailsDTO[]> {  
  try {
    const response = await api.get(`/user/nome/${encodeURIComponent(nome)}`);
    return Array.isArray(response.data) ? response.data : [];
    
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.log("Nenhum usuário encontrado (404)");
      return [];
    }
    
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}

export async function buscarTudo(query: string): Promise<SearchResults> {
  console.log("🎯 Iniciando busca unificada para:", query);
  
  if (!query.trim()) {
    return { livros: [], usuarios: [] };
  }

  try {
    const [livros, usuarios] = await Promise.all([
      getByAutorOrTitulo(query).catch((error) => {
        console.error("Erro ao buscar livros:", error);
        return [];
      }),
      buscarUsuarios(query).catch((error) => {
        console.error("Erro ao buscar usuários:", error);
        return [];
      })
    ]);
    
    console.log("Resultado final:", { 
      livros: livros.length, 
      usuarios: usuarios.length 
    });
    
    return { livros, usuarios };
    
  } catch (error) {
    console.error("Erro geral na busca unificada:", error);
    return { livros: [], usuarios: [] };
  }
}