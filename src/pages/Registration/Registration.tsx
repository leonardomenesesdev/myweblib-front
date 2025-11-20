import { BookOpen, Mail, Lock, User } from 'lucide-react';
import { GlassForm, type FormField } from '../../components/GlassForm';
import { Link } from 'react-router-dom';
import type { RegisterRequest } from "../../types/User";
import { registerUser } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Registration: React.FC = () => {


const [errorMessage, setErrorMessage] = useState("");
const navigate = useNavigate();

  const registerFields: FormField[] = [
    {
      name: 'name',
      type: 'text',
      placeholder: 'Nome completo',
      icon: <User className="w-5 h-5 text-white/60" />,
      validation: (value) => {
        if (!value.trim()) return 'Nome é obrigatório';
        return null;
      }
    },
    {
      name: 'email',
      type: 'email',
      placeholder: 'E-mail institucional',
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
    {
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirmar senha',
      icon: <Lock className="w-5 h-5 text-white/60" />,
      validation: (value, allValues) => {
        if (value !== allValues?.password) return 'As senhas não coincidem';
        return null;
      }
    }
  ];

async function handleRegister(values: any) {
  const payload: RegisterRequest = {
    nome: values.name,
    email: values.email,
    password: values.password,
  };

  try {
    setErrorMessage(""); // limpa erro antes de enviar
    
    const response = await registerUser(payload);
    console.log("Usuário criado:", response);

    // redireciona para login
    navigate("/login");

  } catch (error: any) {
    // se vier do Axios
    if (error.response) {
      if (error.response.status === 409) {
        setErrorMessage("E-mail já está em utilização.");
      } else {
        setErrorMessage("Erro ao registrar usuário.");
      }
    } else {
      setErrorMessage("Falha de conexão com o servidor.");
    }

    console.error("Erro ao registrar usuário:", error);
  }
}


  const footerContent = (
    <p className="text-white/80 text-sm">
      Já tem uma conta?{' '}
      <Link to={"/login"} className="font-semibold text-white hover:underline">
        Fazer login
      </Link>
    </p>
  );

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-linear-to-br from-blue-700 via-blue-800 to-slate-900" />

      <div className="relative w-full max-w-md">
        {errorMessage && (
  <p className="text-red-400 text-center mb-4">{errorMessage}</p>
)}

        <GlassForm
          title="Criar Conta"
          subtitle="Junte-se ao Clube do Livro Unifor"
          icon={<BookOpen className="w-8 h-8 text-white" />}
          fields={registerFields}
          onSubmit={handleRegister}
          submitButtonText="Criar Conta"
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

export default Registration;
