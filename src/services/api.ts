import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // ajuste para o seu backend
});

// Interceptador opcional para token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      // Token inválido ou expirado
      localStorage.removeItem("token");
      // Opcional: window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);
export default api;
