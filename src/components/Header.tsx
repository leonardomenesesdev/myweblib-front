import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Import necessário para saber a rota atual
import { Home, User, LogIn, LogOut, Menu, X, BookOpen, ShieldCheck } from "lucide-react";
import { SearchBar } from "./SearchBar";

export interface HeaderProps {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  userName?: string;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  onAdminClick?: () => void;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  isAdmin = false,
  userName,
  onLoginClick,
  onLogoutClick,
  onHomeClick,
  onProfileClick,
  onAdminClick,
  onSearch
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); //hook pra pegar a posição atual da rota

  // Função auxiliar para definir o estilo do botão baseado na rota
  const getNavItemClass = (path: string) => {
    // Lógica para verificar se está ativo
    // Para a home ('/'), a comparação deve ser exata
    // Para outros caminhos (ex: '/admin'), verificamos se começa com o path
    const isActive = path === "/" 
      ? location.pathname === "/" 
      : location.pathname.startsWith(path);

    const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer font-medium";
    
    // Estilo Ativo: Fundo branco (levemente translúcido ou sólido), texto azul escuro, sombra
    const activeClasses = "bg-white text-blue-700 shadow-md transform scale-105";
    
    // Estilo Inativo: Texto branco, hover com fundo azul translúcido
    const inactiveClasses = "text-white hover:bg-blue-700/30 hover:text-white/90";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // Versão Mobile da classe (levemente ajustada para largura total)
  const getMobileNavItemClass = (path: string) => {
    const isActive = path === "/" 
      ? location.pathname === "/" 
      : location.pathname.startsWith(path);

    const baseClasses = "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer";
    const activeClasses = "bg-white text-blue-700 font-bold shadow-sm";
    const inactiveClasses = "text-white hover:bg-blue-700/50";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="inset-0 bg-linear-to-br from-blue-700 via-blue-800 to-slate-700">
      <header className="w-full backdrop-blur-xl bg-blue-600/40 border-b border-blue-300/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LOGO */}
            <button onClick={onHomeClick} className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity cursor-pointer">
              <BookOpen className="w-8 h-8" />
              <span className="font-bold text-lg hidden sm:block">WebLib</span>
            </button>

            {/* SEARCH BAR DESKTOP */}
            <div className="hidden md:block flex-1 max-w-md mx-6">
              <SearchBar onSearch={onSearch} />
            </div>

            {/* DESKTOP BUTTONS */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={onHomeClick}
                className={getNavItemClass("/")}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>

              {/* BOTÃO ADMIN */}
              {isAuthenticated && isAdmin && (
                <button
                  onClick={onAdminClick}
                  className={getNavItemClass("/admin")}
                  title="Painel Administrativo"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Admin</span>
                </button>
              )}

              {isAuthenticated && (
                <button
                  onClick={onProfileClick}
                  className={getNavItemClass("/perfil")}
                >
                  <User className="w-5 h-5" />
                  <span className="max-w-[150px] truncate">{userName ? `Olá, ${userName}` : "Perfil"}</span>
                </button>
              )}

              {isAuthenticated ? (
                <button
                  onClick={onLogoutClick}
                  className="px-4 py-2 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-100 transition shadow cursor-pointer ml-2"
                >
                  <LogOut className="w-5 h-5 sm:hidden" />
                  <span className="hidden sm:block">Sair</span>
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-100 transition shadow cursor-pointer ml-2"
                >
                  <LogIn className="w-5 h-5 sm:hidden" />
                  <span>Entrar</span>
                </button>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-blue-700/30 text-white hover:bg-blue-700/50 transition cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* MOBILE MENU */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-2 pb-4 space-y-3 bg-blue-800/90 rounded-xl p-4 backdrop-blur-xl border border-blue-400/20 animate-in fade-in slide-in-from-top-2">
              {/* SEARCH MOBILE */}
              <div className="mb-4">
                <SearchBar onSearch={onSearch} className="w-full" />
              </div>

              <button
                onClick={() => {
                  onHomeClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className={getMobileNavItemClass("/")}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>

              {/* BOTÃO ADMIN MOBILE */}
              {isAuthenticated && isAdmin && (
                <button
                  onClick={() => {
                    onAdminClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className={getMobileNavItemClass("/admin")}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Painel Admin</span>
                </button>
              )}

              {isAuthenticated && (
                <button
                  onClick={() => {
                    onProfileClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className={getMobileNavItemClass("/perfil")}
                >
                  <User className="w-5 h-5" />
                  <span>{userName ? `Perfil de ${userName}` : "Perfil"}</span>
                </button>
              )}

              <div className="pt-2 border-t border-white/10 mt-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      onLogoutClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 text-white hover:bg-red-500/40 rounded-xl font-semibold transition cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                    Sair
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onLoginClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-blue-700 rounded-xl font-semibold shadow hover:bg-gray-100 transition cursor-pointer"
                  >
                    <LogIn className="w-5 h-5" />
                    Entrar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};