import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AlertTriangle, Trash2, X } from 'lucide-react'; // Ícones para o modal
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ProfileEditForm } from "@/components/Profile/ProfileEditForm";
import { ProfileBookList } from "@/components/Profile/ProfileBookList";
import type { MainLayoutContextType } from '@/MainLayout';
import type { UserProfile, TabType } from "@/types/User";
import type { Book } from "@/types/Book";

import { 
  getCurrentUserId, 
  getLivrosDoUsuarioPorStatus, 
  StatusLeitura,
  getPerfilCompleto,
  getLivrosFavoritos,
  updateUserProfile,
  deleteUserAccount, // ✅ Importe a função de deletar
  logoutUser         // ✅ Importe o logout
} from "@/services/userService";

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const context = useOutletContext<MainLayoutContextType>();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // ✅ Novos estados para o modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>('lendo');
  const [bookList, setBookList] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);

  // 1. Carrega dados do Usuário
  useEffect(() => {
    const loadProfile = async () => {
      const userId = getCurrentUserId();
      
      if (!userId) {
        navigate('/login');
        return;
      }

      try {
        setProfileLoading(true);
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

  // 2. Carrega Livros
  useEffect(() => {
    const loadBooksForTab = async () => {
      setBooksLoading(true);
      const userId = getCurrentUserId();

      try {
        const statusMap: Record<string, StatusLeitura | null> = {
          'lendo': StatusLeitura.LENDO,
          'quero-ler': StatusLeitura.QUERO_LER,
          'lido': StatusLeitura.LIDO,
          'favoritos': null 
        };

        const statusEnum = statusMap[activeTab];

        if (statusEnum) {
          const livros = await getLivrosDoUsuarioPorStatus(statusEnum);
          setBookList(livros);
        } 
        else if (activeTab === 'favoritos' && userId) {
          const favoritos = await getLivrosFavoritos(userId);
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
  }, [activeTab]); 

  // Handlers
  const handleBookClick = (livro: Book) => {
    navigate(`/livro/${livro.id}`);
  };

const handleSave = async (updatedData: any) => {
    if (!userProfile) return;

    setIsSaving(true);
    try {
        
        await updateUserProfile(userProfile.id, updatedData);
        
        const novoPerfil: UserProfile = {
            ...userProfile,           // Mantém ID, DataCadastro e Estatísticas intocados
            nome: updatedData.nome,   // Atualiza Nome
            email: updatedData.email, 
        };
        
        // Atualiza a tela instantaneamente
        setUserProfile(novoPerfil);
        
        setIsEditMode(false);
        alert("Perfil atualizado com sucesso!");
        
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        alert("Não foi possível salvar as alterações.");
    } finally {
        setIsSaving(false);
    }
  };

  // ✅ Abre o modal ao clicar em excluir no Header
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  // ✅ Lógica Real de Exclusão
  const confirmDelete = async () => {
    if (!userProfile) return;

    setIsDeleting(true);
    try {
      // 1. Chama o backend para apagar o usuário
      await deleteUserAccount(userProfile.id);
      
      // 2. Limpa sessão local
      logoutUser();
      
      // 3. Redireciona para login
      navigate('/login');
      
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      alert("Ocorreu um erro ao tentar excluir a conta.");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

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
    return <div className="p-10 text-center">Erro ao carregar perfil.</div>;
  }

  const stats = userProfile?.estatisticas;
  
  const tabs = [
    { id: 'lendo', label: 'Lendo', count: stats?.lendo || 0 },
    { id: 'quero-ler', label: 'Quero Ler', count: stats?.queroLer || 0 },
    { id: 'lido', label: 'Lidos', count: stats?.lido || 0 },
    { id: 'favoritos', label: 'Favoritos', count: stats?.favoritos || 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in relative">
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
            onDelete={handleDeleteClick} // ✅ Passa a função que abre o modal
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
                    onClick={handleBookClick}
                 />
               )}
               
               {!booksLoading && bookList.length === 0 && (
                 <div className="text-center text-gray-400 py-10">
                   {activeTab === 'favoritos' 
                     ? "Você ainda não favoritou nenhum livro." 
                     : "Nenhum livro encontrado nesta categoria."}
                 </div>
               )}
            </div>
          </div>
        )}
      </div>

      {/* ✅ MODAL DE EXCLUSÃO */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
            
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 text-red-600">
                    <div className="bg-red-100 p-2 rounded-full">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Excluir Conta</h3>
                </div>
                <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">
                    Tem certeza que deseja excluir sua conta permanentemente? 
                    <br/><br/>
                    Essa ação <strong>não pode ser desfeita</strong> e todos os seus dados, histórico de leitura e avaliações serão perdidos. Ao confirmar, você será desconectado.
                </p>
            </div>

            <div className="flex gap-3 justify-end">
                <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isDeleting}
                    className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center gap-2"
                >
                    {isDeleting ? 'Excluindo...' : (
                        <>
                            <Trash2 size={18} /> Confirmar Exclusão
                        </>
                    )}
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserProfilePage;