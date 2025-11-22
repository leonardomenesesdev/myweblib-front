import api from "./api";

// Tipagem igual ao Enum do Java
export type ReadingStatusEnum = 'QUERO_LER' | 'LENDO' | 'LIDO';

interface UpdateStatusPayload {
  idLivro: number;
  status: ReadingStatusEnum;
}

/**
 * Atualiza o status de leitura do livro para o usuário logado (PUT /status)
 */
export const updateReadingStatus = async (idLivro: number, status: ReadingStatusEnum) => {
  const response = await api.put('/status', { idLivro, status });
  return response.data;
};

/**
 * Obtém o status atual de um livro específico (GET /status/livro/{id})
 */
export const getReadingStatus = async (idLivro: number): Promise<ReadingStatusEnum | null> => {
  try {
    const response = await api.get<ReadingStatusEnum>(`/status/livro/${idLivro}`);
    return response.data;
  } catch (error) {
    // Se der 404 ou outro erro, assumimos que não tem status
    return null; 
  }
};