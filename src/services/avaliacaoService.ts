import api from "./api"; // Assumindo que você tem uma instância do axios configurada aqui

export interface AvaliacaoResponseDTO {
  avaliacaoId: number;
  livroId: number;
  emailUsuario: string;
  nota: number;
}

export const rateBook = async (livroId: number, nota: number, usuarioId: number): Promise<AvaliacaoResponseDTO> => {
  // Rota: POST /avaliacao/avaliar/{livroId}/{nota}/{usuarioId}
  const { data } = await api.post<AvaliacaoResponseDTO>(`/avaliacao/avaliar/${livroId}/${nota}/${usuarioId}`);
  return data;
};

export const cancelRating = async (livroId: number, usuarioId: number): Promise<void> => {
  // Rota: DELETE /avaliacao/avaliar/cancelar/{livroId}/{usuarioId}
  await api.delete(`/avaliacao/avaliar/cancelar/${livroId}/${usuarioId}`);
};
export const getUserRating = async (bookId: number): Promise<number> => {
  try {
    const response = await api.get(`/avaliacao/me/${bookId}`);
    return typeof response.data === 'object' ? response.data.nota : response.data;
  } catch (error) {
    return 0; 
  }
};