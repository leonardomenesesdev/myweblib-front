import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Plus, Edit2, Trash2, Search, X, Check, Loader2, ChevronLeft, ChevronRight, ArrowUpDown, Filter
} from 'lucide-react';
import { 
  getLivros, getLivroById, criarLivro, atualizarLivro, deletarLivro 
} from '@/services/bookService';
import { getAllUsers, deleteUser, type UserAdminDTO } from '@/services/adminService';
import { type Book, CATEGORIA_LABELS, type EnumCategoria } from '@/types/Book';
import { AlertModal } from '@/components/AlertModal';
import { ConfirmModal } from '@/components/ConfirmModal';

// --- Interfaces do Componente ---
type AdminTab = 'livros' | 'usuarios';
type SortOption = 'id-asc' | 'id-desc' | 'titulo-asc' | 'titulo-desc' | 'nome-asc' | 'nome-desc';

const ITEMS_PER_PAGE = 10; 

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('livros');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('id-asc');
  
  // Filtro de categoria
  const [filterCategoria, setFilterCategoria] = useState<string>('');
  
  // Estado de Paginação
  const [currentPage, setCurrentPage] = useState(1);

  // Dados
  const [livros, setLivros] = useState<Book[]>([]);
  const [usuarios, setUsuarios] = useState<UserAdminDTO[]>([]);

  // Modais de Edição
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  
  // Estado de loading específico para o formulário (busca de detalhes)
  const [formLoading, setFormLoading] = useState(false);

  const [bookForm, setBookForm] = useState<Partial<Book>>({
    titulo: '', autor: '', ano: new Date().getFullYear(), capa: '', sinopse: '', categorias: []
  });

  // Feedback
  const [alertInfo, setAlertInfo] = useState({ open: false, title: '', msg: '' });
  
  // Estado do modal de confirmação
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'livro' | 'usuario', id: number } | null>(null);

  // --- CARREGAMENTO DE DADOS ---
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'livros') {
        const data = await getLivros();
        setLivros(data);
      } else {
        const data = await getAllUsers();
        setUsuarios(data);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showAlert("Erro", "Falha ao carregar dados do servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setCurrentPage(1); 
    setSearchTerm('');
    setFilterCategoria('');
    // Reseta a ordenação para ID crescente ao trocar de aba
    setSortBy('id-asc');
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategoria]);

  // --- HANDLERS LIVROS ---
  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.titulo || !bookForm.autor) return;

    try {
      if (editingBook) {
        await atualizarLivro(editingBook.id, bookForm);
        showAlert("Sucesso", "Livro atualizado com sucesso!");
      } else {
        await criarLivro(bookForm);
        showAlert("Sucesso", "Livro cadastrado com sucesso!");
      }
      setShowBookModal(false);
      setEditingBook(null);
      setBookForm({ titulo: '', autor: '', ano: new Date().getFullYear(), capa: '', sinopse: '', categorias: [] });
      fetchData();
    } catch (error: any) {
      console.error("Erro ao salvar livro:", error);
      const backendMessage = error.response?.data?.message || error.response?.data || "Não foi possível salvar o livro.";
      const displayMessage = typeof backendMessage === 'string' ? backendMessage : "Erro desconhecido no servidor.";
      showAlert("Erro no Cadastro", displayMessage);
    }
  };

  // [CORREÇÃO] Abre o modal e busca os dados completos do livro
  const openEditBook = async (book: Book) => {
    setEditingBook(book);
    // Preenche com os dados parciais da tabela inicialmente
    setBookForm({ ...book, sinopse: book.sinopse || '' }); 
    setShowBookModal(true);
    
    // Busca os dados detalhados (incluindo Sinopse completa)
    setFormLoading(true);
    try {
        const fullBook = await getLivroById(book.id);
        setEditingBook(fullBook);
        // Atualiza o form com os dados completos vindos da API
        setBookForm({ 
            ...fullBook, 
            sinopse: fullBook.sinopse || '',
            // Garante que categorias existam
            categorias: fullBook.categorias || []
        });
    } catch (error) {
        console.error("Erro ao buscar detalhes do livro:", error);
        showAlert("Atenção", "Não foi possível carregar todos os detalhes do livro.");
    } finally {
        setFormLoading(false);
    }
  };

  // Botão "Novo Livro" não precisa buscar nada
  const openNewBook = () => {
    setEditingBook(null); 
    setBookForm({ titulo: '', autor: '', ano: new Date().getFullYear(), capa: '', sinopse: '', categorias: [] }); 
    setShowBookModal(true);
  };

  // --- LÓGICA DE EXCLUSÃO ---
  const openDeleteBookModal = (id: number) => {
    setDeleteTarget({ type: 'livro', id });
  };

  const openDeleteUserModal = (id: number) => {
    setDeleteTarget({ type: 'usuario', id });
  };

  const confirmDeleteAction = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'livro') {
        await deletarLivro(deleteTarget.id);
        setLivros(prev => prev.filter(b => b.id !== deleteTarget.id));
        showAlert("Sucesso", "Livro removido com sucesso.");
      } else {
        await deleteUser(deleteTarget.id);
        setUsuarios(prev => prev.filter(u => u.id !== deleteTarget.id));
        showAlert("Sucesso", "Usuário removido com sucesso.");
      }
    } catch (error) {
      console.error(error);
      showAlert("Erro", `Erro ao remover ${deleteTarget.type}. Verifique se existem vínculos.`);
    } finally {
      setDeleteTarget(null);
    }
  };

  // --- UTILS ---
  const showAlert = (title: string, msg: string) => setAlertInfo({ open: true, title, msg });
  
  // 1. Filtragem
  const filteredBooks = livros.filter(b => {
    const matchesSearch = b.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         b.autor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = !filterCategoria || b.categorias?.includes(filterCategoria as EnumCategoria);
    
    return matchesSearch && matchesCategoria;
  });
  
  const filteredUsers = usuarios.filter(u => 
    u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Ordenação
  const sortData = <T extends Book | UserAdminDTO>(data: T[]): T[] => {
    const sorted = [...data];
    
    if (activeTab === 'livros') {
      const books = sorted as Book[];
      switch (sortBy) {
        case 'id-asc':
          return books.sort((a, b) => a.id - b.id) as T[];
        case 'id-desc':
          return books.sort((a, b) => b.id - a.id) as T[];
        case 'titulo-asc':
          return books.sort((a, b) => a.titulo.localeCompare(b.titulo)) as T[];
        case 'titulo-desc':
          return books.sort((a, b) => b.titulo.localeCompare(a.titulo)) as T[];
        default:
          return sorted;
      }
    } else {
      const users = sorted as UserAdminDTO[];
      switch (sortBy) {
        case 'id-asc':
          return users.sort((a, b) => a.id - b.id) as T[];
        case 'id-desc':
          return users.sort((a, b) => b.id - a.id) as T[];
        case 'nome-asc':
          return users.sort((a, b) => (a.nome || '').localeCompare(b.nome || '')) as T[];
        case 'nome-desc':
          return users.sort((a, b) => (b.nome || '').localeCompare(a.nome || '')) as T[];
        default:
          return sorted;
      }
    }
  };

  // 3. Lógica de Paginação
  const sortedData = activeTab === 'livros' 
    ? sortData(filteredBooks) 
    : sortData(filteredUsers);
  
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button 
              onClick={() => setActiveTab('livros')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'livros' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <BookOpen size={18} /> Livros
            </button>
            <button 
              onClick={() => setActiveTab('usuarios')}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${activeTab === 'usuarios' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users size={18} /> Usuários
            </button>
          </div>
        </div>

        {/* BARRA DE FERRAMENTAS */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          {/* Linha 1: Pesquisa e Ordenação */}
          <div className="flex justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Campo de Pesquisa */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder={`Pesquisar ${activeTab}...`} 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filtro de Ordenação */}
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-all min-w-[180px]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                    appearance: 'none'
                  }}
                >
                  {activeTab === 'livros' ? (
                    <>
                      <option value="id-asc">ID Crescente</option>
                      <option value="id-desc">ID Decrescente</option>
                      <option value="titulo-asc">Título (A-Z)</option>
                      <option value="titulo-desc">Título (Z-A)</option>
                    </>
                  ) : (
                    <>
                      <option value="id-asc">ID Crescente</option>
                      <option value="id-desc">ID Decrescente</option>
                      <option value="nome-asc">Nome (A-Z)</option>
                      <option value="nome-desc">Nome (Z-A)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {activeTab === 'livros' && (
              <button 
                onClick={openNewBook}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors whitespace-nowrap shadow-sm hover:shadow-md"
              >
                <Plus size={20} /> Novo Livro
              </button>
            )}
          </div>

          {/* Linha 2: Filtros Adicionais (apenas para Livros) */}
          {activeTab === 'livros' && (
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <Filter size={16} className="text-gray-400" />
                Filtro:
              </div>
              
              {/* Filtro por Categoria */}
              <div className="relative flex-1 max-w-xs">
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:bg-gray-50 transition-all"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                    appearance: 'none'
                  }}
                >
                  <option value="">Todas as categorias</option>
                  {Object.entries(CATEGORIA_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Botão Limpar Filtros */}
              {filterCategoria && (
                <button
                  onClick={() => setFilterCategoria('')}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1 font-medium"
                >
                  <X size={14} /> Limpar
                </button>
              )}
            </div>
          )}
        </div>

        {/* CONTEÚDO - TABELAS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          {loading ? (
            <div className="p-12 flex justify-center text-blue-600"><Loader2 className="animate-spin" size={32} /></div>
          ) : activeTab === 'livros' ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Capa</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Título / Autor</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Categoria</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(paginatedData as Book[]).map(book => (
                      <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-500">#{book.id}</td>
                        <td className="px-6 py-4">
                          <img src={book.capa || 'https://via.placeholder.com/150'} alt="" className="h-12 w-8 object-cover rounded shadow-sm" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{book.titulo}</div>
                          <div className="text-sm text-gray-500">{book.autor} ({book.ano})</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {book.categorias?.slice(0, 2).map(cat => (
                              <span key={cat} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full">
                                {CATEGORIA_LABELS[cat] || cat}
                              </span>
                            ))}
                            {(book.categorias?.length || 0) > 2 && <span className="text-xs text-gray-400">+{book.categorias!.length - 2}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end items-center gap-2">
                            <button onClick={() => openEditBook(book)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Editar">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => openDeleteBookModal(book.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Excluir">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedData.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhum livro encontrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Usuário</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Permissão</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(paginatedData as UserAdminDTO[]).map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-500">#{user.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{user.nome}</td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end items-center gap-2">
                            <button onClick={() => openDeleteUserModal(user.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Banir Usuário">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedData.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-500">Nenhum usuário encontrado.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* RODAPÉ DE PAGINAÇÃO */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                <button 
                    onClick={handlePreviousPage} 
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} /> Anterior
                </button>
                
                <span className="text-sm text-gray-600 font-medium">
                    Página {currentPage} de {totalPages}
                </span>

                <button 
                    onClick={handleNextPage} 
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Próxima <ChevronRight size={16} />
                </button>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL DE CRIAÇÃO/EDIÇÃO DE LIVRO --- */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">{editingBook ? 'Editar Livro' : 'Novo Livro'}</h2>
              <button onClick={() => setShowBookModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            {/* Loader condicional para o formulário */}
            {formLoading ? (
                <div className="p-20 flex flex-col items-center justify-center text-blue-600">
                    <Loader2 className="animate-spin mb-2" size={40} />
                    <p className="text-sm text-gray-500">Carregando detalhes do livro...</p>
                </div>
            ) : (
                <form onSubmit={handleSaveBook} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Título</label>
                    <input required type="text" value={bookForm.titulo} onChange={e => setBookForm({...bookForm, titulo: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Autor</label>
                    <input required type="text" value={bookForm.autor} onChange={e => setBookForm({...bookForm, autor: e.target.value})} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Ano</label>
                    <input type="number" value={bookForm.ano} onChange={e => setBookForm({...bookForm, ano: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div className="col-span-2 space-y-1">
                    <label className="text-sm font-medium text-gray-700">URL da Capa</label>
                    <input type="text" value={bookForm.capa} onChange={e => setBookForm({...bookForm, capa: e.target.value})} className="w-full p-2 border rounded-lg" placeholder="https://..." />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Categoria Principal</label>
                    <select 
                    className="w-full p-2 border rounded-lg bg-white"
                    value={bookForm.categorias?.[0] || ''}
                    onChange={(e) => {
                        const val = e.target.value as EnumCategoria;
                        setBookForm({ ...bookForm, categorias: val ? [val] : [] });
                    }}
                    >
                    <option value="">Selecione uma categoria...</option>
                    {Object.entries(CATEGORIA_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                    </select>
                    <p className="text-xs text-gray-500">O sistema atualmente suporta a seleção de uma categoria principal via painel.</p>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Sinopse</label>
                    <textarea 
                        rows={5} 
                        value={bookForm.sinopse || ''} 
                        onChange={e => setBookForm({...bookForm, sinopse: e.target.value})} 
                        className="w-full p-2 border rounded-lg" 
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowBookModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2">
                    <Check size={18} /> Salvar Livro
                    </button>
                </div>
                </form>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteAction}
        title={deleteTarget?.type === 'livro' ? 'Excluir Livro' : 'Banir Usuário'}
        message={
          deleteTarget?.type === 'livro'
            ? "Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita e apagará todas as resenhas associadas."
            : "Tem certeza que deseja banir este usuário? Todos os dados dele serão apagados permanentemente."
        }
        isDestructive={true}
        confirmText="Sim, excluir"
        cancelText="Cancelar"
      />

      <AlertModal 
        isOpen={alertInfo.open} onClose={() => setAlertInfo({ ...alertInfo, open: false })}
        title={alertInfo.title} message={alertInfo.msg}
      />
    </div>
  );
};

export default AdminPanel;