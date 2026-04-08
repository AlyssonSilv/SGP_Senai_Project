import React from 'react';
import { useParams, Link } from 'react-router-dom';

const DetalheSolicitacao: React.FC = () => {
  // O useParams pega o ID que passaremos na URL (ex: /detalhe/CTE-123)
  const { id } = useParams();

  return (
    <section className="card pad" style={{ maxWidth: '800px' }}>
      <div className="h1">Detalhes da Solicitação</div>
      <div className="p">Visualizando os dados do protocolo: <strong>{id}</strong></div>

      <div style={{ marginTop: '20px', padding: '16px', border: '1px solid var(--line)', borderRadius: '12px' }}>
        <p><strong>Treinamento:</strong> Operação de Empilhadeira</p>
        <p><strong>Status:</strong> <span className="badge">Nova</span></p>
        <p><strong>Quantidade de Participantes:</strong> 5</p>
        <p><strong>Data Sugerida:</strong> 15/04/2026</p>
        
        <div style={{ marginTop: '16px' }}>
          <strong>Lista de Nomes:</strong>
          <ul style={{ color: 'var(--muted)', marginTop: '8px' }}>
            <li>João da Silva</li>
            <li>Maria Oliveira</li>
            <li>Carlos Eduardo</li>
          </ul>
        </div>
      </div>

      <div className="actions" style={{ marginTop: '20px' }}>
        <Link to="/lista" className="btn secondary">Voltar para a Lista</Link>
      </div>
    </section>
  );
};

export default DetalheSolicitacao;  