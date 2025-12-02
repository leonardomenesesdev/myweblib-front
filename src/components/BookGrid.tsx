import React from 'react';
import type { Book } from '../types/Book'; 
import BookCard  from './BookCard'; 

interface BookGridProps {
  livros: Book[];
  onBookClick: (livro: Book) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ livros, onBookClick }) => {
  if (livros.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-center text-gray-500">Nenhum livro encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {livros.map((livro) => (
        <BookCard 
          key={livro.id} 
          livro={livro} 
          onCardClick={() => onBookClick?.(livro)}

        />
      ))}
    </div>
  );
};