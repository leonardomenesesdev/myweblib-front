// src/components/BookRow.tsx

import React from 'react';
import BookCard from './BookCard';
import type { Book } from '../types/Book';

interface BookRowProps {
  title: string;
  books: Book[];
  onCardClick?: (book: Book) => void;
}

const BookRow: React.FC<BookRowProps> = ({ title, books, onCardClick }) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300">
        {books.map((book) => (
          <BookCard
            key={book.id}
            livro={book}
            onCardClick={() => onCardClick?.(book)}
          />
        ))}
      </div>
    </div>
  );
};

export default BookRow;
