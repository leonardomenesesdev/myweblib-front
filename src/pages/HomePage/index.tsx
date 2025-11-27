import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Category from "@/components/Category";
import { BookGrid } from "@/components/BookGrid";
import { UserCard } from "@/components/UserCard";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { getLivros } from "@/services/bookService";
import type { Book, EnumCategoria } from "../../types/Book";
import type { MainLayoutContextType } from "@/MainLayout";
import { BookOpen, User } from "lucide-react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const { searchResults, searchQuery, isSearching } = useOutletContext<MainLayoutContextType>();

  const [livrosVitrine, setLivrosVitrine] = useState<Book[]>([]);
  const [categorias, setCategorias] = useState<Map<EnumCategoria, Book[]>>(new Map());
  const [loading, setLoading] = useState(true);

  // Estados para controlar expansão das seções
  const [usuariosExpanded, setUsuariosExpanded] = useState(true);
  const [livrosExpanded, setLivrosExpanded] = useState(true);

  useEffect(() => {
    const carregarVitrine = async () => {
      try {
        const data = await getLivros();
        setLivrosVitrine(data);
        
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

  const handleUserClick = (usuario: any) => {
    navigate(`/perfil/${usuario.id}`);
  };

  return (
    <div className="py-10 px-6 max-w-7xl mx-auto">
      {isSearching ? (
        <div className="space-y-6 animate-fade-in">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
              Resultados para: <span className="text-blue-600">"{searchQuery}"</span>
            </h2>
            {searchResults && (
              <p className="text-gray-600 mt-2">
                {searchResults.usuarios.length + searchResults.livros.length} resultado(s) encontrado(s)
              </p>
            )}
          </div>

          {searchResults && (searchResults.livros.length > 0 || searchResults.usuarios.length > 0) ? (
            <>
              {/* Seção de Usuários (Retrátil) */}
              {searchResults.usuarios.length > 0 && (
                <CollapsibleSection
                  title="Usuários"
                  icon={<User className="w-6 h-6" />}
                  count={searchResults.usuarios.length}
                  isExpanded={usuariosExpanded}
                  onToggle={() => setUsuariosExpanded(!usuariosExpanded)}
                >
                  <div className="space-y-3">
                    {searchResults.usuarios.map((usuario) => (
                      <UserCard
                        key={usuario.id}
                        usuario={usuario}
                        onClick={handleUserClick}
                      />
                    ))}
                  </div>
                </CollapsibleSection>
              )}

              {/* Seção de Livros (Retrátil) */}
              {searchResults.livros.length > 0 && (
                <CollapsibleSection
                  title="Livros"
                  icon={<BookOpen className="w-6 h-6" />}
                  count={searchResults.livros.length}
                  isExpanded={livrosExpanded}
                  onToggle={() => setLivrosExpanded(!livrosExpanded)}
                >
                  <BookGrid livros={searchResults.livros} onBookClick={handleBookClick} />
                </CollapsibleSection>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg 
                    className="w-10 h-10 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg mb-2">
                  Nenhum resultado encontrado para <strong>"{searchQuery}"</strong>
                </p>
                <p className="text-gray-500 text-sm mb-6">
                  Tente buscar com outros termos ou verifique a ortografia
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Voltar para a vitrine
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {loading ? (
            <div className="flex flex-col justify-center items-center h-40">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium">Carregando estante...</p>
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