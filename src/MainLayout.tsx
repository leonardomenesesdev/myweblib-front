import React, { useState, useCallback, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { getLivrosPorTitulo } from "@/services/bookService";
import type { Book } from "@/types/Book";

export interface MainLayoutContextType {
  searchQuery: string;
  searchResults: Book[] | null;
  isSearching: boolean;
}

// Função debounce auxiliar
const debounce = (func: (query: string) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (query: string) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(query), delay);
  };
};

export const MainLayout: React.FC = () => {
  // ✅ CORREÇÃO: Hook chamado DENTRO do componente
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[] | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

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

  // Hook useMemo deve estar dentro do componente também
  const debouncedSearch = useMemo(() => debounce(handleSearch, 300), [handleSearch]);

  const contextValue: MainLayoutContextType = {
    searchQuery,
    searchResults,
    isSearching: !!searchQuery,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onLoginClick={() => { navigate('/login'); }} 
        onSearch={debouncedSearch} 
      />

      <main className="flex-1 relative">
        {loadingSearch && (
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-200 animate-pulse z-10" />
        )}
        <Outlet context={contextValue} />
      </main>
    </div>
  );
};