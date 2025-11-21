import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Star, Heart, BookOpen, MessageSquare, Share2, MoreVertical, ArrowLeft } from 'lucide-react';
import { getLivroById } from "@/services/bookService";
import type { MainLayoutContextType } from '../../MainLayout';
import { type Book, CATEGORIA_LABELS } from "../../types/Book";

// --- Interfaces Locais (View Models) ---
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
  const context = useOutletContext<MainLayoutContextType>();
  
  const [livro, setLivro] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BookStatistics | null>(null);

  // Estados de interação
  const [userRating, setUserRating] = useState<number>(0);
  const [readingStatus, setReadingStatus] = useState<ReadingStatus>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const statusOptions: StatusOption[] = [
    { value: 'QUERO_LER', label: 'Quero Ler', color: 'bg-blue-500' },
    { value: 'LENDO', label: 'Lendo', color: 'bg-yellow-500' },
    { value: 'LIDO', label: 'Lido', color: 'bg-green-500' }
  ];

  useEffect(() => {
    const fetchLivroDetalhado = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const dadosLivro = await getLivroById(Number(id));
        if (dadosLivro) {
          setLivro(dadosLivro);
          setStats(generateMockStats());
          setComments(mockComments);
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLivroDetalhado();
  }, [id]);

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
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && setUserRating(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-600 animate-pulse">Carregando...</div>;
  if (!livro || !stats) return <div className="min-h-screen flex items-center justify-center text-gray-500">Livro não encontrado.</div>;

  const ratingValue = 4.5; 
  const totalReviews = stats.resenhas;

  // Lógica de Fallback para Categorias
  const categoriasParaExibir = 
    (livro.categorias && livro.categorias.length > 0) ? livro.categorias :
    (livro.categoriasLabels && livro.categoriasLabels.length > 0) ? livro.categoriasLabels : 
    [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para a estante
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Esquerda --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-fit">
              <div className="aspect-[2/3] w-full relative mb-6 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center group">
                {livro.capa ? (
                    <img
                    src={livro.capa}
                    alt={livro.titulo}
                    loading="lazy"
                    className="w-full h-full object-cover shadow-sm group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <BookOpen className="w-20 h-20 text-gray-300" />
                )}
              </div>
              
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">{ratingValue}</span>
                </div>
                <div className="flex justify-center mb-1">
                    {renderStars(Math.round(ratingValue))}
                </div>
                <p className="text-sm text-gray-500">{totalReviews.toLocaleString('pt-BR')} avaliações</p>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6 text-center">
                <p className="text-sm font-medium text-gray-700 mb-2">Sua avaliação</p>
                <div className="flex justify-center">{renderStars(userRating, true)}</div>
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
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">                    
                    {statusOptions.map((option) => (
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

              <div className="flex gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex-1 py-2.5 rounded-lg border transition-all flex items-center justify-center gap-2 font-medium text-sm ${
                    isFavorite ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart size={18} className={isFavorite ? 'fill-red-600' : ''} />
                  Favorito
                </button>
                <button className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* --- Direita --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              
              <div className="flex flex-wrap gap-2 mb-4">
                 {categoriasParaExibir.map((cat: string) => (
                    <span key={cat} className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        {CATEGORIA_LABELS[cat as keyof typeof CATEGORIA_LABELS] || cat}
                    </span>
                 ))}
                 
                 {categoriasParaExibir.length === 0 && (
                    <span className="text-gray-400 text-xs italic bg-gray-100 px-2 py-1 rounded">
                      Sem categoria
                    </span>
                 )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">{livro.titulo}</h1>
              <p className="text-xl text-gray-600 font-medium">{livro.autor}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                 <div className="text-center md:text-left">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Ano</p>
                    <p className="text-gray-800 font-medium">{livro.ano || "N/A"}</p>
                 </div>
                 <div className="text-center md:text-left">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Páginas</p>
                    <p className="text-gray-800 font-medium">320</p>
                 </div>
                 <div className="text-center md:text-left">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Idioma</p>
                    <p className="text-gray-800 font-medium">Português</p>
                 </div>
                 <div className="text-center md:text-left">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Editora</p>
                    <p className="text-gray-800 font-medium">Rocco</p>
                 </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 overflow-x-auto">
              <div className="flex justify-between min-w-[600px] gap-4 text-center">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase">Leram</p>
                  <p className="text-lg font-bold text-gray-900">{stats.leram.toLocaleString()}</p>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase">Lendo</p>
                  <p className="text-lg font-bold text-yellow-600">{stats.lendo.toLocaleString()}</p>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase">Querem</p>
                  <p className="text-lg font-bold text-blue-600">{stats.querem.toLocaleString()}</p>
                </div>
                <div className="w-px bg-gray-200"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1 font-medium uppercase">Abandonos</p>
                  <p className="text-lg font-bold text-red-500">{stats.abandonos.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sinopse</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {livro.sinopse || "Nenhuma sinopse disponível para este livro no momento."}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-600" />
                Resenhas da Comunidade ({comments.length})
              </h2>

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
                          <button className="text-gray-300 hover:text-gray-600"><MoreVertical size={16} /></button>
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

              {comments.length > 5 && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-2">
                   <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600 flex items-center">Página {currentPage}</span>
                  <button
                    onClick={() => setCurrentPage(Math.min(Math.ceil(comments.length / 5), currentPage + 1))}
                    disabled={currentPage === Math.ceil(comments.length / 5)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                  </button>
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