import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Importamos a nossa ponte com o Java

const NovaSolicitacao: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    treinamento: 'Operação de Empilhadeira',
    quantidade: 5,
    listaParticipantes: '',
    dataSugerida: '',
    treinamentoOutros: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Validação simples
    if (!formData.listaParticipantes.trim()) {
      alert('Insira os nomes dos colaboradores.');
      return;
    }

    try {
      // 2. Recuperamos a empresa logada do localStorage
      const empresaStorage = localStorage.getItem('empresa_logada');
      if (!empresaStorage) {
        alert("Sessão expirada. Por favor, faça login novamente.");
        navigate('/login');
        return;
      }

      const empresa = JSON.parse(empresaStorage);

      // 3. Montamos o payload para o Java
      // Note que 'quantidade' vira 'quantidadeParticipantes' para bater com a Entity
      const payload = {
        treinamento: formData.treinamento,
        treinamentoOutros: formData.treinamentoOutros,
        quantidadeParticipantes: formData.quantidade,
        listaParticipantes: formData.listaParticipantes,
        dataSugerida: formData.dataSugerida,
        status: "Nova",
        empresa: { id: empresa.id } // Aqui fazemos o vínculo relacional!
      };

      // 4. Enviamos para o endpoint /api/solicitacoes
      await api.post('/solicitacoes', payload);

      alert('Solicitação enviada com sucesso! O protocolo foi gerado pelo sistema.');
      navigate('/lista'); // Redireciona para a tabela de solicitações

    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      alert('Erro ao processar solicitação. Verifique se o servidor Java está ativo.');
    }
  };

  return (
    <section className="card pad" style={{ maxWidth: '980px' }}>
      <div className="h1">Nova Solicitação</div>
      
      <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '20px' }}>
        
        <div>
          <label htmlFor="treinamento" className="label">Treinamento</label>
          <select 
            id="treinamento"
            className="select" 
            title="Selecione o treinamento desejado"
            required
            value={formData.treinamento}
            onChange={e => setFormData({...formData, treinamento: e.target.value})}
          >
            <option value="Operação de Empilhadeira">Operação de Empilhadeira</option>
            <option value="NR 20">NR 20</option>
            <option value="Prevenção de Quedas/NR35">Prevenção de Quedas/NR35</option>
            <option value="Outros (especificar)">Outros (especificar)</option>
          </select>
        </div>

        <div>
          <label htmlFor="quantidade" className="label">Quantidade de Participantes</label>
          <input 
            id="quantidade"
            className="input" 
            type="number" 
            min="1" 
            title="Informe a quantidade de alunos"
            required 
            value={formData.quantidade}
            onChange={e => setFormData({...formData, quantidade: parseInt(e.target.value)})}
          />
        </div>

        <div style={{ gridColumn: 'span 2' }}>
          <label htmlFor="listaParticipantes" className="label">Lista de Participantes (nome por linha)</label>
          <textarea 
            id="listaParticipantes"
            className="textarea" 
            placeholder="Nome 1&#10;Nome 2&#10;Nome 3"
            title="Digite um nome por linha"
            required
            value={formData.listaParticipantes}
            onChange={e => setFormData({...formData, listaParticipantes: e.target.value})}
          ></textarea>
        </div>

        <div>
          <label htmlFor="dataSugerida" className="label">Data sugerida</label>
          <input 
            id="dataSugerida"
            className="input" 
            type="date" 
            title="Selecione uma data sugerida"
            required 
            value={formData.dataSugerida}
            onChange={e => setFormData({...formData, dataSugerida: e.target.value})}
          />
        </div>

        {formData.treinamento === 'Outros (especificar)' && (
          <div>
            <label htmlFor="treinamentoOutros" className="label">Outros (especificar)</label>
            <input 
              id="treinamentoOutros"
              className="input" 
              placeholder="Descreva o treinamento"
              title="Especifique o treinamento"
              required
              value={formData.treinamentoOutros}
              onChange={e => setFormData({...formData, treinamentoOutros: e.target.value})}
            />
          </div>
        )}

        <div style={{ gridColumn: 'span 2', marginTop: '10px' }} className="actions">
          <Link to="/dashboard" className="btn secondary">Cancelar</Link>
          <button className="btn primary" type="submit">Enviar Solicitação</button>
        </div>
      </form>
    </section>
  );
};

export default NovaSolicitacao;