import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Book } from '../types/Book';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function groupBooksByGenre(books: Book[]) {
  const map: Record<string, Book[]> = {};

  books.forEach((book) => {
    const genre = book.categorias?.[0] || "OUTROS";

    if (!map[genre]) map[genre] = [];
    map[genre].push(book);
  });

  return map;
}
