import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api'; // Importamos a nossa ponte com o Java

const Login: React.FC = () => {
  const [cnpj, setCnpj] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  // Função de Login conectada ao Backend
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Enviamos os dados para o endpoint que criamos no Java
      const response = await api.post('/login', { cnpj, senha });
      
      // 2. Se deu certo, guardamos os dados da empresa (incluindo o ID) no navegador
      // Isso é essencial para as telas de "Nova Solicitação" saberem quem é o dono do pedido
      localStorage.setItem('empresa_logada', JSON.stringify(response.data));
      
      alert(`Bem-vindo, ${response.data.razaoSocial}!`);
      
      // 3. Navegamos para o Dashboard
      navigate('/dashboard');

    } catch (error: any) {
      // 4. Se o Java retornar 401 (Não autorizado), caímos aqui
      console.error("Erro no login:", error);
      alert('CNPJ ou Senha incorretos. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh' }}>
      <section className="card pad" style={{ width: '100%', maxWidth: '520px' }}>
        <div className="h1">Login</div>
        <div className="p">Acesso somente para empresas <b>já cadastradas</b>. Use CNPJ e Senha.</div>
        
        <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
          <label htmlFor="cnpjLogin" className="label">CNPJ</label>
          <input 
            id="cnpjLogin"
            className="input" 
            placeholder="00.000.000/0001-00" 
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            required
          />
          
          <label htmlFor="senhaLogin" className="label">Senha</label>
          <input 
            id="senhaLogin"
            className="input" 
            type="password" 
            placeholder="Sua senha secreta"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          
          <div className="actions" style={{ marginTop: '24px' }}>
            <button type="submit" className="btn accent">Entrar</button>
            <Link to="/cadastro" className="btn secondary">Cadastrar Empresa</Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;