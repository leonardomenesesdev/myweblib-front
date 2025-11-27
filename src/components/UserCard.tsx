import React from "react";
import { User } from "lucide-react";
import type { UserDetailsDTO } from "@/services/searchService";

export interface UserCardProps {
  usuario: UserDetailsDTO;
  onClick?: (usuario: UserDetailsDTO) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ usuario, onClick }) => {
  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div
      onClick={() => onClick?.(usuario)}
      className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-blue-300"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        {getInitials(usuario.nome)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{usuario.nome}</h3>
        <p className="text-sm text-gray-500 truncate">{usuario.email}</p>
      </div>
      <div className="flex-shrink-0">
        <User className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
};