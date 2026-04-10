import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login: React.FC = () => {
  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    const cnpjLimpo = cnpj.replace(/\D/g, '');

    try {
      // Chamada para a API que agora retorna token e refreshToken
      const response = await api.post('/login', { cnpj: cnpjLimpo, senha });
      
      // REFATORADO: Extraindo o refreshToken do corpo da resposta
      const { token, refreshToken, id, razaoSocial, email } = response.data;

      // Armazenamento para persistência e uso pelos interceptors
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken); //Salva o token de renovação
      
      localStorage.setItem('empresa_logada', JSON.stringify({
        id,
        razaoSocial,
        cnpj: cnpjLimpo,
        email
      }));

      navigate('/dashboard');
    } catch (error: any) {
      console.error("Erro no login:", error);

      // REFATORADO: Tratamento de erros baseado nos status que configuramos no backend
      if (error.response) {
        if (error.response.status === 401) {
          setErro("CNPJ ou senha incorretos.");
        } else if (error.response.status === 429) {
          // Captura a mensagem do RateLimitingFilter (bloqueio por excesso de tentativas)
          setErro(error.response.data || "Muitas tentativas seguidas. Aguarde um momento.");
        } else {
          setErro("Ocorreu um erro inesperado no servidor.");
        }
      } else {
        setErro("Não foi possível conectar ao servidor. Verifique sua internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-color, #121212)'
    }}>
      <div className="card pad" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: 'var(--text-color, #fff)' }}>Acesso Empresarial</h2>
          <p style={{ color: 'var(--text-muted, #aaa)', marginTop: '8px' }}>
            SENAI • Solicitação de Treinamentos
          </p>
        </div>

        {erro && (
          <div style={{
            backgroundColor: 'rgba(255, 68, 68, 0.1)',
            color: '#ff4444',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '16px',
            border: '1px solid rgba(255, 68, 68, 0.3)',
            fontSize: '14px'
          }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              CNPJ da Empresa
            </label>
            <input
              type="text"
              className="input"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="Ex: 00.000.000/0000-00"
              required
              style={{ width: '100%', padding: '10px' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              Senha
            </label>
            <input
              type="password"
              className="input"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
              style={{ width: '100%', padding: '10px' }}
            />
          </div>

          <button
            type="submit"
            className="btn primary"
            style={{ width: '100%', padding: '12px' }}
            disabled={loading}
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
          <Link to="/cadastro" style={{ color: '#007bff', textDecoration: 'none' }}>
            Primeiro acesso? Cadastre sua empresa
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;