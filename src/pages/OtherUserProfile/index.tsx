import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom'; // 1. Importe useParams
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ProfileEditForm } from "@/components/Profile/ProfileEditForm";
import { ProfileBookList } from "@/components/Profile/ProfileBookList";
import type { MainLayoutContextType } from '@/MainLayout';
import type { UserProfile, TabType } from "@/types/User";
import type { Book } from "@/types/Book";

import { 
  getLivrosDoUsuarioPorStatus, 
  StatusLeitura,
  getPerfilCompleto,
  getLivrosFavoritos
} from "@/services/userService";

const OtherUserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // 2. Pegue o ID da URL
  
  // Converta o ID da URL para número
  const profileId = id ? Number(id) : null;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Como é perfil de OUTRO usuário, geralmente não editamos aqui, 
  // mas mantive a lógica caso você queira permitir admin editar.
  const [isEditMode, setIsEditMode] = useState(false); 

  const [activeTab, setActiveTab] = useState<TabType>('lendo');
  const [bookList, setBookList] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);

  // 1. Carrega dados do Usuário Baseado na URL
  useEffect(() => {
    const loadProfile = async () => {
      if (!profileId) {
        navigate('/'); // Se não tiver ID na URL, volta pra home
        return;
      }

      try {
        setProfileLoading(true);
        // Usa o profileId da URL, não o do localStorage
        const dadosUsuario = await getPerfilCompleto(profileId);
        setUserProfile(dadosUsuario);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [profileId, navigate]); // Dependência mudou para profileId

  // 2. Carrega Livros quando a ABA muda
  useEffect(() => {
    const loadBooksForTab = async () => {
      if (!profileId) return; // Segurança

      setBooksLoading(true);

      try {
        const statusMap: Record<string, StatusLeitura | null> = {
          'lendo': StatusLeitura.LENDO,
          'quero-ler': StatusLeitura.QUERO_LER,
          'lido': StatusLeitura.LIDO,
          'favoritos': null 
        };

        const statusEnum = statusMap[activeTab];

        if (statusEnum) {
          // Passamos o profileId para a função de serviço buscar os livros DESTE usuário
          const livros = await getLivrosDoUsuarioPorStatus(statusEnum, profileId);
          setBookList(livros);
        } 
        else if (activeTab === 'favoritos') {
          const favoritos = await getLivrosFavoritos(profileId);
          setBookList(favoritos);
        }

      } catch (error) {
        console.error(`Erro ao carregar livros da aba ${activeTab}:`, error);
        setBookList([]);
      } finally {
        setBooksLoading(false);
      }
    };

    loadBooksForTab();
  }, [activeTab, profileId]); // Adicionado profileId nas dependências

  // ... (Handlers handleBookClick, handleSave, etc permanecem iguais)

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-blue-600 font-semibold animate-pulse text-lg">
          Carregando perfil...
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="p-10 text-center">Usuário não encontrado.</div>;
  }

  const stats = userProfile?.estatisticas;
  
  const tabs = [
    { id: 'lendo', label: 'Lendo', count: stats?.lendo || 0 },
    { id: 'quero-ler', label: 'Quero Ler', count: stats?.queroLer || 0 },
    { id: 'lido', label: 'Lidos', count: stats?.lido || 0 },
    { id: 'favoritos', label: 'Favoritos', count: stats?.favoritos || 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Renderização condicional básica */}
        {isEditMode ? (
          <ProfileEditForm 
            perfilOriginal={userProfile} 
            onSave={(data) => { setUserProfile(data); setIsEditMode(false); }} 
            onCancel={() => setIsEditMode(false)} 
          />
        ) : (
          <ProfileHeader 
            profile={userProfile} 
            isUserProfile={false} 
            onEdit={() => setIsEditMode(true)}
            onDelete={() => {}}
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
                    books={bookList} 
                    isFavoriteTab={activeTab === 'favoritos'} 
                    onClick={(livro) => navigate(`/livro/${livro.id}`)}
                 />
               )}
               
               {!booksLoading && bookList.length === 0 && (
                 <div className="text-center text-gray-400 py-10">
                   {activeTab === 'favoritos' 
                     ? "Este usuário não favoritou nenhum livro." 
                     : "Nenhum livro encontrado nesta categoria."}
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherUserProfile;