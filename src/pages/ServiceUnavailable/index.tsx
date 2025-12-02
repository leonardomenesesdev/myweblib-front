import React from 'react';
import { WifiOff, RefreshCw, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceUnavailable: React.FC = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.href = '/';
  };

  const handleLogin = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-black" />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
        
        <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
          <WifiOff className="w-10 h-10 text-red-200" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Sistema Indisponível
        </h1>
        
        <p className="text-white/70 mb-8 leading-relaxed">
          Não conseguimos conectar ao servidor. O backend pode estar desligado ou você está sem internet.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar Novamente
          </button>

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-medium transition-all"
          >
            <LogIn className="w-5 h-5" />
            Voltar para Login
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-white/40 text-xs font-mono">
            Error Code: ERR_CONNECTION_REFUSED
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceUnavailable;