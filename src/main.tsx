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

  // GRUPO 2: Rotas da Aplicação (Com Header Global)
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      {
        index: true, // Isso significa: rota "/"
        element: <HomePage />
      },
      {
        path: "livro/:id", 
        element: <BookDetailsPage />
      },
        {
        path: "perfil", 
        element: <UserProfilePage />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)