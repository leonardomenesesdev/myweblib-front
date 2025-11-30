import axios, { type AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000, // Define um tempo limite (10s) para não travar a tela eternamente
});

// --- Interceptor de Requisição (Saída) ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- Interceptor de Resposta (Chegada) ---
api.interceptors.response.use(
  (response) => response, // Se deu tudo certo, apenas repassa o dado
  (error: AxiosError) => {
    
    // 1. TRATAMENTO DE SERVIÇO INDISPONÍVEL (Backend Off / Sem Internet)
    // O código 'ERR_NETWORK' é gerado pelo Axios quando não há resposta do servidor
    if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
      // Verificação de segurança para evitar loop infinito de redirecionamento
      if (window.location.pathname !== "/unavailable") {
        window.location.href = "/unavailable";
      }
    }
    
    // 2. TRATAMENTO DE SESSÃO EXPIRADA (401/403)
    // Se o backend recusar o token, fazemos logout forçado
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      // Não redireciona se já estivermos no login (evita loop se errar a senha)
      if (window.location.pathname !== "/login") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;