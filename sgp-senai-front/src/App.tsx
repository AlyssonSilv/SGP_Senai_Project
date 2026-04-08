import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import NovaSolicitacao from './pages/NovaSolicitacao';
import ListaSolicitacoes from './pages/ListaSolicitacoes';
import DetalheSolicitacao from './pages/DetalheSolicitacao'; // <-- Importação Nova
import Usuarios from './pages/Usuarios';
import ProtectedRoute from './components/ProtectedRoute';

import './index.css';

function App() {
  // Estado para controlar se o tema escuro está ativo
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Esse efeito coloca ou tira o atributo 'data-theme' da raiz do HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main">
          {/* Barra Superior com o botão de Tema */}
          <div className="top">
            <div className="bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="title">SENAI • Solicitação de Treinamentos</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Botão de Tema Claro/Escuro */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="btn ghost"
                  style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '6px 12px' }}
                >
                  {isDarkMode ? '☀️ Claro' : '🌙 Escuro'}
                </button>
                <div className="user">Usuário em Teste</div>
              </div>
            </div>
            <div className="accent"></div>
          </div>

          <div className="wrap">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/nova" element={<NovaSolicitacao />} />
              <Route path="/lista" element={<ListaSolicitacoes />} />
              <Route path="/usuarios" element={<Usuarios />} />

              {/* ROTA NOVA: O ":id" avisa ao React que essa parte da URL é variável */}
              <Route path="/detalhe/:id" element={<DetalheSolicitacao />} />

              <Route path="/" element={<Navigate to="/login" />} />


              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              <Route path="/lista" element={
                <ProtectedRoute>
                  <ListaSolicitacoes />
                </ProtectedRoute>
              } />

              <Route path="/nova" element={
                <ProtectedRoute>
                  <NovaSolicitacao />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;