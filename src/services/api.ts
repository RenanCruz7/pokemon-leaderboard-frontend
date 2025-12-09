import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // Adiciona token se existir (backend decide se é necessário)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    // Token expirado ou inválido
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Apenas redireciona se não estiver em páginas públicas
      const publicPaths = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
      const currentPath = window.location.pathname;
      
      if (!publicPaths.includes(currentPath) && !currentPath.startsWith('/run/')) {
        window.location.href = '/login';
      }
    }
    
    // Forbidden - pode ser falta de permissão ou token inválido
    if (status === 403) {
      // Se está tentando acessar uma rota protegida sem token
      const token = localStorage.getItem('token');
      if (!token) {
        // Não redireciona, apenas deixa o componente lidar com o erro
        console.log('Access denied - authentication may be required');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
