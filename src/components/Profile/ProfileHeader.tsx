import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { UserProfile } from "@/types/User";
import { ProfileStats } from './ProfileStats';

interface ProfileHeaderProps {
    profile: UserProfile;
    isUserProfile: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
    profile, 
    isUserProfile, 
    onEdit, 
    onDelete 
}) => {
    return (
        <div className="bg-white shadow-sm rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 border border-gray-100">
            
            {/* 1. Informações do Usuário (Esquerda) */}
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {profile.nome || "Usuário"}
                </h1>
                <p className="text-gray-500 mb-3 font-medium">{profile.email}</p>
                
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-500">
                    Membro desde {profile.dataCadastro || "01/01/2023"}
                </div>
            </div>

            {/* 2. Botões de Ação (Centro/Meio) - Só aparecem se for o próprio usuário */}
            {isUserProfile && (
                <div className="flex gap-3">
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-semibold shadow-sm"
                    >
                        <Edit2 size={16} />
                        Editar
                    </button>
                    
                    <button
                        onClick={onDelete}
                        className="p-2 text-gray-400 bg-white border border-transparent hover:border-red-100 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shadow-sm"
                        title="Excluir Conta"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )}

            {/* 3. Estatísticas (Direita) */}
            {/* Ajustei a margem para não colar nos botões em telas menores */}
            <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                 <ProfileStats stats={profile.estatisticas} />
            </div>
        </div>
    );
};