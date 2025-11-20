import React from 'react';
import { BookOpen, Heart, Star } from 'lucide-react';
import { type Book } from "@/types/Book"; // Use seu tipo Book global se possível

interface ProfileBookListProps {
  books: Book[];
  isFavoriteTab?: boolean;
  onClick?: (book: Book) => void;
}

export const ProfileBookList: React.FC<ProfileBookListProps> = ({ books, isFavoriteTab, onClick }) => {
  
  if (books.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg font-medium">
          Nenhum livro nesta categoria ainda
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Comece adicionando livros à sua estante!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {books.map((book) => (
        <div key={book.id} className="group cursor-pointer"  onClick={() => onClick?.(book)}>
          <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <img
              src={book.capa}
              alt={book.titulo}
              loading="lazy"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Badges flutuantes */}
            <div className="absolute top-0 right-0 p-2 w-full flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
               {isFavoriteTab && (
                <div className="bg-red-500 text-white p-1.5 rounded-full shadow-sm">
                  <Heart size={14} className="fill-white" />
                </div>
               )}
               
               {/* Placeholder se não for favorito para manter layout ou apenas rating */}
               <div className="ml-auto"></div>

               {/* Rating Badge (Exemplo) */}
               <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm flex items-center gap-1 text-xs font-bold">
                  <Star size={10} className="text-yellow-500 fill-yellow-500" />
                  4.5
               </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
              {book.titulo}
            </h3>
            <p className="text-xs text-gray-500 mt-1 truncate">{book.autor}</p>
          </div>
        </div>
      ))}
    </div>
  );
};