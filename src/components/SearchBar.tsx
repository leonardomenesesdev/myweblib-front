// SearchBar.tsx

import React, { useState } from "react";
import { Search, X } from "lucide-react";
// REMOVER imports de services e Book type

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Buscar livros...",
  className = ""
}) => {
  const [query, setQuery] = useState("");
  // REMOVER const [searchResults, setSearchResults] = useState<Book[] | null>(null);
  
  // NOVA FUNÇÃO: Dispara a busca ao digitar
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // 💡 CHAMA A FUNÇÃO DE BUSCA/DEBOUNCE NO PAI IMEDIATAMENTE
    onSearch?.(newQuery);
  };

  // Nao precisa de um formulário. Troca <form> por <div>.
  return (
    <div className={`relative w-full ${className}`}> 
      <div className="flex items-center bg-white/80 backdrop-blur-xl px-4 py-2 rounded-xl shadow-md border border-gray-200">
        <Search className="w-5 h-5 text-gray-500" />

        <input
          type="text"
          className="flex-1 bg-transparent outline-none ml-3 text-sm text-gray-900 placeholder-gray-500"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange} // Usa a nova função
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onSearch?.(""); // Notifica o pai para limpar os resultados da busca
            }}
            className="p-1 hover:bg-gray-200/60 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};