import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Analitico: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [empresas, setEmpresas] = useState<any[]>([]);
    const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
    const [empresaSelecionada, setEmpresaSelecionada] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<string>('');

    // Dentro da função carregarDadosIniciais  Analitico.tsx:

    const carregarDadosIniciais = async () => {
        try {
            const [resStats, resEmpresas] = await Promise.all([
                api.get('/admin/analitico/resumo'),
                api.get('/empresas')
            ]);

            setStats(resStats.data);

            // Remove o Admin da lista de seleção
            //.role deve estar em maiúsculas conforme o Enum do Java
            const industriasApenas = resEmpresas.data.filter((e: any) => e.role === 'USER');
            setEmpresas(industriasApenas);

            setLastUpdate(new Date().toLocaleTimeString('pt-BR'));
            setLoading(false);
        } catch (error) {
            console.error("Erro ao carregar indústrias:", error);
        }
    };

    const carregarSolicitacoes = async () => {
        try {
            // AJUSTE 2: Garantir que o parâmetro seja enviado corretamente
            const response = await api.get('/solicitacoes/admin/todas', {
                params: empresaSelecionada ? { empresaId: empresaSelecionada } : {}
            });
            setSolicitacoes(response.data);
        } catch (error) {
            console.error("Erro ao carregar solicitações:", error);
        }
    };

    useEffect(() => {
        carregarDadosIniciais();
        const intervalo = setInterval(carregarDadosIniciais, 30000);
        return () => clearInterval(intervalo);
    }, []);

    // Este efeito dispara sempre que a empresa selecionada mudar
    useEffect(() => {
        carregarSolicitacoes();
    }, [empresaSelecionada]);

    if (loading) return <div className="pad p">Sincronizando base de dados administrativa...</div>;

    return (
        <div className="wrap">
            <div className="h1">Painel Analítico SENAI</div>

            <section className="card pad" style={{ marginBottom: '24px' }}>
                <label className="label">Filtrar Demandas por Indústria</label>
                <select
                    className="select"
                    title="Filtrar Demandas por Indústria"
                    value={empresaSelecionada}
                    onChange={(e) => setEmpresaSelecionada(e.target.value)}
                >
                    <option value="">Todas as Indústrias (Visão Geral)</option>
                    {empresas.map(emp => (
                        <option key={emp.id} value={emp.id}>
                            {emp.razaoSocial} — {emp.cnpj}
                        </option>
                    ))}
                </select>
            </section>

            {/* TABELA DE SOLICITAÇÕES */}
            <section className="card pad">
                <div className="h2">Solicitações de Treinamento</div>
                <table>
                    <thead>
                        <tr>
                            <th>Protocolo</th>
                            <th>Indústria</th>
                            <th>Treinamento</th>
                            <th>Alunos</th>
                            <th>Data Sugerida</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitacoes.length > 0 ? (
                            solicitacoes.map(sol => (
                                <tr key={sol.id}>
                                    <td style={{ fontWeight: '800', color: 'var(--blue)' }}>{sol.protocolo}</td>
                                    <td>{sol.nomeEmpresa}</td>
                                    <td>{sol.treinamento}</td>
                                    <td>{sol.quantidadeParticipantes}</td>
                                    <td>{new Date(sol.dataSugerida).toLocaleDateString('pt-BR')}</td>
                                    <td>
                                        <span className={`badge badge-${sol.status.toLowerCase()}`}>
                                            {sol.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                                    Nenhuma solicitação encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Analitico;