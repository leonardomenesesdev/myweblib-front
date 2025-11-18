import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Header } from "@/components/Header";
import Category from "@/components/Category";
// Importar a função de busca por título
import { getLivros, getLivrosPorTitulo } from "@/services/bookService"; 
import type { Book, EnumCategoria } from "../../types/Book";
import { useNavigate } from "react-router-dom";
import { BookGrid } from "@/components/BookGrid";

// 💡 Função de utilidade DEBOUNCE
const debounce = (func: (query: string) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (query: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(query);
    }, delay);
  };
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [livros, setLivros] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Map<EnumCategoria, Book[]>>(new Map());

  // NOVOS ESTADOS PARA A BUSCA
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[] | null>(null);

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const data = await getLivros();
        setLivros(data);
        
        // Agrupar livros por categoria
        const categoriasMap = new Map<EnumCategoria, Book[]>();
        
        data.forEach((livro) => {
          if (livro.categorias && livro.categorias.length > 0) {
            livro.categorias.forEach((categoria) => {
              if (!categoriasMap.has(categoria)) {
                categoriasMap.set(categoria, []);
              }
              categoriasMap.get(categoria)!.push(livro);
            });
          }
        });
        
        setCategorias(categoriasMap);
      } catch (error) {
        console.error("Erro ao carregar livros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLivros();
  }, []);

  const performSearch = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);

    if (trimmedQuery === "") {
      setSearchResults(null);
      return;
    }

    setLoading(true); 
    try {
      const data = await getLivrosPorTitulo(trimmedQuery);
      setSearchResults(data);
    } catch (error) {
      console.error("Erro ao buscar livros por título:", error);
      setSearchResults([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Cria a versão debounced da função, garantindo que ela só execute 300ms após a última digitação
  const debouncedSearch = useMemo(() => debounce(performSearch, 300), [performSearch]);

  const handleBookClick = (livro: Book) => {
    console.log("Livro clicado:", livro);
    // Aqui você pode adicionar navegação para página de detalhes do livro
  };
  
  // Variável de controle para renderização
  const exibirResultadosPesquisa = searchQuery && searchResults !== null;

  return (
    <>
      <div className="inset-0  min-h-screen">
        <Header 
          onLoginClick={() => navigate("/login")}
          // 3. Passa a função debounced para o Header/SearchBar
          onSearch={debouncedSearch} 
        />

        <div className="py-10 bg-white">
          {loading ? (
            <div className="px-6">
              <p className="text-gray-900 text-xl">Carregando livros...</p>
            </div>
          ) : exibirResultadosPesquisa ? (
            // EXIBIÇÃO DOS RESULTADOS DA BUSCA ATIVA
            <div className="px-6">
              <h2 className="text-2xl font-bold mb-6 text-blue-900">
                Resultados para: "{searchQuery}"
              </h2>
              {searchResults && searchResults.length > 0 ? (
                // 💡 Você deve criar um componente de listagem aqui, como um BookGrid.
                // Por enquanto, apenas exibe a contagem.
                <BookGrid
                  livros={searchResults}
                  onBookClick={handleBookClick}
                ></BookGrid>
              ) : (
                <p className="text-gray-700">Nenhum livro encontrado com o título "{searchQuery}".</p>
              )}
            </div>
          ) : categorias.size === 0 ? (
            <div className="px-6">
              <p className="text-gray-900 text-xl">Nenhum livro disponível no momento.</p>
            </div>
          ) : (
            // EXIBIÇÃO NORMAL DAS CATEGORIAS (NENHUMA BUSCA ATIVA)
            <>
              {/* Renderizar uma seção Category para cada categoria que tem livros */}
              {Array.from(categorias.entries()).map(([categoria, livrosCategoria]) => (
                <Category
                  key={categoria}
                  categoria={categoria}
                  livros={livrosCategoria}
                  onBookClick={handleBookClick}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;