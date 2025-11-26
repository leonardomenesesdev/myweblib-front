import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean; // Se true, o botão de confirmação fica vermelho (para ações de deletar/banir)
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Confirmar", 
  cancelText = "Cancelar", 
  isDestructive = false
}) => {
  if (!isOpen) return null;

  return (
    // Z-Index 60 para garantir que fique acima de outros modais (como o de cadastro que geralmente é 40 ou 50)
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 relative">
        
        {/* Botão X para fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 rounded-full flex-shrink-0 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
          </div>
          
          <p className="text-gray-600 mb-8 ml-1 leading-relaxed">{message}</p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose(); // Fecha o modal automaticamente ao confirmar
              }}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${
                isDestructive 
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};