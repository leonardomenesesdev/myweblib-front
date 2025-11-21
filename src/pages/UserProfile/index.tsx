import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ProfileEditForm } from "@/components/Profile/ProfileEditForm";
import { ProfileBookList } from "@/components/Profile/ProfileBookList";
import type { MainLayoutContextType } from '@/MainLayout';
import type { UserProfile, TabType } from "@/types/User";
import type { Book } from "@/types/Book";
// ✅ Importando apenas o que existe no service
import { getCurrentUser, getCurrentUserId } from "@/services/userService";

// --- MOCK DE LIVROS (Mantido temporariamente) ---
export const mockBooks: Book[] = [
  {
    id: 1,
    titulo: "O Senhor dos Anéis: A Sociedade do Anel",
    autor: "J. R. R. Tolkien",
    capa: "https://m.media-amazon.com/images/I/81t2CVWEsUL.jpg",
    ano: 1954,
    sinopse: "Uma jornada épica.",
    categorias: ["FANTASIA", "FICCAO"],
    categoriasLabels: ["Fantasia", "Ficção"],
  },
  {
    id: 2,
    titulo: "1984",
    autor: "George Orwell",
    capa: "https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg",
    ano: 1949,
    sinopse: "O Grande Irmão está de olho em você.",
    categorias: ["DISTOPIA", "FICCAO_CIENTIFICA"],
    categoriasLabels: ["Distopia", "Ficção Científica"],
  }
];

const booksByStatus: Record<string, Book[]> = {
  lendo: mockBooks.slice(0, 1),
  "quero-ler": mockBooks.slice(1, 2),
  lido: [],
  favoritos: mockBooks
};

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<MainLayoutContextType>();
  
  // Estado inicial null pois vamos carregar do backend
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('lendo');

  // 🚀 Efeito: Carrega dados REAIS do usuário ao entrar na tela
  useEffect(() => {
    const loadProfile = async () => {
      const userId = getCurrentUserId(); // Pega do localStorage
      
      if (!userId) {
        console.warn("Nenhum ID de usuário encontrado. Redirecionando...");
        navigate('/login'); // Se não tiver ID, chuta pro login
        return;
      }

      try {
        setLoading(true);
        const dadosReais = await getCurrentUser(userId);
        setUserProfile(dadosReais.data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleBookClick = (livro: Book) => {
    navigate(`/livro/${livro.id}`);
  };

  const handleSave = (updatedData: UserProfile) => {
    // TODO: Implementar atualização no backend
    setUserProfile(updatedData);
    setIsEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta?")) {
       console.log("Excluindo...");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-blue-600 font-semibold animate-pulse text-lg">
          Carregando seu perfil...
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="mb-4">Erro ao carregar perfil.</p>
          <button onClick={() => navigate('/login')} className="text-blue-600 underline">
            Fazer login novamente
          </button>
        </div>
      </div>
    );
  }

  // Configuração das abas com NÚMEROS REAIS do backend
  const tabs = [
    { id: 'lendo', label: 'Lendo', count: userProfile.estatisticas?.lendo || 0 },
    { id: 'quero-ler', label: 'Quero Ler', count: userProfile.estatisticas?.queroLer || 0 },
    { id: 'lido', label: 'Lidos', count: userProfile.estatisticas?.lido || 0 },
    { id: 'favoritos', label: 'Favoritos', count: userProfile.estatisticas?.favoritos || 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        
        {isEditMode ? (
          <ProfileEditForm 
            perfilOriginal={userProfile}  // ✅ Corrigido: Passa o objeto real do estado, não a Promise
            onSave={handleSave} 
            onCancel={() => setIsEditMode(false)} 
          />
        ) : (
          <ProfileHeader 
            profile={userProfile} 
            isUserProfile={true} 
            onEdit={() => setIsEditMode(true)}
            onDelete={handleDelete}
          />
        )}

        {!isEditMode && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 overflow-x-auto scrollbar-hide">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex-1 min-w-[120px] py-4 text-sm font-semibold transition-all border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label} <span className="ml-1 opacity-70 text-xs">({tab.count})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
               {/* Lista de livros (Ainda Mockada) */}
               <ProfileBookList 
                  books={booksByStatus[activeTab] || []} 
                  isFavoriteTab={activeTab === 'favoritos'} 
                  onClick={handleBookClick}
               />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;