import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { MainLayout } from './MainLayout';
import Login from './pages/Login/Login.tsx';
import Registration from './pages/Registration/Registration.tsx';
import HomePage from './pages/HomePage/index.tsx';
import BookDetailsPage from './pages/BookDetailsPage/index.tsx';
import UserProfilePage from './pages/UserProfile/index.tsx';

// CORREÇÃO 1: Remova o '/index.tsx' do final. O sistema de build resolve isso automaticamente.
import AdminPanel from './pages/AdminPanel'; 
import OtherUserProfile from './pages/OtherUserProfile/index.tsx';
import ServiceUnavailable from './pages/ServiceUnavailable/index.tsx';

const router = createBrowserRouter([
  // GRUPO 1: Rotas Públicas (Login/Cadastro sem Header)
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/registro",
    element: <Registration />
  },
    {
    path: "/unavailable",
    element: <ServiceUnavailable />
  },

  // GRUPO 2: Rotas da Aplicação (Com Header Global)
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      {
        index: true, // Rota "/"
        element: <HomePage />
      },
      {
        path: "livro/:id", // Rota relativa (sem / no início)
        element: <BookDetailsPage />
      },
      {
        path: "perfil", 
        element: <UserProfilePage />
      },
      // CORREÇÃO 2: Remova a barra '/' do início.
      // O caminho final será combinado com o pai: "/" + "admin/painel" = "/admin/painel"
      {
        path: "admin/painel",
        element: <AdminPanel />
      },
      {
        path: "perfil/:id",
        element: <OtherUserProfile />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)