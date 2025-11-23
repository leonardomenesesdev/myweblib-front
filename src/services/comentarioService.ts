import api from "./api";

// Tipagem da Resposta do Backend (ComentarioResponseDTO)
export interface CommentResponse {
  id: number;
  conteudo: string;
  nomeUsuario: string;
  idUsuario: number; 
  idLivro: number;
  data: string;
}

// Tipagem da Requisição (ComentarioRequestDTO)
export interface CommentRequest {
  idLivro: number;
  idUsuario: number;
  conteudo: string;
}

// Interface de Paginação do Spring
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
}

/**
 * Lista comentários de um livro (Paginação opcional)
 * GET /comentario/livro/{idLivro}?page=0&size=10
 */
export const getCommentsByBook = async (bookId: number, page = 0, size = 10) => {
  const response = await api.get<PageResponse<CommentResponse>>(`/comentario/livro/${bookId}`, {
    params: { page, size, sort: "data,desc" }
  });
  return response.data;
};

/**
 * Cria um novo comentário
 * POST /comentario
 */
export const createComment = async (data: CommentRequest) => {
  const response = await api.post<CommentResponse>("/comentario", data);
  return response.data;
};

/**
 * Deleta um comentário
 * DELETE /comentario/{id}
 */
export const deleteComment = async (commentId: number) => {
  await api.delete(`/comentario/${commentId}`);
};