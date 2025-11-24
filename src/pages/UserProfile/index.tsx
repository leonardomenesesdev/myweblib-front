import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ProfileEditForm } from "@/components/Profile/ProfileEditForm";
import { ProfileBookList } from "@/components/Profile/ProfileBookList";
import type { MainLayoutContextType } from '@/MainLayout';
import type { UserProfile, TabType } from "@/types/User";
import type { Book } from "@/types/Book";

import { 
  getCurrentUserId, 
  getLivrosDoUsuarioPorStatus, 
  StatusLeitura ,
  getPerfilCompleto
} from "@/services/userService";

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<MainLayoutContextType>();
  
  // Dados do Perfil
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // Dados da Lista de Livros (Aba Atual)
  const [activeTab, setActiveTab] = useState<TabType>('lendo');
  const [bookList, setBookList] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);

  // 1. Carrega dados do Usuário (Rodado apenas 1x ao montar)
  useEffect(() => {
    const loadProfile = async () => {
      const userId = getCurrentUserId();
      
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        setProfileLoading(true);
        // Nota: Assumindo que seu getCurrentUser já retorna response.data conforme ajustamos antes
        const dadosUsuario = await getPerfilCompleto(userId);
        setUserProfile(dadosUsuario);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // 2. Carrega Livros quando a ABA muda (Lógica Inteligente)
  useEffect(() => {
    const loadBooksForTab = async () => {
      setBooksLoading(true);
      try {
        // Mapeamento: Tab do Front -> Enum do Back
        const statusMap: Record<string, StatusLeitura | null> = {
          'lendo': StatusLeitura.LENDO,
          'quero-ler': StatusLeitura.QUERO_LER,
          'lido': StatusLeitura.LIDO,
          'favoritos': null // TODO: Implementar endpoint de favoritos no backend
        };

        const statusEnum = statusMap[activeTab];

        if (statusEnum) {
          // Busca real no backend
          const livros = await getLivrosDoUsuarioPorStatus(statusEnum);
          setBookList(livros);
        } else if (activeTab === 'favoritos') {
          // Placeholder para favoritos enquanto não criamos o endpoint
          setBookList([]); 
        }

      } catch (error) {
        console.error(`IDUSER: ${getCurrentUserId()} Erro ao carregar livros da aba ${activeTab}:`, error);
        setBookList([]);
      } finally {
        setBooksLoading(false);
      }
    };

    loadBooksForTab();
  }, [activeTab]); // <- O segredo: Roda sempre que a aba muda

  // Handlers
  const handleBookClick = (livro: Book) => {
    navigate(`/livro/${livro.id}`);
  };

  const handleSave = (updatedData: UserProfile) => {
    // Aqui você chamaria o updateUserService(updatedData)
    setUserProfile(updatedData);
    setIsEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta?")) {
       // chamar deleteUserService...
       console.log("Excluindo...");
    }
  };

  // Renderização de Loading do Perfil (Tela inteira)
  if (profileLoading) {
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
        // ... (seu código de erro manteve igual)
       <div className="p-10 text-center">Erro ao carregar perfil.</div>
    );
  }

const stats = userProfile?.estatisticas;
const tabs = [
    { 
      id: 'lendo', 
      label: 'Lendo', 
      count: stats?.lendo || 0  // ✅ Conectado ao Backend
    },
    { 
      id: 'quero-ler', 
      label: 'Quero Ler', 
      count: stats?.queroLer || 0 // ✅ Conectado ao Backend
    },
    { 
      id: 'lido', 
      label: 'Lidos', 
      count: stats?.lido || 0 // ✅ Conectado ao Backend
    },
    { 
      id: 'favoritos', 
      label: 'Favoritos', 
      count: stats?.favoritos || 0 // ✅ Conectado ao Backend (mesmo que seja 0)
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        
        {isEditMode ? (
          <ProfileEditForm 
            perfilOriginal={userProfile} 
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
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
                        {/* Adiciona o contador visualmente menor e mais claro */}
                        {tab.label} <span className="ml-1 text-xs opacity-70">({tab.count})</span>
                      </button>
                  ))}
              </div>
            </div>

            <div className="p-6 min-h-[300px]">
               {booksLoading ? (
                 <div className="flex justify-center items-center h-40">
                    <span className="text-gray-400 animate-pulse">Carregando livros...</span>
                 </div>
               ) : (
                 <ProfileBookList 
                    books={bookList} // ✅ Lista real vinda do Backend
                    isFavoriteTab={activeTab === 'favoritos'} 
                    onClick={handleBookClick}
                 />
               )}
               
               {!booksLoading && bookList.length === 0 && (
                 <div className="text-center text-gray-400 py-10">
                   Nenhum livro encontrado nesta categoria.
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;