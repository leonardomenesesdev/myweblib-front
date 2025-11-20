import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Category from "@/components/Category";
import { BookGrid } from "@/components/BookGrid";
import { getLivros } from "@/services/bookService";
import type { Book, EnumCategoria } from "../../types/Book";
import type { MainLayoutContextType } from "@/MainLayout";
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. Recupera os dados de busca do Layout (PAI)
  const { searchResults, searchQuery, isSearching } = useOutletContext<MainLayoutContextType>();

  // 2. Estado local apenas para a vitrine padrão
  const [livrosVitrine, setLivrosVitrine] = useState<Book[]>([]);
  const [categorias, setCategorias] = useState<Map<EnumCategoria, Book[]>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarVitrine = async () => {
      try {
        const data = await getLivros();
        setLivrosVitrine(data);
        
        // Lógica de agrupamento
        const map = new Map<EnumCategoria, Book[]>();
        data.forEach((livro) => {
          livro.categorias?.forEach((cat) => {
            if (!map.has(cat)) map.set(cat, []);
            map.get(cat)!.push(livro);
          });
        });
        setCategorias(map);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    carregarVitrine();
  }, []);

  const handleBookClick = (livro: Book) => {
    navigate(`/livro/${livro.id}`);
  };

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto">
      {/* CONDICIONAL: Se estiver buscando, mostra resultados. Se não, mostra vitrine. */}
      
      {isSearching ? (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">
            Resultados para: "{searchQuery}"
          </h2>
          {searchResults && searchResults.length > 0 ? (
            <BookGrid livros={searchResults} onBookClick={handleBookClick} />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">Poxa, não encontramos nada para "{searchQuery}".</p>
              <button 
                onClick={() => window.location.reload()} // Exemplo simples de reset, ou instruir usuário a limpar busca
                className="mt-4 text-blue-600 hover:underline"
              >
                Voltar para a vitrine
              </button>
            </div>
          )}
        </div>
      ) : (
        // VITRINE PADRÃO
        <>
          {loading ? (
             <div className="flex justify-center items-center h-40">
               <p className="text-gray-500">Carregando estante...</p>
             </div>
          ) : (
            Array.from(categorias.entries()).map(([cat, livrosCat]) => (
              <Category
                key={cat}
                categoria={cat}
                livros={livrosCat}
                onBookClick={handleBookClick}
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;