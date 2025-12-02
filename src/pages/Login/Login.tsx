import React, { useState } from 'react';
import { BookOpen, Mail, Lock } from 'lucide-react';
import { GlassForm, type FormField } from '../../components/GlassForm';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, setAuthToken, setUserData } from "../../services/userService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const loginFields: FormField[] = [
    {
      name: 'email',
      type: 'email',
      placeholder: 'E-mail',
      icon: <Mail className="w-5 h-5 text-white/60" />,
      validation: (value) => {
        if (!value.trim()) return 'E-mail é obrigatório';
        // Regex simples para garantir formato básico de email
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

  // Lógica real de integração
  async function handleLogin(values: any) {
    setErrorMessage(""); // Limpa erros anteriores

    try {
      const response = await loginUser({
        email: values.email,
        password: values.password, 
      } as any);

      const token = response.data.token;
      const id = response.data.id;

      setAuthToken(token);
      setUserData({ id });
      navigate("/"); // Redireciona para a Home
      
    } catch (error: any) {
      console.error("Erro no login:", error);
      
      if (error.response) {
        if (error.response.status === 403 || error.response.status === 401) {
          setErrorMessage("E-mail ou senha incorretos.");
        } else {
          setErrorMessage("Erro ao processar login. Tente novamente.");
        }
      } else if (error.code === "ERR_NETWORK") {
        setErrorMessage("Sem conexão com o servidor.");
      } else {
        setErrorMessage("Ocorreu um erro inesperado.");
      }
    }
  }

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
      <div className="absolute inset-0 bg-linear-to-br from-blue-700 via-blue-800 to-slate-900" />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative w-full max-w-md z-10">
        
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg mb-4 text-center backdrop-blur-sm animate-fade-in">
            {errorMessage}
          </div>
        )}

        <GlassForm
          title="Fazer Login"
          subtitle="Que bom te ter de volta!"
          icon={<BookOpen className="w-8 h-8 text-white" />}
          fields={loginFields}
          onSubmit={handleLogin}
          submitButtonText="Fazer login"
          footerContent={footerContent}
        />

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