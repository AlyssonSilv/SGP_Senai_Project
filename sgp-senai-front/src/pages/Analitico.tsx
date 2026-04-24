import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

interface Solicitacao {
    id: number;
    protocolo: string;
    dataSugerida: string;
    treinamento: string;
    status: string;
    listaParticipantes: string;
    nomeEmpresa: string;
    instrutor?: string;
    sala?: string;
    horario?: string;
}

const Analitico: React.FC = () => {
    const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

    // Estados de Paginação adicionados
    const [pagina, setPagina] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate();

    const carregarSolicitacoes = async () => {
        try {
            // Requisita a página correta da API
            const response = await api.get(`/solicitacoes/admin/todas?page=${pagina}&size=10`);

            // CORREÇÃO: Lê o array de dentro da propriedade 'content'
            setSolicitacoes(response.data.content);
            setTotalPages(response.data.page.totalPages);
        } catch (error) {
            console.error("Erro ao carregar solicitações:", error);
        }
    };

    // O useEffect agora reage à mudança da página
    useEffect(() => {
        carregarSolicitacoes();
    }, [pagina]);

    const handleGerarPdf = async () => {
        try {
            const response = await api.get('/admin/analitico/agenda/pdf', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'agenda_atendimentos.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert("Erro ao gerar o ficheiro PDF.");
        }
    };

    const irParaDetalhes = (id: number) => {
        navigate(`/admin/solicitacao/${id}`);
    };

    return (
        <div className="p-6 w-full relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Painel Analítico</h1>
                <Button variant="primary" onClick={handleGerarPdf} className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Gerar Agenda (PDF)
                </Button>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
                <table className="min-w-full text-left border-collapse whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="py-4 px-5 text-sm font-semibold text-gray-600 uppercase">Protocolo</th>
                            <th className="py-4 px-5 text-sm font-semibold text-gray-600 uppercase">Empresa</th>
                            <th className="py-4 px-5 text-sm font-semibold text-gray-600 uppercase">Data Sugerida</th>
                            <th className="py-4 px-5 text-sm font-semibold text-gray-600 uppercase">Status</th>
                            <th className="py-4 px-5 text-sm font-semibold text-gray-600 uppercase text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {/* Verificação de segurança (solicitacoes &&) antes do map */}
                        {solicitacoes && solicitacoes.map(sol => (
                            <tr key={sol.id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="py-3 px-5 text-gray-800 font-medium">{sol.protocolo}</td>
                                <td className="py-3 px-5 text-gray-700">{sol.nomeEmpresa}</td>
                                <td className="py-3 px-5 text-gray-700">{sol.dataSugerida}</td>
                                <td className="py-3 px-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${sol.status === 'CONFIRMADO' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                                        {sol.status}
                                    </span>
                                </td>
                                <td className="py-3 px-5 text-center">
                                    <Button variant="ghost" onClick={() => irParaDetalhes(sol.id)}>
                                        Ver Detalhes
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {(!solicitacoes || solicitacoes.length === 0) && (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    Nenhuma solicitação encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Controles de Paginação */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', paddingBottom: '20px' }}>
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

export default Analitico;