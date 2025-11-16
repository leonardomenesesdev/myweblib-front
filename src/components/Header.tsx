import React, { useState } from 'react';
import { Home, User, LogIn, LogOut, Sun, Moon, Menu, X, BookOpen } from 'lucide-react';

export interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onHomeClick?: () => void;
  onProfileClick?: () => void;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  userName,
  onLoginClick,
  onLogoutClick,
  onHomeClick,
  onProfileClick,
  isDarkMode = false,
  onThemeToggle
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="relative w-full">
      {/* Glass container */}
      <div className="backdrop-blur-2xl bg-blue-600/20 border-b border-blue-400/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo / Brand */}
            <BookOpen className="w-8 h-8 text-white" />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <button
                onClick={onHomeClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white hover:bg-blue-500/20 backdrop-blur-xl transition-all duration-200 border border-transparent hover:border-blue-300/30"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={onProfileClick}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white hover:bg-blue-500/20 backdrop-blur-xl transition-all duration-200 border border-transparent hover:border-blue-300/30"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">
                    {userName ? `Olá, ${userName}` : 'Perfil'}
                  </span>
                </button>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={onThemeToggle}
                className="p-2.5 rounded-xl bg-blue-500/20 backdrop-blur-xl border border-blue-300/30 text-white hover:bg-blue-500/30 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Login/Logout Button */}
              {isAuthenticated ? (
                <button
                  onClick={onLogoutClick}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-blue-500/30 backdrop-blur-xl border border-blue-300/40 rounded-xl text-white hover:bg-blue-500/40 transition-all duration-200 font-semibold"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              ) : (
                <button
                  onClick={onLoginClick}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Entrar</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-xl bg-blue-500/20 backdrop-blur-xl border border-blue-300/30 text-white hover:bg-blue-500/30 transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-400/30">
            <div className="px-4 pt-2 pb-3 space-y-2 backdrop-blur-2xl bg-blue-600/10">
              <button
                onClick={() => {
                  onHomeClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-white hover:bg-blue-500/20 backdrop-blur-xl transition-all duration-200 border border-transparent hover:border-blue-300/30"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    onProfileClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-white hover:bg-blue-500/20 backdrop-blur-xl transition-all duration-200 border border-transparent hover:border-blue-300/30"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">
                    {userName ? `Olá, ${userName}` : 'Perfil'}
                  </span>
                </button>
              )}

              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-white/80 font-medium">Tema</span>
                <button
                  onClick={onThemeToggle}
                  className="p-2 rounded-xl bg-blue-500/20 backdrop-blur-xl border border-blue-300/30 text-white hover:bg-blue-500/30 transition-all duration-200"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    onLogoutClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 bg-blue-500/30 backdrop-blur-xl border border-blue-300/40 rounded-xl text-white hover:bg-blue-500/40 transition-all duration-200 font-semibold"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onLoginClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-white/90 transition-all duration-200 shadow-lg"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Entrar</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};