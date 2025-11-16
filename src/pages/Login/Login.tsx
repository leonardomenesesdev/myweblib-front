import React from 'react';
import { BookOpen, Mail, Lock } from 'lucide-react';
import { GlassForm, type FormField } from '../../components/GlassForm'; // IMPORTAR a interface
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const loginFields: FormField[] = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'E-mail',
      icon: <Mail className="w-5 h-5 text-white/60" />,
      validation: (value) => {
        if (!value.trim()) return 'E-mail é obrigatório';
        if (!/\S+@\S+\.\S+/.test(value)) return 'E-mail inválido';
        return null;
      }
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Senha',
      icon: <Lock className="w-5 h-5 text-white/60" />,
      validation: (value) => {
        if (!value) return 'Senha é obrigatória';
        if (value.length < 6) return 'Senha deve ter no mínimo 6 caracteres';
        return null;
      }
    },
  ];

  const handleRegister = (data: Record<string, string>) => {
    console.log('Login realizado:', data);
    alert('Login realizado com sucesso!');
  };

  // Conteúdo do footer (link para login)
  const footerContent = (
    <p className="text-white/80 text-sm">
      Ainda não tem uma conta?{' '}
      <Link to={"/registro"} className="font-semibold text-white hover:underline">
        Criar conta
      </Link>
    </p>
  );

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
      {/* Background gradiente azul Unifor */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-700 via-blue-800 to-slate-900" />
      
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Container principal */}
      <div className="relative w-full max-w-md">
        {/* Componente GlassForm reutilizável */}
        <GlassForm
          title="Fazer Login"
          subtitle="Que bom te ter de volta!"
          icon={<BookOpen className="w-8 h-8 text-white" />}
          fields={loginFields}
          onSubmit={handleRegister}
          submitButtonText="Fazer login"
          footerContent={footerContent}
        />

        {/* Texto institucional */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-xs">
            © 2025 Universidade de Fortaleza - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;