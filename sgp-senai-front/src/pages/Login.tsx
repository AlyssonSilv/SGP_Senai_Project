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

    try {
      // 1. Dispara a requisição para a rota de autenticação
      const response = await api.post('/login', { cnpj, senha });

      // 2. Extrai os dados validados do DTO que o Spring Boot retornou
      const { token, id, razaoSocial, email } = response.data;

      // 3. Salva o Token isoladamente (para o Interceptor do api.ts usar no Header)
      localStorage.setItem('token', token);

      // 4. Salva as informações da empresa (sem a senha) para exibição na Sidebar/TopBar
      localStorage.setItem('empresa_logada', JSON.stringify({
        id,
        razaoSocial,
        cnpj,
        email
      }));

      // 5. Redireciona para o sistema
      navigate('/dashboard');

    } catch (error) {
      console.error("Erro no login:", error);
      setErro("CNPJ ou senha inválidos. Verifique as credenciais e tente novamente.");
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
      backgroundColor: 'var(--bg-color, #121212)' // Fallback para tema escuro
    }}>
      <div className="card pad" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: 'var(--text-color, #fff)' }}>Acesso Empresarial</h2>
          <p style={{ color: 'var(--text-muted, #aaa)', marginTop: '8px' }}>
            SENAI • Solicitação de Treinamentos
          </p>
        </div>

        {/* Mensagem de Erro Condicional */}
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