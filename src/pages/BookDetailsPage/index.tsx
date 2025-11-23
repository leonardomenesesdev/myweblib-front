import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, BookOpen, MessageSquare, Share2, ArrowLeft, Trash2, MessageCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { getLivroById } from "@/services/bookService";
import { updateReadingStatus, getReadingStatus, type ReadingStatusEnum } from "@/services/statusService";
import { getCommentsByBook, createComment, deleteComment, type CommentResponse } from "@/services/comentarioService";
import { getCurrentUserId } from "@/services/userService";
import { type Book, CATEGORIA_LABELS } from "../../types/Book";
import { cancelRating, rateBook } from '@/services/avaliacaoService';

// --- Interfaces Locais ---

interface CommentResponseExtended extends CommentResponse {
  idComentarioPai?: number | null;
}

interface BookStatistics {
  leram: number;
  lendo: number;
  querem: number;
  relendo: number;
  abandonos: number;
  resenhas: number;
}

type ReadingStatusState = ReadingStatusEnum | '';

interface StatusOption {
  value: ReadingStatusEnum;
  label: string;
  color: string;
}

// --- Mock Data ---
const generateMockStats = (): BookStatistics => ({
  leram: Math.floor(Math.random() * 50000),
  lendo: Math.floor(Math.random() * 1000),
  querem: Math.floor(Math.random() * 20000),
  relendo: Math.floor(Math.random() * 500),
  abandonos: Math.floor(Math.random() * 200),
  resenhas: 0, 
});

const BookDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = getCurrentUserId();
  
  const [livro, setLivro] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<BookStatistics | null>(null);

  // Estados de Comentários
  const [comments, setComments] = useState<CommentResponseExtended[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Respostas (Reply)
  const [replyingTo, setReplyingTo] = useState<number | null>(null); 
  const [replyText, setReplyText] = useState<string>('');

  const [isRatingLoading, setIsRatingLoading] = useState(false); // <--- NOVO: Estado de loading da avaliação
  
  // ✅ NOVO: Estado para controlar quais respostas estão visíveis (Map de ID -> booleano)
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

  // Estados de interação
  const [userRating, setUserRating] = useState<number>(0);
  const [readingStatus, setReadingStatus] = useState<ReadingStatusState>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);

  const statusOptions: StatusOption[] = [
    { value: 'QUERO_LER', label: 'Quero Ler', color: 'bg-blue-500' },
    { value: 'LENDO', label: 'Lendo', color: 'bg-yellow-500' },
    { value: 'LIDO', label: 'Lido', color: 'bg-green-500' }
  ];

  // --- Funções de Carregamento ---

  const loadComments = useCallback(async () => {
    if (!id) return;
    setLoadingComments(true);
    try {
      const data = await getCommentsByBook(Number(id), page);
      setComments(data.content);
      setTotalComments(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);
    } finally {
      setLoadingComments(false);
    }
  }, [id, page]);

  useEffect(() => {
    const initPage = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const dadosLivro = await getLivroById(Number(id));
        if (dadosLivro) {
          setLivro(dadosLivro);
          const statusAtual = await getReadingStatus(Number(id));
          if (statusAtual) setReadingStatus(statusAtual);
          setStats(generateMockStats());
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [id]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // --- Handlers ---

  const handleStatusChange = async (novoStatus: ReadingStatusEnum) => {
    if (!livro) return;
    setReadingStatus(novoStatus);
    setShowStatusDropdown(false);
    try {
      await updateReadingStatus(livro.id, novoStatus);
    } catch (error) {
      console.error("Erro ao salvar status:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !livro || !currentUserId) return;

    try {
      await createComment({
        idLivro: livro.id,
        idUsuario: Number(currentUserId),
        conteudo: newComment
      });
      
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      alert("Não foi possível enviar seu comentário.");
    }
  };

  const handleReplySubmit = async (parentId: number) => {
    if (!replyText.trim() || !livro || !currentUserId) return;

    try {
      const payload: any = {
        idLivro: livro.id,
        conteudo: replyText
      };
      if (parentId != null) payload.idComentarioPai = parentId;
      await createComment(payload);
      
      setReplyText('');
      setReplyingTo(null);
      
      // Opcional: Expandir automaticamente as respostas desse comentário ao responder
      setExpandedReplies(prev => ({ ...prev, [parentId]: true }));
      
      loadComments(); 
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      alert("Erro ao responder.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este comentário?")) return;
    try {
      await deleteComment(commentId);
      loadComments();
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
      alert("Erro ao excluir comentário.");
    }
  };

  // ✅ Handler para alternar visibilidade das respostas
  const toggleReplies = (commentId: number) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const renderStars = (rating: number, interactive = false) => (
    <div className={`flex items-center gap-2 ${isRatingLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 28 : 16} // Aumentei um pouco o tamanho interativo para facilitar o clique
            className={`${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && handleRate(star)} // <--- Agora chama a API
          />
        ))}
      </div>
      
      {/* Botão de Cancelar Avaliação (Apenas se interativo e tiver nota) */}
      {interactive && rating > 0 && (
        <button 
            onClick={handleRemoveRating}
            className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Cancelar avaliação"
        >
            <X size={16} />
        </button>
      )}
    </div>
  );

  const handleRate = async (rating: number) => {
    if (!livro || !currentUserId) {
        alert("Você precisa estar logado para avaliar.");
        return;
    }

    setIsRatingLoading(true);
    try {
        // Integração com a API: POST /avaliacao/avaliar/...
        await rateBook(livro.id, rating, Number(currentUserId));
        setUserRating(rating);
        
        // Opcional: Recarregar dados do livro para atualizar a média global visualmente
        // const updatedBook = await getLivroById(livro.id);
        // if(updatedBook) setLivro(updatedBook);

    } catch (error) {
        console.error("Erro ao enviar avaliação:", error);
        alert("Não foi possível salvar sua avaliação. Tente novamente.");
    } finally {
        setIsRatingLoading(false);
    }
  };

  const handleRemoveRating = async () => {
    if (!livro || !currentUserId || userRating === 0) return;

    if (!window.confirm("Deseja remover sua avaliação?")) return;

    setIsRatingLoading(true);
    try {
        // Integração com a API: DELETE /avaliacao/avaliar/cancelar/...
        await cancelRating(livro.id, Number(currentUserId));
        setUserRating(0); // Reseta as estrelas do usuário
    } catch (error) {
        console.error("Erro ao cancelar avaliação:", error);
        alert("Erro ao remover avaliação.");
    } finally {
        setIsRatingLoading(false);
    }
  };

  // Lógica de Filtragem
  const rootComments = comments.filter(c => !c.idComentarioPai);
  const getReplies = (parentId: number) => comments.filter(c => c.idComentarioPai === parentId);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-600 animate-pulse">Carregando...</div>;
  if (!livro || !stats) return <div className="min-h-screen flex items-center justify-center text-gray-500">Livro não encontrado.</div>;

  const ratingValue = 4.5; 
  const totalReviews = stats.resenhas;
  const categoriasParaExibir = livro.categorias || livro.categoriasLabels || [];

  // --- SUB-COMPONENTE DE RENDERIZAÇÃO ---
  const renderCommentItem = (comment: CommentResponseExtended, isReply = false) => (
    <div key={comment.id} className={`group ${isReply ? 'ml-12 mt-3 border-l-2 border-gray-100 pl-4' : 'border-b border-gray-100 last:border-0 pb-6 last:pb-0'}`}>
      <div className="flex items-start gap-3">
        <img
          src={`https://ui-avatars.com/api/?name=${comment.nomeUsuario || 'Anônimo'}&background=random&size=${isReply ? 32 : 40}`}
          alt={comment.nomeUsuario}
          className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full border border-gray-200`}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="font-bold text-gray-900 text-sm">{comment.nomeUsuario || "Usuário"}</p>
              <p className="text-xs text-gray-400">
                {comment.data ? new Date(comment.data).toLocaleDateString('pt-BR') : ''}
              </p>
            </div>
            
            <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                {currentUserId && !isReply && (
                    <button 
                        onClick={() => {
                            setReplyingTo(replyingTo === comment.id ? null : comment.id);
                            setReplyText('');
                        }}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                        title="Responder"
                    >
                        <MessageCircle size={16} />
                    </button>
                )}

                {currentUserId && Number(currentUserId) === Number(comment.idUsuario) && (
                    <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Excluir"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
          </div>
          
          <p className="text-gray-700 text-sm leading-relaxed mt-1">{comment.conteudo}</p>

          {replyingTo === comment.id && (
            <div className="mt-3 bg-gray-50 p-3 rounded-lg animate-in fade-in zoom-in-95 duration-200">
                <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Respondendo a ${comment.nomeUsuario}...`}
                    className="w-full p-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
                    rows={2}
                    autoFocus
                />
                <div className="flex justify-end gap-2 mt-2">
                    <button 
                        onClick={() => setReplyingTo(null)}
                        className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-200 rounded"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => handleReplySubmit(comment.id)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Enviar Resposta
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" /> Voltar para a estante
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Esquerda - Capa e Ações */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-fit">
               <div className="aspect-[2/3] w-full relative mb-6 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center group">
                {livro.capa ? <img src={livro.capa} alt={livro.titulo} className="w-full h-full object-cover" /> : <BookOpen className="w-20 h-20 text-gray-300" />}
              </div>
              
              <div className="text-center mb-6">
                 {/* Média Geral (Não interativo) */}
                 <div className="flex justify-center mb-1 flex-col items-center">
                    <span className="text-2xl font-bold text-gray-800 mb-1">{ratingValue > 0 ? ratingValue.toFixed(1) : '-'}</span>
                    {renderStars(Math.round(ratingValue), false)}
                 </div>
                 <p className="text-sm text-gray-500 mt-1">Média da comunidade</p>
                 
                 {/* Seção de Avaliação do Usuário Logado */}
                 {currentUserId && (
                     <div className="mt-6 pt-4 border-t border-gray-100">
                         <p className="text-sm font-semibold text-gray-700 mb-2">Sua Avaliação</p>
                         <div className="flex justify-center">
                            {renderStars(userRating, true)}
                         </div>
                         <p className="text-xs text-gray-400 mt-2 min-h-[20px]">
                            {userRating > 0 ? `Você avaliou com ${userRating} estrelas` : 'Toque nas estrelas para avaliar'}
                         </p>
                     </div>
                 )}
              </div>

              <div className="relative mb-3 z-20">
                <button onClick={() => setShowStatusDropdown(!showStatusDropdown)} className={`w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 ${readingStatus ? statusOptions.find(s => s.value === readingStatus)?.color : 'bg-blue-600'}`}>
                   <BookOpen size={20} /> {readingStatus ? statusOptions.find(s => s.value === readingStatus)?.label : 'Adicionar à Biblioteca'}
                </button>
                {showStatusDropdown && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border z-50">                    
                    {statusOptions.map((option) => (
                      <button key={option.value} onClick={() => handleStatusChange(option.value)} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-sm">
                        <span className={`inline-block w-2 h-2 rounded-full ${option.color} mr-3`}></span> {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Direita - Detalhes e Comentários (CÓDIGO INALTERADO ABAIXO) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
               <h1 className="text-3xl font-bold text-gray-900 mb-2">{livro.titulo}</h1>
               <p className="text-xl text-gray-600">{livro.autor}</p>
               <div className="mt-4"><h2 className="font-bold">Sinopse</h2><p className="text-gray-700 mt-2">{livro.sinopse}</p></div>
            </div>

            {/* ÁREA DE COMENTÁRIOS */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-600" />
                Resenhas da Comunidade ({totalComments})
              </h2>

              {currentUserId ? (
                <div className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escreva sua resenha..."
                    className="w-full p-4 bg-white border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                      <button onClick={handleCommentSubmit} disabled={!newComment.trim()} className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        Publicar Resenha
                      </button>
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-center text-sm">Faça login para comentar.</div>
              )}

              {/* Lista de Comentários */}
              <div className="space-y-6">
                {loadingComments ? (
                  <p className="text-center text-gray-500">Carregando...</p>
                ) : comments.length > 0 ? (
                  rootComments.map((parent) => {
                    const replies = getReplies(parent.id);
                    const hasReplies = replies.length > 0;
                    const isExpanded = expandedReplies[parent.id];

                    return (
                        <div key={parent.id}>
                            {renderCommentItem(parent)}
                            
                            {hasReplies && (
                                <div className="ml-14 mt-2 mb-4">
                                    <button 
                                        onClick={() => toggleReplies(parent.id)}
                                        className="text-xs font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors mb-2"
                                    >
                                        {isExpanded ? (
                                            <>
                                                Esconder {replies.length > 1 ? 'respostas' : 'resposta'} 
                                                <ChevronUp size={14} />
                                            </>
                                        ) : (
                                            <>
                                                Ver {replies.length} {replies.length > 1 ? 'respostas' : 'resposta'} 
                                                <ChevronDown size={14} />
                                            </>
                                        )}
                                    </button>

                                    {isExpanded && (
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            {replies.map(child => renderCommentItem(child, true))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-400 text-sm">Seja o primeiro a comentar!</p>
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-2">
                   <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">Anterior</button>
                   <span className="px-4 py-2 text-sm text-gray-600">Página {page + 1} de {totalPages}</span>
                   <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">Próxima</button>
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