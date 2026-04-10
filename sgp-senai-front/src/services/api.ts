import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor de Requisição: Adiciona o Token no cabeçalho
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Resposta: Trata a renovação se o Token expirar
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (Não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Tenta renovar o token chamando o novo endpoint do backend
          const response = await axios.post('http://localhost:3000/api/login/refresh', {
            refreshToken,
          });

          const { token: novoToken } = response.data;

          // Salva o novo token e atualiza a requisição original
          localStorage.setItem('token', novoToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${novoToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${novoToken}`;

          return api(originalRequest); // Repete a requisição que deu erro
        } catch (refreshError) {
          // Se o refresh falhar (refresh token expirou), desloga o usuário
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;