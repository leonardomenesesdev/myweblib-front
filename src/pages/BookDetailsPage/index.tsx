import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Star, Heart, BookOpen, MessageSquare, MoreVertical, ArrowLeft } from 'lucide-react';
import { getLivroById } from "@/services/bookService";
import type { MainLayoutContextType } from '@/MainLayout';
import type { Book } from "../../types/Book";
import { CATEGORIA_LABELS } from '../../types/Book';
// --- Interfaces Locais (View Models) ---
// Estendemos os dados básicos para incluir o que a UI rica precisa
interface BookStatistics {
  leram: number;
  lendo: number;
  querem: number;
  relendo: number;
  abandonos: number;
  resenhas: number;
}

interface Comment {
  id: number;
  usuario: string;
  avatar: string;
  data: string;
  comentario: string;
  likes: number;
}

type ReadingStatus = 'QUERO_LER' | 'LENDO' | 'LIDO' | '';

interface StatusOption {
  value: ReadingStatus;
  label: string;
  color: string;
}

// --- Mock Data Helpers ---
// Função auxiliar para gerar estatísticas aleatórias para preencher a UI
const generateMockStats = (): BookStatistics => ({
  leram: Math.floor(Math.random() * 50000),
  lendo: Math.floor(Math.random() * 1000),
  querem: Math.floor(Math.random() * 20000),
  relendo: Math.floor(Math.random() * 500),
  abandonos: Math.floor(Math.random() * 200),
  resenhas: Math.floor(Math.random() * 1500),
});

const mockComments: Comment[] = [
  {
    id: 1,
    usuario: "Ana Silva",
    avatar: "https://ui-avatars.com/api/?name=Ana+Silva&background=random",
    data: "15/11/2025",
    comentario: "Um dos melhores livros que já li! A história é envolvente do início ao fim.",
    likes: 42
  },
  {
    id: 2,
    usuario: "Carlos Mendes",
    avatar: "https://ui-avatars.com/api/?name=Carlos+Mendes&background=random",
    data: "10/11/2025",
    comentario: "A entrega foi super rápida e o livro chegou em perfeito estado.",
    likes: 28
  }
];

const BookDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Integração com a Busca Global do Layout
  const context = useOutletContext<MainLayoutContextType>();
  
  // Estados do Livro
  const [livro, setLivro] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BookStatistics | null>(null);

  // Estados de Interação do Usuário
  const [userRating, setUserRating] = useState<number>(0);
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [currentPage] = useState<number>(1);



  const statusOptions: StatusOption[] = [
    { value: 'QUERO_LER', label: 'Quero Ler', color: 'bg-blue-500' },
    { value: 'LENDO', label: 'Lendo', color: 'bg-yellow-500' },
    { value: 'LIDO', label: 'Lido', color: 'bg-green-500' }
  ];



  // Efeito 2: Carregar dados do livro
  useEffect(() => {
    const fetchLivroDetalhado = async () => {
      setLoading(true);
      try {
        // Simulação de busca por ID (num cenário real, endpoint específico)
        const encontrado = await getLivroById(id ? parseInt(id) : 0);
        
        if (encontrado) {
          setLivro(encontrado);
          // Enriquecendo com dados mockados para a UI
          setStats(generateMockStats());
          setComments(mockComments);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLivroDetalhado();
  }, [id]);

  // Handlers
  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const novoComentario: Comment = {
        id: comments.length + 1,
        usuario: "Você",
        avatar: "https://ui-avatars.com/api/?name=Voce&background=random",
        data: new Date().toLocaleDateString('pt-BR'),
        comentario: newComment,
        likes: 0
      };
      setComments([novoComentario, ...comments]);
      setNewComment('');
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 24 : 16}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && setUserRating(star)}
          />
        ))}
      </div>
    );
  };
  

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!livro || !stats) return <div className="min-h-screen flex items-center justify-center">Livro não encontrado.</div>;

    const categoriasParaExibir = 
    (livro.categorias && livro.categorias.length > 0) ? livro.categorias :
    (livro.categoriasLabels && livro.categoriasLabels.length > 0) ? livro.categoriasLabels : 
    [];
  // Definindo valores padrão para campos que podem não existir no tipo Book simples
  const ratingValue = 4.5; // Mock fixo se não vier do backend
  const totalReviews = stats.resenhas;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Botão Voltar */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para a estante
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Book Cover and Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6   border border-gray-100">
              <div className="w-full relative mb-6 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {livro.capa ? (
                    <img
                    src={livro.capa}
                    alt={livro.titulo}
                    className="w-full h-full object-cover shadow-sm"
                    />
                ) : (
                    <BookOpen className="w-20 h-20 text-gray-300" />
                )}
              </div>
              
              {/* Rating Geral */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {ratingValue}
                  </span>
                </div>
                <div className="flex justify-center mb-1">
                    {renderStars(Math.round(ratingValue))}
                </div>
                <p className="text-sm text-gray-500">
                  {totalReviews.toLocaleString('pt-BR')} avaliações
                </p>
              </div>

              {/* User Rating */}
              <div className="border-t border-gray-100 pt-4 mb-6 text-center">
                <p className="text-sm font-medium text-gray-700 mb-2">Sua avaliação</p>
                <div className="flex justify-center">
                    {renderStars(userRating, true)}
                </div>
              </div>

              {/* Status Dropdown */}
              <div className="relative mb-3 z-20">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 ${
                    readingStatus ? statusOptions.find(s => s.value === readingStatus)?.color : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <BookOpen size={20} />
                  {readingStatus ? statusOptions.find(s => s.value === readingStatus)?.label : 'Adicionar à Biblioteca'}
                </button>
                
                {showStatusDropdown && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50">                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                            setReadingStatus(option.value);
                            setShowStatusDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center text-sm text-gray-700"
                      >
                        <span className={`inline-block w-2 h-2 rounded-full ${option.color} mr-3`}></span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex-1 py-2.5 rounded-lg border transition-all flex items-center justify-center gap-2 font-medium text-sm ${
                    isFavorite
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart size={18} className={isFavorite ? 'fill-red-600' : ''} />
                  Favorito
                </button>
              </div>


            </div>
          </div>

          {/* Right Column - Book Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Author */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <div className="flex flex-wrap gap-2 mb-4">
                 {categoriasParaExibir.map((cat: string) => (
                    <span key={cat} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        {/* Tenta traduzir, se não der (ex: já é label), exibe o próprio valor */}
                        {CATEGORIA_LABELS[cat as keyof typeof CATEGORIA_LABELS] || cat}
                    </span>
                 ))}
                 
                 {categoriasParaExibir.length === 0 && (
                    <span className="text-gray-400 text-xs italic bg-gray-100 px-2 py-1 rounded">
                      Sem categoria
                    </span>
                 )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {livro.titulo}
              </h1>
              <p className="text-xl text-gray-600 font-medium">{livro.autor}</p>
              
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-100">
                 <div className="text-center md:text-left">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Ano</p>
                    <p className="text-gray-800 font-medium">{livro.ano || "N/A"}</p>
                 </div>


              </div>
            </div>

                      {/* Synopsis */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sinopse</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {livro.sinopse || "Nenhuma sinopse disponível para este livro no momento."}
              </p>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-600" />
                Resenhas da Comunidade ({comments.length})
              </h2>

              {/* Comment Form */}
              <div className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="O que você achou deste livro? Escreva sua resenha..."
                  className="w-full p-4 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                    <button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                    className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    Publicar Resenha
                    </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.slice((currentPage - 1) * 5, currentPage * 5).map((comment) => (
                  <div key={comment.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-4">
                      <img
                        src={comment.avatar}
                        alt={comment.usuario}
                        className="w-10 h-10 rounded-full border border-gray-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{comment.usuario}</p>
                            <p className="text-xs text-gray-400">{comment.data}</p>
                          </div>
                          <button className="text-gray-300 hover:text-gray-600">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mt-2">{comment.comentario}</p>
                        <button className="mt-3 text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1.5 font-medium transition-colors">
                          <Heart size={14} />
                          {comment.likes} Curtidas
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination (Simple) */}
              {comments.length > 5 && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-2">
                   {/* Lógica de paginação igual ao original */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;