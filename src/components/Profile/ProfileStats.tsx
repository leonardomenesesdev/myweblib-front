import React from 'react';
import type { BookStatistics } from "@/types/User";

interface ProfileStatsProps {
  stats: BookStatistics;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const statItems = [
    { label: 'Quero Ler', value: stats.queroLer, color: 'text-purple-600' },
    { label: 'Lendo', value: stats.lendo, color: 'text-yellow-600' },
    { label: 'Lido', value: stats.lido, color: 'text-green-600' }, // Corrigido para bater com seu mock
    { label: 'Favoritos', value: stats.favoritos || 0, color: 'text-red-600' }, // Adicionei fallback
    { label: 'Avaliações', value: stats.resenhas || stats.avaliacoes || 0, color: 'text-blue-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100">
      {statItems.map((item) => (
        <div key={item.label} className="text-center">
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