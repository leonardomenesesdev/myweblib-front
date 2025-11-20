import React, { useState } from 'react';
import type { UserProfile, TabType, BookStatistics } from '@/types/User';
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
import { ProfileEditForm } from "@/components/Profile/ProfileEditForm";
import type { MainLayoutContextType } from '@/MainLayout';
import { useOutletContext } from 'react-router-dom';
import { ProfileBookList } from '@/components/Profile/ProfileBookList';
import type { Book } from "@/types/Book";
import { useNavigate } from 'react-router-dom';


// Mock Inicial (Igual ao seu)
const initialProfile: UserProfile = {
  id: 1,
  nome: "Maria Silva",
  email: "maria.silva@unifor.br",
  avatar: "https://ui-avatars.com/api/?name=Maria+Silva&size=200&background=2563eb&color=fff",
  bio: "Apaixonada por literatura fantástica e ficção científica. Sempre em busca de novas histórias para descobrir! 📚✨",
  dataCadastro: "15/03/2024",
  estatisticas: {
    queroLer: 45,
    lendo: 8,
    lido: 127,
    favoritos: 23,
    resenhas: 89,
  }
};

// Mock Books (Simplificado para o exemplo)
// Em um app real, isso viria de um useEffect buscando da API
export const mockBooks: Book[] = [
  {
    id: 1,
    titulo: "O Senhor dos Anéis: A Sociedade do Anel",
    autor: "J. R. R. Tolkien",
    capa: "https://m.media-amazon.com/images/I/81t2CVWEsUL.jpg",
    ano: 1954,
    sinopse:
      "Um jovem hobbit recebe a missão de destruir um anel poderoso criado por um senhor das trevas.",
    categorias: ["FANTASIA", "FICCAO"],
    categoriasLabels: ["Fantasia", "Ficção"],
  },
  {
    id: 2,
    titulo: "1984",
    autor: "George Orwell",
    capa: "https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg",
    ano: 1949,
    sinopse:
      "Em um regime totalitário, um homem luta contra a vigilância constante e a manipulação da verdade.",
    categorias: ["DISTOPIA", "FICCAO_CIENTIFICA"],
    categoriasLabels: ["Distopia", "Ficção Científica"],
  },
  {
    id: 3,
    titulo: "O Código Da Vinci",
    autor: "Dan Brown",
    capa: "https://m.media-amazon.com/images/I/81QxB9Dy3-L.jpg",
    ano: 2003,
    sinopse:
      "Um simbologista e uma criptógrafa investigam um assassinato no Louvre e descobrem segredos antigos.",
    categorias: ["SUSPENSE", "MISTERIO"],
    categoriasLabels: ["Suspense", "Mistério"],
  },
  {
    id: 4,
    titulo: "Clean Code",
    autor: "Robert C. Martin",
    capa: "https://m.media-amazon.com/images/I/41SH-SvWPxL.jpg",
    ano: 2008,
    sinopse:
      "Um guia fundamental sobre como escrever códigos claros e manuteníveis.",
    categorias: ["PROGRAMACAO", "TECNOLOGIA"],
    categoriasLabels: ["Programação", "Tecnologia"],
  },
  {
    id: 5,
    titulo: "Caminho",
    autor: "Josemaría Escrivá",
    capa: "https://m.media-amazon.com/images/I/91WxS53DFqL._UF1000,1000_QL80_.jpg",
    ano: 1934,
    sinopse:
      "Coleção de pontos espirituais que convidam o leitor a uma vida cristã profunda e prática.",
    categorias: ["RELIGIAO"],
    categoriasLabels: ["Religião"],
  },
];
const booksByStatus: Record<TabType, Book[]> = {
  lendo: mockBooks.slice(0, 2),
  "quero-ler": mockBooks.slice(2, 4),
  lido: mockBooks,
  favoritos: mockBooks.filter((b) => b.id % 2 === 0)
};
const UserProfilePage: React.FC = () => {
  // Contexto global se precisar
  const context = useOutletContext<MainLayoutContextType>();
  
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('lendo');

  // Handlers
  const handleSave = (updatedData: UserProfile) => {
    setUserProfile(updatedData);
    setIsEditMode(false);
    // TODO: API Call
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta?")) {
       console.log("Excluindo...");
    }
  };

  // Tabs Config
  const tabs = [
    { id: 'lendo', label: 'Lendo', count: userProfile.estatisticas.lendo },
    { id: 'quero-ler', label: 'Quero Ler', count: userProfile.estatisticas.queroLer },
    { id: 'lido', label: 'Lidos', count: userProfile.estatisticas.lido },
    { id: 'favoritos', label: 'Favoritos', count: userProfile.estatisticas.favoritos }
  ];
  const navigate = useNavigate();

    const handleBookClick = (livro: Book) => {
        navigate(`/livro/${livro.id}`);
    };

  return (
    
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Lógica de Toggle entre Visualização e Edição */}
        {isEditMode ? (
          <ProfileEditForm 
            perfilOriginal={userProfile} 
            onSave={handleSave} 
            onCancel={() => setIsEditMode(false)} 
          />
        ) : (
          <ProfileHeader 
            profile={userProfile} 
            isUserProfile={true} // 👈 Aqui está a mágica da reutilização
            onEdit={() => setIsEditMode(true)}
            onDelete={handleDelete}
          />
        )}

        {/* Área de Conteúdo (Tabs + Grid) */}
        {!isEditMode && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tab Navigation */}
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

            {/* Content Area */}
            <div className="p-6">
               {/* Nota: Aqui você passaria mockBooks[activeTab], no seu código original era booksByStatus */}
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