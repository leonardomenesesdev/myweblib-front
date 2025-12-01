import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, BookOpen, MessageSquare, Share2, ArrowLeft, Trash2, MessageCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { getLivroById } from "@/services/bookService";
import { updateReadingStatus, getReadingStatus, type ReadingStatusEnum } from "@/services/statusService";
import { getCommentsByBook, createComment, deleteComment, type CommentResponse } from "@/services/comentarioService";
import { getCurrentUserId } from "@/services/userService";
import { type Book, CATEGORIA_LABELS } from "../../types/Book";
import { cancelRating, rateBook, getUserRating } from '@/services/avaliacaoService';
import { toggleFavorite, checkIsFavorite } from "@/services/statusService"; 
import { ConfirmModal } from "@/components/ConfirmModal";
import { AlertModal2 } from '@/components/AlertModal2';

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
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

  // Estados de interação e Permissões
  const [userRating, setUserRating] = useState<number>(0);
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [readingStatus, setReadingStatus] = useState<ReadingStatusState>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Estados dos Modais
  const [alertModal, setAlertModal] = useState({ open: false, title: '', message: '' });
  const [confirmModal, setConfirmModal] = useState({ 
    open: false, 
    title: '', 
    message: '', 
    onConfirm: () => {} 
  });

  const statusOptions: StatusOption[] = [
    { value: 'QUERO_LER', label: 'Quero Ler', color: 'bg-blue-500' },
    { value: 'LENDO', label: 'Lendo', color: 'bg-yellow-500' },
    { value: 'LIDO', label: 'Lido', color: 'bg-green-500' }
  ];

  // Funções auxiliares para modais
  const showAlert = (title: string, message: string) => {
    setAlertModal({ open: true, title, message });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ open: true, title, message, onConfirm });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);

            const userRole = payload.role || payload.roles;

            if (userRole === "ADMIN" || userRole === "ROLE_ADMIN") {
                setIsAdmin(true);
            } else if (Array.isArray(userRole) && (userRole.includes("ADMIN") || userRole.includes("ROLE_ADMIN"))) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }

        } catch (error) {
            console.error("Erro ao processar token:", error);
            setIsAdmin(false);
        }
    }
  }, []);

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
          const bookId = Number(id);
          const [dadosLivro, statusAtual, myRating, favoritoStatus] = await Promise.all([
            getLivroById(bookId),
            getReadingStatus(bookId),
            currentUserId ? getUserRating(bookId) : Promise.resolve(0),
            currentUserId ? checkIsFavorite(bookId) : Promise.resolve(false)
          ]);

          if (dadosLivro) {
            setLivro(dadosLivro);
            setStats(generateMockStats());
          }
          if (statusAtual) setReadingStatus(statusAtual);
          if (myRating > 0) setUserRating(myRating);
          
          setIsFavorite(favoritoStatus);

        } catch (error) {
          console.error("Erro ao carregar detalhes:", error);
        } finally {
          setLoading(false);
        }
      };
      initPage();
    }, [id, currentUserId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleToggleFavorite = async () => {
    if (!currentUserId || !livro) {
        showAlert("Atenção", "Faça login para favoritar livros.");
        return;
    }
    try {
      await toggleFavorite(livro.id);
      setIsFavorite(!isFavorite);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Não é possível favoritar este livro no momento.";
      showAlert("Erro", msg);
    }
  };

  const handleStatusChange = async (novoStatus: ReadingStatusEnum) => {
    if (!livro) return;
    setReadingStatus(novoStatus);
    setShowStatusDropdown(false);
    try {
      await updateReadingStatus(livro.id, novoStatus);
    } catch (error) {
      console.error("Erro ao salvar status:", error);
      showAlert("Erro", "Não foi possível atualizar o status de leitura.");
    }
  };

  const handleRate = async (rating: number) => {
    if (!livro || !currentUserId) {
        showAlert("Login Necessário", "Você precisa estar logado para avaliar livros.");
        return;
    }

    setIsRatingLoading(true);
    try {
        await rateBook(livro.id, rating, Number(currentUserId));
        setUserRating(rating);
        
        const livroAtualizado = await getLivroById(livro.id);
        if (livroAtualizado) {
            setLivro(prev => prev ? { ...prev, avaliacaoMedia: livroAtualizado.avaliacaoMedia } : livroAtualizado);
        }

    } catch (error) {
        console.error("Erro ao enviar avaliação:", error);
        showAlert("Erro", "Não foi possível salvar sua avaliação.");
    } finally {
        setIsRatingLoading(false);
    }
  };

  const handleRemoveRating = async () => {
    if (!livro || !currentUserId || userRating === 0) return;

    showConfirm(
      "Remover Avaliação",
      "Tem certeza que deseja remover sua avaliação deste livro?",
      async () => {
        setIsRatingLoading(true);
        try {
            await cancelRating(livro.id, Number(currentUserId));
            setUserRating(0);
            
            const livroAtualizado = await getLivroById(livro.id);
            if (livroAtualizado) {
                setLivro(prev => prev ? { ...prev, avaliacaoMedia: livroAtualizado.avaliacaoMedia } : livroAtualizado);
            }
            showAlert("Sucesso", "Avaliação removida com sucesso!");
        } catch (error) {
            console.error("Erro ao cancelar avaliação:", error);
            showAlert("Erro", "Não foi possível remover sua avaliação.");
        } finally {
            setIsRatingLoading(false);
        }
      }
    );
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
      showAlert("Sucesso", "Resenha publicada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      showAlert("Erro", "Não foi possível enviar sua resenha.");
    }
  };

  const handleReplySubmit = async (parentId: number) => {
    if (!replyText.trim() || !livro || !currentUserId) return;
    try {
      const payload: any = {
        idLivro: livro.id,
        idUsuario: Number(currentUserId),
        conteudo: replyText,
        idComentarioPai: parentId 
      };
      await createComment(payload);
      
      setReplyText('');
      setReplyingTo(null);
      setExpandedReplies(prev => ({ ...prev, [parentId]: true }));
      loadComments();
      showAlert("Sucesso", "Resposta enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      showAlert("Erro", "Não foi possível enviar sua resposta.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    showConfirm(
      "Excluir Resenha",
      "Tem certeza que deseja excluir esta resenha? Esta ação não pode ser desfeita.",
      async () => {
        try {
          await deleteComment(commentId);
          loadComments();
          showAlert("Sucesso", "Resenha excluída com sucesso!");
        } catch (error) {
          console.error("Erro ao excluir:", error);
          showAlert("Erro", "Não foi possível excluir a resenha.");
        }
      }
    );
  };

  const toggleReplies = (commentId: number) => {
    setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const renderStars = (rating: number, interactive = false) => (
    <div className={`flex items-center gap-2 ${isRatingLoading ? 'opacity-50 cursor-wait' : ''}`}>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 28 : 16}
            className={`${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && !isRatingLoading && handleRate(star)}
          />
        ))}
      </div>
      
      {interactive && rating > 0 && !isRatingLoading && (
        <button 
            onClick={handleRemoveRating}
            className="ml-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Remover avaliação"
        >
            <X size={16} />
        </button>
      )}
    </div>
  );

  const rootComments = comments.filter(c => !c.idComentarioPai);
  const getReplies = (parentId: number) => comments.filter(c => c.idComentarioPai === parentId);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-600 animate-pulse">Carregando...</div>;
  if (!livro || !stats) return <div className="min-h-screen flex items-center justify-center text-gray-500">Livro não encontrado.</div>;

  const ratingValue = (livro as any).avaliacaoMedia || 0; 
  const categoriasParaExibir = livro.categorias || livro.categoriasLabels || [];

  const renderCommentItem = (comment: CommentResponseExtended, isReply = false) => {
    const isOwner = currentUserId && Number(currentUserId) === Number(comment.idUsuario);
    const canDelete = isOwner || isAdmin;

    return (
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

                    {canDelete && (
                        <button 
                            onClick={() => handleDeleteComment(comment.id)}
                            className={`transition-colors p-1 ${isAdmin && !isOwner ? 'text-gray-400 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
                            title={isAdmin && !isOwner ? "Excluir como Admin" : "Excluir"}
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
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-2" /> Voltar para a estante
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-fit">
               <div className="aspect-[2/3] w-full relative mb-6 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center group">
                {livro.capa ? <img src={livro.capa} alt={livro.titulo} className="w-full h-full object-cover" /> : <BookOpen className="w-20 h-20 text-gray-300" />}
              </div>
              
              <div className="text-center mb-6">
                 <div className="flex flex-col items-center justify-center mb-1">
                    <span className="text-4xl font-bold text-gray-900 mb-1">{ratingValue > 0 ? ratingValue.toFixed(1) : '-'}</span>
                    {renderStars(Math.round(ratingValue), false)}
                 </div>
                 <p className="text-sm text-gray-500">Média da comunidade</p>
                 
                 {currentUserId && (
                     <div className="mt-6 pt-4 border-t border-gray-100 w-full">
                         <p className="text-sm font-semibold text-gray-700 mb-2">Sua Avaliação</p>
                         <div className="flex justify-center">
                            {renderStars(userRating, true)}
                         </div>
                         <p className="text-xs text-gray-400 mt-2 h-5">
                            {userRating > 0 ? `Você avaliou com ${userRating} estrelas` : 'Toque nas estrelas para avaliar'}
                         </p>
                     </div>
                 )}
              </div>

              <div className="relative mb-3 z-20">
                <button onClick={() => setShowStatusDropdown(!showStatusDropdown)} className={`w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow ${readingStatus ? statusOptions.find(s => s.value === readingStatus)?.color : 'bg-blue-600 hover:bg-blue-700'}`}>
                   <BookOpen size={20} /> {readingStatus ? statusOptions.find(s => s.value === readingStatus)?.label : 'Adicionar à Biblioteca'}
                </button>
                {showStatusDropdown && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50">                    
                    {statusOptions.map((option) => (
                      <button key={option.value} onClick={() => handleStatusChange(option.value)} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-sm text-gray-700">
                        <span className={`inline-block w-2 h-2 rounded-full ${option.color} mr-3`}></span> {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button 
                    onClick={handleToggleFavorite} 
                    className={`flex-1 py-2.5 rounded-lg border transition-all flex items-center justify-center gap-2 font-medium text-sm ${
                        isFavorite 
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                >
                    <Heart size={18} className={isFavorite ? 'fill-red-600' : ''} /> 
                    {isFavorite ? 'Favorito' : 'Favoritar'}
                </button>
              </div>

            </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{livro.titulo}</h1>
                    <p className="text-xl text-gray-600">{livro.autor}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {categoriasParaExibir.map((cat: string) => <span key={cat} className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{CATEGORIA_LABELS[cat as keyof typeof CATEGORIA_LABELS] || cat}</span>)}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                    <h2 className="font-bold text-xl mb-4">Sinopse</h2>
                    <p className="text-gray-700 leading-relaxed">{livro.sinopse || "Sem sinopse."}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MessageSquare size={20} className="text-blue-600" /> Resenhas ({totalComments})
                    </h2>

                    {currentUserId ? (
                        <div className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escreva sua resenha..." className="w-full p-4 bg-white border rounded-lg text-sm" rows={3} />
                            <div className="flex justify-end mt-3">
                                <button onClick={handleCommentSubmit} disabled={!newComment.trim()} className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">Publicar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-center text-sm">Faça login para comentar.</div>
                    )}

                    <div className="space-y-6">
                        {loadingComments ? <p className="text-center text-gray-500">Carregando...</p> : 
                        rootComments.map((parent) => {
                            const replies = getReplies(parent.id);
                            const isExpanded = expandedReplies[parent.id];
                            return (
                                <div key={parent.id}>
                                    {renderCommentItem(parent)}
                                    {replies.length > 0 && (
                                        <div className="ml-14 mt-2 mb-4">
                                            <button onClick={() => toggleReplies(parent.id)} className="text-xs font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors mb-2">
                                                {isExpanded ? <>Esconder respostas <ChevronUp size={14} /></> : <>Ver {replies.length} respostas <ChevronDown size={14} /></>}
                                            </button>
                                            {isExpanded && <div className="animate-in fade-in slide-in-from-top-2">{replies.map(child => renderCommentItem(child, true))}</div>}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                        }
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-2">
                            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 transition-colors">Anterior</button>
                            <span className="px-4 py-2 text-sm text-gray-600">Página {page + 1} de {totalPages}</span>
                            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 transition-colors">Próxima</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Modais */}
      <AlertModal2 
        isOpen={alertModal.open}
        onClose={() => setAlertModal({ ...alertModal, open: false })}
        title={alertModal.title}
        message={alertModal.message}
      />

      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ ...confirmModal, open: false })}
        onConfirm={() => {
          confirmModal.onConfirm();
          setConfirmModal({ ...confirmModal, open: false });
        }}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Sim, continuar"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </div>
  );
};

export default BookDetailsPage;