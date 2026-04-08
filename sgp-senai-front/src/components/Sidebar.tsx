import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    // Função para encerrar a sessão com segurança
    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault(); // Impede o comportamento padrão do link
        
        if (window.confirm("Tem certeza que deseja sair do sistema?")) {
            localStorage.removeItem('empresa_logada'); // Remove o "crachá" do navegador
            navigate('/login'); // Manda de volta para o início
        }
    };

    return (
        <aside className="rail">
            <div className="brand" style={{ padding: '20px 0', textAlign: 'center' }}>
                <img 
                    src="https://logodownload.org/wp-content/uploads/2019/08/senai-logo-1.png" 
                    alt="SENAI" 
                    style={{ height: '34px', marginBottom: '8px' }} 
                />
                {/* <div className="t" style={{ fontWeight: 'bold', fontSize: '14px', letterSpacing: '1px' }}>
                    TREINAMENTOS
                </div> */}
            </div>

            <div style={{ padding: '0 20px' }}>
                <small style={{ opacity: 0.6, textTransform: 'uppercase', fontSize: '10px' }}>Navegação</small>
            </div>

            <nav className="menu" style={{ marginTop: '10px' }}>
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                    📊 Dashboard
                </NavLink>

                <NavLink to="/nova" className={({ isActive }) => (isActive ? 'active' : '')}>
                    📝 Nova Solicitação
                </NavLink>

                <NavLink to="/lista" className={({ isActive }) => (isActive ? 'active' : '')}>
                    📁 Minhas Solicitações
                </NavLink>

                <NavLink to="/usuarios" className={({ isActive }) => (isActive ? 'active' : '')}>
                    👥 Usuários da Empresa
                </NavLink>

                {/* Divisor visual para o botão de sair */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '20px 0' }}></div>

                {/* Botão de Sair com a função de Logout */}
                <a 
                    href="#logout" 
                    onClick={handleLogout} 
                    style={{ color: '#ff4d4d' }} // Cor vermelha para dar destaque à ação de sair
                >
                    🚪 Encerrar Sessão
                </a>
            </nav>
        </aside>
    );
};

export default Sidebar;