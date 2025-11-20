import api from "./api"; // 👈 Mantemos o import da nossa instância configurada
import type { Book } from "../types/Book";

// Interface para resposta paginada do Spring Boot
interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
}

export const getLivros = async (): Promise<Book[]> => {
  const response = await api.get<PageResponse<Book>>("/api/livro", {
    params: {
      page: 0,
      size: 60
    }
  });

  // O backend retorna um objeto Page, mas o componente espera o array de livros
  return response.data.content;
};

/**
 * Buscar livro por ID
 */
export const getLivroById = async (id: number): Promise<Book> => {
  const response = await api.get(`/api/livro/${id}`);
  return response.data;
};

/**
 * Buscar livros por título
 */
export const getLivrosPorTitulo = async (titulo: string): Promise<Book[]> => {
  const response = await api.get(`/api/livro/titulo/${titulo}`);
  return response.data;
};

/**
 * Buscar livros por autor
 */
export const getLivrosPorAutor = async (autor: string): Promise<Book[]> => {
  const response = await api.get(`/api/livro/buscar/${autor}`);
  return response.data;
};

export const getByAutorOrTitulo = async (query: string): Promise<Book[]> => {
  const response = await api.get(`/api/livro/pesquisar/${query}`, {
    params: { q: query }
  });
  return response.data;
}

/**
 * Buscar livros por categoria
 */
export const getLivrosPorCategoria = async (categoria: string): Promise<Book[]> => {
  const response = await api.get(`/api/livro/filtrar/${categoria}`);
  return response.data;
};

/**
 * Criar novo livro (ADMIN)
 */
export const criarLivro = async (livro: Partial<Book>): Promise<Book> => {
  const response = await api.post("/api/livro", livro);
  return response.data;
};

/**
 * Atualizar livro (ADMIN)
 */
export const atualizarLivro = async (id: number, livro: Partial<Book>): Promise<Book> => {
  const response = await api.put(`/api/livro/${id}`, livro);
  return response.data;
};

/**
 * Deletar livro (ADMIN)
 */
export const deletarLivro = async (id: number): Promise<void> => {
  await api.delete(`/api/livro/${id}`);
};