import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { getByAutorOrTitulo } from "@/services/bookService";
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

   const [isAdmin, setIsAdmin] = useState<boolean>(false);
   useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
          try {
              // Decodifica o payload do JWT
              const base64Url = token.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              }).join(''));
  
              const payload = JSON.parse(jsonPayload);
              
              // DEBUG: Veja no console o que está chegando no token
              console.log("Payload do Token:", payload); 
  
              // Verifica se a role existe e se é ADMIN
              // O backend agora envia na chave 'role', mas verificamos 'roles' por garantia
              const userRole = payload.role || payload.roles;
  
              // Verifica se é "ADMIN" (do enum) ou "ROLE_ADMIN" (do Spring Security)
              if (userRole === "ADMIN" || userRole === "ROLE_ADMIN") {
                  setIsAdmin(true);
              } 
              // Caso venha como array (ex: ["ADMIN"])
              else if (Array.isArray(userRole) && (userRole.includes("ADMIN") || userRole.includes("ROLE_ADMIN"))) {
                  setIsAdmin(true);
              } else {
                  setIsAdmin(false);
              }
  
          } catch (error) {
              console.error("Erro ao processar token:", error);
              setIsAdmin(false);
          }
      }
    }, []);

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
      const data = await getByAutorOrTitulo(trimmed);
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
        
        isAdmin = {isAdmin}
        onAdminClick={() => navigate("/admin/painel")}
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