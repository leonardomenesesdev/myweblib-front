import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

export const AlertModal2: React.FC<AlertModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  message,
  type = 'info'
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    success: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      Icon: CheckCircle
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      Icon: AlertCircle
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
      Icon: AlertCircle
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      Icon: Info
    }
  };

  const config = typeConfig[type];
  const IconComponent = config.Icon;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`${config.bgColor} ${config.borderColor} border-b px-6 py-4 rounded-t-xl flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <IconComponent className={config.iconColor} size={24} />
            <h2 className={`text-lg font-bold ${config.textColor}`}>{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className={`${config.textColor} hover:opacity-70 transition-opacity`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2 ${config.buttonColor} text-white rounded-lg font-medium transition-colors`}
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};