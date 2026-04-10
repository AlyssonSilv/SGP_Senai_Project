import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Industrias: React.FC = () => {
    const [empresas, setEmpresas] = useState<any[]>([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/empresas')
            .then(res => {
                // Filtra o Admin e mantém apenas as indústrias
                const apenasIndustrias = res.data.filter((e: any) => e.role !== 'ADMIN');
                setEmpresas(apenasIndustrias);
                setLoading(false);
            })
            .catch(err => console.error("Erro ao carregar indústrias", err));
    }, []);

    // Lógica de busca por Nome ou CNPJ
    const empresasFiltradas = empresas.filter(emp => 
        emp.razaoSocial.toLowerCase().includes(filtro.toLowerCase()) ||
        emp.cnpj.includes(filtro)
    );

    if (loading) return <div className="pad p">Carregando base de parceiros...</div>;

    return (
        <div className="wrap">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                <div>
                    <div className="h1">Indústrias Cadastradas</div>
                    <p className="p">Gerencie o portfólio de empresas parceiras e seus contatos.</p>
                </div>
                <div className="card" style={{ padding: '8px 16px', background: 'var(--soft)', border: 'none' }}>
                    <span className="h2" style={{ margin: 0, color: 'var(--blue)' }}>{empresas.length}</span>
                    <small style={{ marginLeft: '8px', color: 'var(--muted)' }}>Parceiros Totais</small>
                </div>
            </div>

            {/* BARRA DE BUSCA */}
            <div className="card pad" style={{ marginBottom: '24px' }}>
                <input 
                    type="text" 
                    className="input" 
                    placeholder="🔍 Buscar por Razão Social ou CNPJ..." 
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    style={{ maxWidth: '400px' }}
                />
            </div>

            {/* GRID DE CARDS */}
            <div className="grid">
                {empresasFiltradas.length > 0 ? (
                    empresasFiltradas.map(emp => (
                        <div key={emp.id} className="card" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}>
                            {/* Header do Card com Iniciais */}
                            <div style={{ 
                                padding: '20px', 
                                background: 'var(--soft)', 
                                borderBottom: '1px solid var(--line)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    background: 'var(--blue)', 
                                    color: '#fff', 
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    fontSize: '18px'
                                }}>
                                    {emp.razaoSocial.substring(0, 2).toUpperCase()}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <div className="h2" style={{ margin: 0, fontSize: '16px', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        {emp.razaoSocial}
                                    </div>
                                    <small style={{ color: 'var(--muted)' }}>CNPJ: {emp.cnpj}</small>
                                </div>
                            </div>

                            {/* Conteúdo do Card */}
                            <div className="pad" style={{ flex: 1 }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <small className="label" style={{ marginBottom: '4px', display: 'block' }}>Responsável</small>
                                    <div className="p" style={{ margin: 0, fontWeight: '500' }}>{emp.nomeResponsavel}</div>
                                </div>

                                <div className="grid" style={{ gap: '10px' }}>
                                    <div style={{ gridColumn: 'span 12' }}>
                                        <a href={`mailto:${emp.email}`} className="btn secondary" style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}>
                                            ✉️ {emp.email}
                                        </a>
                                    </div>
                                    <div style={{ gridColumn: 'span 12' }}>
                                        <a href={`tel:${emp.telefone}`} className="btn ghost" style={{ width: '100%', justifyContent: 'center', fontSize: '12px', border: '1px solid var(--line)' }}>
                                            📞 {emp.telefone}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: 'span 12', textAlign: 'center', padding: '60px' }}>
                        <div className="p" style={{ color: 'var(--muted)' }}>Nenhuma indústria encontrada para "{filtro}"</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Industrias;