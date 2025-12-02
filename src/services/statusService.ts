import api from "./api";

// tipagem igual a do back
export type ReadingStatusEnum = 'QUERO_LER' | 'LENDO' | 'LIDO';

interface UpdateStatusPayload {
  idLivro: number;
  status: ReadingStatusEnum;
}


export const updateReadingStatus = async (idLivro: number, status: ReadingStatusEnum) => {
  const response = await api.put('/status', { idLivro, status });
  return response.data;
};

export const getReadingStatus = async (idLivro: number): Promise<ReadingStatusEnum | null> => {
  try {
    const response = await api.get<ReadingStatusEnum>(`/status/livro/${idLivro}`);
    return response.data;
  } catch (error) {
    return null; 
  }
};

export const toggleFavorite = async (bookId: number): Promise<void> => {
  await api.post(`/livro/favoritos/toggle/${bookId}`);
};

export const checkIsFavorite = async (bookId: number): Promise<boolean> => {
  const response = await api.get<boolean>(`/livro/favoritos/status/${bookId}`);
  return response.data;
};