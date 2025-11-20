import type { UserProfile } from "@/types/User";
import { use, useState } from "react";

interface ProfileEditFormProps{
    perfilOriginal: UserProfile,
    onSave: (perfilAtualizado: UserProfile) => void,
    onCancel: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ perfilOriginal, onSave, onCancel }) => {
const [formData, setFormData] = useState<UserProfile>(perfilOriginal); 
const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData({
        ...formData,
        [field]: value,
    });
}
return(
    <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
        Editar Perfil
      </h2>
      
      <div className="space-y-5 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
          <input
            type="text"
            value={formData.nome != null ? formData.nome : "Leo"}
            onChange={(e) => handleChange('nome', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            value={formData.email != null ? formData.email : "leo@e.com"}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => onSave(formData)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Salvar Alterações
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
)
}