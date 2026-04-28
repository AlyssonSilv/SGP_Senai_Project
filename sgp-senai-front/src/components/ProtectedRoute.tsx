import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  // Consumimos o contexto que criámos
  const { usuario, loading } = useContext(AuthContext);

  // 1. Fase de Verificação: O Axios está a ir ao backend validar o Cookie HTTP-Only
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#666' }}>
        <p>A validar sessão segura...</p>
      </div>
    );
  }

  // 2. Fase de Decisão: Backend respondeu, mas não temos um utilizador válido (Sem cookie ou cookie expirado)
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // 3. Fase de Sucesso: Utilizador autenticado! Renderiza o ecrã solicitado.
  return <>{children}</>;
};

export default ProtectedRoute;