import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header"; // Ajuste o caminho se necessário
import { getLivrosPorTitulo } from "@/services/bookService";
import type { Book } from "@/types/Book";

// Interface do contexto que será consumido pela Home e outras páginas
export interface MainLayoutContextType {
  searchQuery: string;
  searchResults: Book[] | null;
  isSearching: boolean;
}

export const MainLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[] | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Essa função é chamada pelo Header -> SearchBar (que já tem debounce interno)
  const handleSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    setSearchQuery(trimmed);

    if (!trimmed) {
      setSearchResults(null);
      return;
    }

    setLoadingSearch(true);
    try {
      const data = await getLivrosPorTitulo(trimmed);
      setSearchResults(data);
    } catch (error) {
      console.error("Erro na busca global:", error);
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  // Dados que passaremos para os filhos (<Outlet />)
  const contextValue: MainLayoutContextType = {
    searchQuery,
    searchResults,
    isSearching: !!searchQuery,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Fixo no Topo */}
      <Header 
        onLoginClick={() => { /* Lógica de logout ou perfil */ }} 
        onSearch={handleSearch} 
      />

      {/* Área de conteúdo variável */}
      <main className="flex-1 relative">
        {loadingSearch && (
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-200 animate-pulse z-10" />
        )}
        {/* O Outlet recebe o contexto e passa para a página atual (Home, Detalhes, etc) */}
        <Outlet context={contextValue} />
      </main>
    </div>
  );
};