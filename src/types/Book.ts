// src/types/Book.ts

export interface Book {
  id: number;
  titulo: string;
  autor: string;
  capa: string;
  ano: number;
  sinopse: string;
  categorias: EnumCategoria[];
}

export type EnumCategoria =
  | "FICCAO"
  | "FANTASIA"
  | "ROMANCE"
  | "TERROR"
  | "SUSPENSE"
  | "MISTERIO"
  | "FICCAO_CIENTIFICA"
  | "DISTOPIA"
  | "BIOGRAFIA"
  | "AUTOAJUDA"
  | "HISTORIA"
  | "FILOSOFIA"
  | "RELIGIAO"
  | "EDUCACAO"
  | "POESIA"
  | "DRAMA"
  | "HUMOR"
  | "NEGOCIOS"
  | "TECNOLOGIA"
  | "PROGRAMACAO"
  | "INFANTIL"
  | "JUVENIL"
  | "ARTE"
  | "CIENCIAS"
  | "SAUDE"
  | "ESPORTES";

// Mapeamento de categorias para exibição em português
// Mapeamento de categorias para exibição em português
export const CATEGORIA_LABELS: Record<EnumCategoria, string> = {
  FICCAO: "Ficção",
  FANTASIA: "Fantasia",
  ROMANCE: "Romance",
  TERROR: "Terror",
  SUSPENSE: "Suspense",
  MISTERIO: "Mistério",
  FICCAO_CIENTIFICA: "Ficção Científica",
  DISTOPIA: "Distopia",
  BIOGRAFIA: "Biografia",
  AUTOAJUDA: "Autoajuda",
  HISTORIA: "História",
  FILOSOFIA: "Filosofia",
  RELIGIAO: "Religião",
  EDUCACAO: "Educação",
  POESIA: "Poesia",
  DRAMA: "Drama",
  HUMOR: "Humor",
  NEGOCIOS: "Negócios",
  TECNOLOGIA: "Tecnologia",
  PROGRAMACAO: "Programação",
  INFANTIL: "Infantil",
  JUVENIL: "Juvenil",
  ARTE: "Arte",
  CIENCIAS: "Ciências",
  SAUDE: "Saúde",
  ESPORTES: "Esportes"
};