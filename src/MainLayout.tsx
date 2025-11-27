import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { buscarTudo, type SearchResults } from "@/services/searchService";

export interface MainLayoutContextType {
  searchQuery: string;
  searchResults: SearchResults | null;
  isSearching: boolean;
}

const debounce = (func: (query: string) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (query: string) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(query), delay);
  };
};

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        const userRole = payload.role || payload.roles;

        if (userRole === "ADMIN" || userRole === "ROLE_ADMIN") {
          setIsAdmin(true);
        } else if (Array.isArray(userRole) && (userRole.includes("ADMIN") || userRole.includes("ROLE_ADMIN"))) {
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
      const data = await buscarTudo(trimmed);
      setSearchResults(data);
    } catch (error) {
      console.error("Erro na busca global:", error);
      setSearchResults({ livros: [], usuarios: [] });
    } finally {
      setLoadingSearch(false);
    }
  }, [navigate]);

  const debouncedSearch = useMemo(() => debounce(handleSearch, 300), [handleSearch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const contextValue: MainLayoutContextType = {
    searchQuery,
    searchResults,
    isSearching: !!searchQuery,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onAdminClick={() => navigate("/admin/painel")}
        onHomeClick={() => navigate("/")}
        onProfileClick={() => navigate("/perfil")}
        onLoginClick={() => navigate("/login")}
        onLogoutClick={handleLogout}
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