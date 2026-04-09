import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; 

const Cadastro: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    nomeResponsavel: '',
    cnpj: '',
    email: '',
    senha: '',
    telefone: ''
  });

  // Função para aplicar máscara visual de CNPJ (00.000.000/0000-00)
  const aplicarMascaraCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo que não é dígito
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d{3})(\d)/, '.$1.$2/$3')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substring(0, 18); // Limita ao tamanho do CNPJ formatado
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const payload = {
        razaoSocial: formData.nomeEmpresa,
        nomeResponsavel: formData.nomeResponsavel,
        // 👇 O segredo: enviamos para o banco apenas os números (limpos)
        cnpj: formData.cnpj.replace(/\D/g, ''), 
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone
      };

      await api.post('/api/empresas', payload);
      
      alert('Cadastro realizado com sucesso! O CNPJ foi salvo apenas com números.');
      navigate('/login');

    } catch (error: any) {
      console.error("Erro ao cadastrar empresa:", error);
      
      if (error.response?.status === 403) {
        alert('Erro 403: O Spring Security bloqueou a requisição.');
      } else if (error.response?.status === 400) {
        alert('Erro 400: Dados inválidos ou CNPJ/E-mail já cadastrado.');
      } else {
        alert('Não foi possível conectar ao servidor.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh', padding: '20px' }}>
      <section className="card pad" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="h1" style={{ textAlign: 'center', marginBottom: '10px' }}>Cadastro</div>
        <div className="p" style={{ textAlign: 'center', marginBottom: '20px' }}>
          Crie uma conta para sua empresa
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label htmlFor="nomeEmpresa" className="label">Razão Social</label>
            <input 
              id="nomeEmpresa"
              className="input" 
              placeholder="Nome da sua empresa"
              required 
              value={formData.nomeEmpresa} 
              onChange={e => setFormData({...formData, nomeEmpresa: e.target.value})} 
            />
          </div>

          <div>
            <label htmlFor="nomeResponsavel" className="label">Nome do Responsável</label>
            <input 
              id="nomeResponsavel"
              className="input" 
              placeholder="Nome do gestor ou dono"
              required 
              value={formData.nomeResponsavel} 
              onChange={e => setFormData({...formData, nomeResponsavel: e.target.value})} 
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label htmlFor="cnpjCadastro" className="label">CNPJ</label>
              <input 
                id="cnpjCadastro"
                className="input" 
                placeholder="00.000.000/0000-00" 
                required 
                value={formData.cnpj} 
                // 👇 Aplica a máscara enquanto o usuário digita
                onChange={e => setFormData({...formData, cnpj: aplicarMascaraCNPJ(e.target.value)})} 
              />
            </div>

            <div>
              <label htmlFor="telefoneCadastro" className="label">Telefone</label>
              <input 
                id="telefoneCadastro"
                className="input" 
                placeholder="(99) 99999-9999" 
                required 
                value={formData.telefone} 
                onChange={e => setFormData({...formData, telefone: e.target.value})} 
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="emailCadastro" className="label">E-mail Corporativo</label>
            <input 
              id="emailCadastro"
              className="input" 
              type="email" 
              placeholder="email@empresa.com"
              required 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div>
            <label htmlFor="senhaCadastro" className="label">Senha</label>
            <input 
              id="senhaCadastro"
              className="input" 
              type="password" 
              placeholder="No mínimo 6 caracteres" 
              required 
              value={formData.senha} 
              onChange={e => setFormData({...formData, senha: e.target.value})} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <button className="btn primary" type="submit" style={{ width: '100%' }}>
              Cadastrar Empresa
            </button>
            <Link className="btn ghost" to="/login" style={{ textAlign: 'center', textDecoration: 'none' }}>
              Já tenho cadastro
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Cadastro;