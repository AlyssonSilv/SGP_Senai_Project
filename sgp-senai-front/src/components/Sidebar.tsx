import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        
        if (window.confirm("Tem certeza que deseja sair do sistema?")) {
            // Limpa tudo para garantir que nenhum token antigo permaneça
            localStorage.clear(); 
            navigate('/login');
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
            </div>

            <nav className="menu" style={{ marginTop: '10px' }}>
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>📊 Dashboard</NavLink>
                <NavLink to="/nova" className={({ isActive }) => (isActive ? 'active' : '')}>📝 Nova Solicitação</NavLink>
                <NavLink to="/lista" className={({ isActive }) => (isActive ? 'active' : '')}>📁 Minhas Solicitações</NavLink>
                <NavLink to="/usuarios" className={({ isActive }) => (isActive ? 'active' : '')}>👥 Usuários</NavLink>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '20px 0' }}></div>

                <a href="#logout" onClick={handleLogout} style={{ color: '#ff4d4d' }}>
                    🚪 Encerrar Sessão
                </a>
            </nav>
        </aside>
    );
};

export default Sidebar;