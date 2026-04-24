import React, { useEffect, useState } from 'react';
import api from '../services/api';

const GestaoDemandas: React.FC = () => {
    const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados de Paginação
    const [pagina, setPagina] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const carregarTudo = async () => {
        try {
            // Requisição atualizada com parâmetros de paginação
            const res = await api.get(`/solicitacoes/admin/todas?page=${pagina}&size=10`);

            // CORREÇÃO: Agora acessamos 'res.data.content' para a lista
            setSolicitacoes(res.data.content);

            // CORREÇÃO: Com o VIA_DTO, o totalPages agora mora dentro de 'res.data.page'
            setTotalPages(res.data.page.totalPages);

            setLoading(false);
        } catch (err) { console.error(err); }
    };

    const alterarStatus = async (id: number, novoStatus: string) => {
        try {
            await api.put(`/solicitacoes/${id}/status`, { status: novoStatus });
            alert("Status atualizado com sucesso!");
            carregarTudo(); // Recarrega a lista para refletir a mudança
        } catch (err) { alert("Erro ao atualizar status."); }
    };

    // O useEffect agora reage quando a página muda
    useEffect(() => { carregarTudo(); }, [pagina]);

    return (
        <div className="wrap">
            <div className="h1">Gestão de Demandas SENAI</div>
            <p className="p">Administre o fluxo de solicitações de todas as indústrias.</p>

            <div className="card pad" style={{ marginTop: '20px' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Protocolo</th>
                            <th>Indústria</th>
                            <th>Treinamento</th>
                            <th>Data Sugerida</th>
                            <th>Status Atual</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solicitacoes && solicitacoes.map(sol => (
                            <tr key={sol.id}>
                                <td style={{ fontWeight: 'bold' }}>{sol.protocolo}</td>
                                <td>{sol.nomeEmpresa}</td>
                                <td>{sol.treinamento}</td>
                                <td>{new Date(sol.dataSugerida).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    <span className={`badge badge-${sol.status.toLowerCase()}`}>{sol.status}</span>
                                </td>
                                <td>
                                    <select
                                        className="select select-status"
                                        aria-label={`Alterar status da solicitação ${sol.protocolo}`}
                                        value={sol.status}
                                        onChange={(e) => alterarStatus(sol.id, e.target.value)}
                                    >
                                        <option value="Nova">Nova</option>
                                        <option value="Agendada">Agendada</option>
                                        <option value="Concluída">Concluída</option>
                                        <option value="Cancelada">Cancelada</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* CONTROLES DE PAGINAÇÃO */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', paddingBottom: '10px' }}>
                    <button
                        className="btn ghost sm"
                        disabled={pagina === 0}
                        onClick={() => setPagina(pagina - 1)}
                    >
                        Anterior
                    </button>
                    <span style={{ lineHeight: '32px' }}>
                        Página {totalPages === 0 ? 0 : pagina + 1} de {totalPages}
                    </span>
                    <button
                        className="btn ghost sm"
                        disabled={pagina >= totalPages - 1 || totalPages === 0}
                        onClick={() => setPagina(pagina + 1)}
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GestaoDemandas;