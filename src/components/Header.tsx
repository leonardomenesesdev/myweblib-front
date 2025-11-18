import React, { useState } from "react";
import { Home, User, LogIn, LogOut, Menu, X, BookOpen } from "lucide-react";
import { SearchBar } from "./SearchBar";

export interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  userName,
  onLoginClick,
  onLogoutClick,
  onHomeClick,
  onProfileClick,
  onSearch
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
  <div className="inset-0 bg-linear-to-br from-blue-700 via-blue-800 to-slate-700">
    
      <header className="w-full backdrop-blur-xl bg-blue-600/40 border-b border-blue-300/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
    
            {/* LOGO */}
            <button onClick={onHomeClick} className="flex items-center gap-2 text-white">
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
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-blue-700/30 rounded-xl transition"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              {isAuthenticated && (
                <button
                  onClick={onProfileClick}
                  className="flex items-center gap-2 px-4 py-2 text-white hover:bg-blue-700/30 rounded-xl transition"
                >
                  <User className="w-5 h-5" />
                  <span>{userName ? `Olá, ${userName}` : "Perfil"}</span>
                </button>
              )}
              {isAuthenticated ? (
                <button
                  onClick={onLogoutClick}
                  className="px-4 py-2 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-100 transition shadow"
                >
                  Sair
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-100 transition shadow"
                >
                  Entrar
                </button>
              )}
            </div>
            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-blue-700/30 text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {/* MOBILE MENU */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-2 pb-4 space-y-3 bg-blue-800/30 rounded-xl p-4 backdrop-blur-xl">
    
              {/* SEARCH MOBILE */}
              <SearchBar onSearch={onSearch} className="w-full" />
              <button
                onClick={() => {
                  onHomeClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-700/30 rounded-xl transition"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    onProfileClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-blue-700/30 rounded-xl transition"
                >
                  <User className="w-5 h-5" />
                  <span>{userName ? `Olá, ${userName}` : "Perfil"}</span>
                </button>
              )}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    onLogoutClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-white text-blue-700 rounded-xl font-semibold shadow"
                >
                  Sair
                </button>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-white text-blue-700 rounded-xl font-semibold shadow"
                >
                  Entrar
                </button>
              )}
            </div>
          )}
        </div>
      </header>
  </div>
  );
};
