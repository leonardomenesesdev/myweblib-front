import { Edit2, Trash2 } from 'lucide-react';
import type { UserProfile } from "@/types/User"
import { ProfileStats } from './ProfileStats';
interface ProfileHeaderProps{
    profile: UserProfile,
    isUserProfile: boolean
    onEdit: () => void,
    onDelete: () => void
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = (
    {profile, isUserProfile, onEdit, onDelete}) => {
    return(
        <div className="bg-white shadow-sm rounded-lg p-6 flex items-center justify-between">
            {/* infos gerais */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {profile.nome != null ? profile.nome : "Leo"}
              </h1>
              <p className="text-gray-500 mb-2 font-medium">{profile.email}</p>
              <p className="text-xs text-gray-400 bg-gray-50 inline-block px-2 py-1 rounded border border-gray-100">
                Membro desde {profile.dataCadastro != null ? profile.dataCadastro : "01/01/2023"}
              </p>
            </div>
            {isUserProfile && (
                 <div className="flex gap-2">
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
                <button
                  onClick={onDelete}
                  className="flex items-center gap-2 px-4 py-2 border border-red-100 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all text-sm font-medium"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            <ProfileStats stats={profile.estatisticas}/>
        </div>
    )
}