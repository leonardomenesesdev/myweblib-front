import React from 'react';
import type { BookStatistics } from "@/types/User";

interface ProfileStatsProps {
  // Tornamos opcional (?) para que não quebre se o pai passar null/undefined
  stats?: BookStatistics | null; 
}

// Dados fictícios para visualização (Mock)
const MOCK_STATS = {
  queroLer: 15,
  lendo: 3,
  lido: 42,
  favoritos: 12,
  resenhas: 7,
  // Campos extras para garantir compatibilidade com o tipo, se necessário
  querem: 15,
  relendo: 1,
  abandonos: 0,
  avaliacoes: 7
};

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  
  // Lógica de Fallback: Se 'stats' não existir (null/undefined), usa o MOCK_STATS
  // Se quiser forçar o mock mesmo vindo dados, mude para: const displayStats = MOCK_STATS;
  const displayStats = stats || MOCK_STATS;

  const statItems = [
    { label: 'Quero Ler', value: displayStats.queroLer, color: 'text-purple-600' },
    { label: 'Lendo', value: displayStats.lendo, color: 'text-yellow-600' },
    { label: 'Lido', value: displayStats.lido, color: 'text-green-600' },
    { label: 'Favoritos', value: displayStats.favoritos || 0, color: 'text-red-600' },
    // Verifica se tem resenhas ou avaliacoes
    { label: 'Avaliações', value: displayStats.resenhas || (displayStats as any).avaliacoes || 0, color: 'text-blue-600' },
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