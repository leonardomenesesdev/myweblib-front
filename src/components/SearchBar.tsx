import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce"; 

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  delay?: number; 
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Buscar livros ou usuários...",
  className = "",
  delay = 500 
}) => {
  const [query, setQuery] = useState("");
  
  const debouncedQuery = useDebounce(query, delay);
  useEffect(() => {
    onSearch?.(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex items-center bg-white/80 backdrop-blur-xl px-4 py-2 rounded-xl shadow-md border border-gray-200 transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
        <Search className="w-5 h-5 text-gray-400" />

        <input
          type="text"
          className="flex-1 bg-transparent outline-none ml-3 text-sm text-gray-900 placeholder-gray-400"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          aria-label="Campo de busca"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Limpar busca"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};