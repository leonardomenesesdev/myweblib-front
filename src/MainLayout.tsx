import React, { useState, useCallback, useMemo, useEffect } from "react";
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
  const navigate = useNavigate();
  
  // Estado para controlar se o usuário está logado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Estado de busca
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Book[] | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // se não tem token, redireciona para login
      navigate("/login");
    } else {
      // Se tem token, considera autenticado
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    setSearchQuery(trimmed);

    if (!trimmed) {
      setSearchResults(null);
      return;
    }

    navigate('/', {replace: true});
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

  const debouncedSearch = useMemo(() => debounce(handleSearch, 300), [handleSearch]);

  // Handler de Logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token
    setIsAuthenticated(false);
    navigate("/login"); // Manda de volta pro login
  };

  const contextValue: MainLayoutContextType = {
    searchQuery,
    searchResults,
    isSearching: !!searchQuery,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        // Estado de autenticação
        isAuthenticated={isAuthenticated}
        // userName="Usuário" // Opcional: Se você buscar os dados do usuário, pode passar aqui
        
        // Funções de navegação
        onHomeClick={() => navigate("/")}
        onProfileClick={() => navigate("/perfil")}
        onLoginClick={() => navigate("/login")}
        onLogoutClick={handleLogout}
        
        // Busca
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