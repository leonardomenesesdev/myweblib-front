import axios, { type AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response, 
  (error: AxiosError) => {
    if (error.code === "ERR_NETWORK" || error.message.includes("Network Error")) {
      if (window.location.pathname !== "/unavailable") {
        window.location.href = "/unavailable";
      }
    }
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
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