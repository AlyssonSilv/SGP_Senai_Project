import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

// Interceptor: Antes de qualquer requisição sair, ele faz isso:
api.interceptors.request.use((config) => {
  // Pega o token que foi salvo no login
  const token = localStorage.getItem('token');
  
  if (token) {
    // Se existir, injeta no cabeçalho Authorization
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;