  // src/services/bookService.ts

  import axios from "axios";
  import type { Book } from "../types/Book";

  const API_URL = "http://localhost:8080/api/livro";


  export const getLivros = async (): Promise<Book[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  };

  /**
   * Buscar livro por ID
   */
  export const getLivroById = async (id: number): Promise<Book> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  };

  /**
   * Buscar livros por título
   */
  export const getLivrosPorTitulo = async (titulo: string): Promise<Book[]> => {
    const response = await axios.get(`${API_URL}/titulo/${titulo}`);
    return response.data;
  };

  /**
   * Buscar livros por autor
   */
  export const getLivrosPorAutor = async (autor: string): Promise<Book[]> => {
    const response = await axios.get(`${API_URL}/buscar/${autor}`);
    return response.data;
  };

  /**
   * Buscar livros por categoria
   */
  export const getLivrosPorCategoria = async (categoria: string): Promise<Book[]> => {
    const response = await axios.get(`${API_URL}/filtrar/${categoria}`);
    return response.data;
  };

  /**
   * Criar novo livro (ADMIN)
   */
  export const criarLivro = async (livro: Partial<Book>): Promise<Book> => {
    const response = await axios.post(API_URL, livro);
    return response.data;
  };

  /**
   * Atualizar livro (ADMIN)
   */
  export const atualizarLivro = async (id: number, livro: Partial<Book>): Promise<Book> => {
    const response = await axios.put(`${API_URL}/${id}`, livro);
    return response.data;
  };

  /**
   * Deletar livro (ADMIN)
   */
  export const deletarLivro = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  };