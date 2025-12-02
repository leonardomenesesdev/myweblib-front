import React from 'react';
import { Star, BookOpen, Heart } from 'lucide-react';
import type { Book } from '../types/Book';

interface BookCardProps {
  livro: Book;
  rating?: number;
  totalRatings?: number;
  progress?: number;
  onCardClick?: () => void;
  onLikeClick?: () => void;
  isLiked?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  livro,
  rating = 0,
  totalRatings = 0,
  progress,
  onCardClick,
  onLikeClick,
  isLiked = false,
}) => {
  // badge da categoria, pega a primeira
  const primeiraCategoria = livro.categorias && livro.categorias.length > 0 
    ? livro.categorias[0] 
    : null;

  const categoriasEmPortugues: Record<string, string> = {
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

  const generoExibicao = primeiraCategoria 
    ? categoriasEmPortugues[primeiraCategoria] || primeiraCategoria 
    : null;

  return (
    <div 
      className="w-48 h-[400px] flex flex-col bg-gray-200 rounded-lg shadow-xs hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden"
      onClick={onCardClick}
    >
      {/* Capa do Livro */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        <img 
          src={livro.capa || '/placeholder-book.png'} 
          alt={livro.titulo}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-book.png';
          }}
        />
        
        {/* Badge de Gênero */}
        {generoExibicao && (
          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
            {generoExibicao}
          </div>
        )}
        
        {/* Botão de Favoritar */}
        {onLikeClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLikeClick();
            }}
            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              size={18} 
              className={isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>
        )}

        {/* Barra de Progresso */}
        {progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-800/80 px-2 py-1">
            <div className="flex items-center gap-1 text-white text-xs mb-1">
              <BookOpen size={12} />
              <span>{progress}% lido</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* infos do livro */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-1 leading-tight">
            {livro.titulo}
          </h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-1">
            {livro.autor}
          </p>
        </div>

        {/* avaliacao*/}
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              ({totalRatings})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
