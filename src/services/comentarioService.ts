import api from "./api";

export interface CommentResponse {
  id: number;
  conteudo: string;
  nomeUsuario: string;
  idUsuario: number; 
  idLivro: number;
  data: string;
}

export interface CommentRequest {
  idLivro: number;
  idUsuario: number;
  conteudo: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
}


export const getCommentsByBook = async (bookId: number, page = 0, size = 10) => {
  const response = await api.get<PageResponse<CommentResponse>>(`/comentario/livro/${bookId}`, {
    params: { page, size, sort: "data,desc" }
  });
  return response.data;
};


export const createComment = async (data: CommentRequest) => {
  const response = await api.post<CommentResponse>("/comentario", data);
  return response.data;
};

/**
 * deleta um comentário
 */
export const deleteComment = async (commentId: number) => {
  await api.delete(`/comentario/${commentId}`);
};