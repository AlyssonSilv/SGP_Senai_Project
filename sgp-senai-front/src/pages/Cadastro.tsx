import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Importação do nosso serviço de API

const Cadastro: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    cnpj: '',
    email: '',
    senha: '',
    nomeResponsavel: '',
    telefone: ''
  });

  // Função de envio atualizada para conversar com o Java/Spring Boot
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // MAPEAMENTO: Ajustamos as chaves para baterem com a Entidade 'Empresa' do Java
      const payload = {
        razaoSocial: formData.nomeEmpresa, // 'nomeEmpresa' vira 'razaoSocial'
        cnpj: formData.cnpj,
        email: formData.email,
        senha: formData.senha,
        nomeResponsavel: formData.nomeResponsavel,
        telefone: formData.telefone
      };

      // Chamada POST para o endpoint /api/empresas
      await api.post('/empresas', payload);
      
      alert('Cadastro realizado com sucesso! Os dados já estão salvos no Neon.');
      navigate('/login');

    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error);
      alert('Ops! Não conseguimos salvar. O servidor Java está ligado na porta 3000?');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh' }}>
      <section className="card pad" style={{ width: '100%', maxWidth: '720px' }}>
        <div className="h1">Cadastro da Empresa</div>
        <div className="p">Preencha os dados. Ao finalizar, você voltará ao <b>Login</b>.</div>
        
        <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '20px' }}>
          
          <div style={{ gridColumn: 'span 2' }}>
            <label htmlFor="nomeEmpresa" className="label">Nome da Empresa (Razão Social)</label>
            <input 
              id="nomeEmpresa"
              className="input" 
              placeholder="Ex: Indústria XYZ Ltda"
              title="Digite a razão social da empresa"
              required 
              value={formData.nomeEmpresa} 
              onChange={e => setFormData({...formData, nomeEmpresa: e.target.value})} 
            />
          </div>
          
          <div>
            <label htmlFor="cnpjCadastro" className="label">CNPJ</label>
            <input 
              id="cnpjCadastro"
              className="input" 
              placeholder="00.000.000/0001-00" 
              title="Digite o CNPJ da empresa"
              required 
              value={formData.cnpj} 
              onChange={e => setFormData({...formData, cnpj: e.target.value})} 
            />
          </div>
          
          <div>
            <label htmlFor="emailCadastro" className="label">E-mail Corporativo</label>
            <input 
              id="emailCadastro"
              className="input" 
              type="email" 
              placeholder="contato@empresa.com.br"
              title="Digite o e-mail corporativo"
              required 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label htmlFor="senhaCadastro" className="label">Crie uma Senha</label>
            <input 
              id="senhaCadastro"
              className="input" 
              type="password" 
              placeholder="Mínimo de 6 caracteres" 
              title="Crie uma senha de acesso"
              required 
              value={formData.senha} 
              onChange={e => setFormData({...formData, senha: e.target.value})} 
            />
          </div>

          <div>
            <label htmlFor="nomeResponsavel" className="label">Nome do Responsável</label>
            <input 
              id="nomeResponsavel"
              className="input" 
              placeholder="Nome completo"
              title="Digite o nome do responsável"
              required 
              value={formData.nomeResponsavel} 
              onChange={e => setFormData({...formData, nomeResponsavel: e.target.value})} 
            />
          </div>
          
          <div>
            <label htmlFor="telefoneContato" className="label">Telefone de Contato</label>
            <input 
              id="telefoneContato"
              className="input" 
              placeholder="(99) 99999-9999" 
              title="Digite o telefone com DDD"
              required 
              value={formData.telefone} 
              onChange={e => setFormData({...formData, telefone: e.target.value})} 
            />
          </div>
          
          <div className="actions" style={{ gridColumn: 'span 2', marginTop: '10px' }}>
            <button className="btn primary" type="submit">Salvar Cadastro</button>
            <Link className="btn ghost" to="/login">Voltar ao Login</Link>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Cadastro;