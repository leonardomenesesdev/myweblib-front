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
    // Endpoint sugerido: GET /avaliacao/livro/{id}/usuario
    // O backend deve retornar um objeto com a nota, ou a própria nota (int)
    const response = await api.get(`/avaliacao/me/${bookId}`);
    
    // Se retornar objeto (ex: { nota: 5 }), use response.data.nota
    // Se retornar direto o número, use response.data
    return typeof response.data === 'object' ? response.data.nota : response.data;
  } catch (error) {
    return 0; // Se der 404 (não avaliou ainda), retorna 0
  }
};