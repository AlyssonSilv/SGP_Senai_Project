import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  // CONFIGURAÇÃO CRÍTICA: Permite o envio e recebimento automático de Cookies HTTP-Only
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

// Interceptor de Resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (Não Autorizado) e ainda não tentamos dar retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Dispara a rota de refresh. Não precisamos enviar NADA no body.
        // O Axios enviará automaticamente o cookie "refreshToken".
        await axios.post(
          'http://localhost:3000/api/login/refresh', 
          {}, 
          { withCredentials: true }
        );

        // Se chegou aqui, o refresh funcionou (novo cookie accessToken foi definido no navegador)
        processQueue(null);
        
        // Refaz a requisição original que tinha falhado, agora com o novo cookie
        return api(originalRequest);

      } catch (refreshError) {
        // Se o refresh falhar (ex: refreshToken expirado), rejeita as requisições pendentes
        processQueue(refreshError);
        
        // Limpa o estado de login visual e redireciona para a tela de login
        localStorage.removeItem('empresa_logada');
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;