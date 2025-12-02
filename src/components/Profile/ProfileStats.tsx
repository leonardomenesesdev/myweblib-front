import React from 'react';
import type { BookStatistics } from "@/types/User";

interface ProfileStatsProps {
  stats?: BookStatistics | null; 
}

const EMPTY_STATS: BookStatistics = {
  queroLer: 0,
  lendo: 0,
  lido: 0,
  favoritos: 0,
  avaliacoes: 0,
};

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  
  // Se 'stats' vier do backend, usa ele. Se não (carregando/erro), usa zeros.
  const displayStats = stats || EMPTY_STATS;

  const statItems = [
    { 
      label: 'Quero Ler', 
      value: displayStats.queroLer, 
      color: 'text-purple-600' 
    },
    { 
      label: 'Lendo', 
      value: displayStats.lendo, 
      color: 'text-yellow-600' 
    },
    { 
      label: 'Lido', 
      value: displayStats.lido, 
      color: 'text-green-600' 
    },
    { 
      label: 'Favoritos', 
      value: displayStats.favoritos, 
      color: 'text-red-600' 
    },
    { 
      label: 'Avaliações', 
      // Garante que exibe o campo correto (ajuste conforme seu DTO: avaliacoes ou resenhas)
      value: displayStats.avaliacoes || 0, 
      color: 'text-blue-600' 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100">
      {statItems.map((item) => (
        <div key={item.label} className="text-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <p className={`text-2xl font-bold ${item.color}`}>
            {item.value}
          </p>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mt-1">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};