import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Button from '../components/Button';

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
    const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<Solicitacao | null>(null);
    const [modalAberto, setModalAberto] = useState(false);
    
    // Novo estado para controlar se estamos no modo de edição
    const [isEditing, setIsEditing] = useState(false);
    
    // O estado agora guarda também a data, permitindo reagendamento
    const [dadosAdmin, setDadosAdmin] = useState({
        instrutor: '',
        sala: '',
        horario: '',
        dataSugerida: ''
    });

    const carregarSolicitacoes = async () => {
        try {
            const response = await api.get('/solicitacoes/admin/todas');
            setSolicitacoes(response.data);
        } catch (error) {
            console.error("Erro ao carregar solicitações:", error);
        }
    };

    useEffect(() => {
        carregarSolicitacoes();
    }, []);

    const abrirModalDetalhes = (solicitacao: Solicitacao) => {
        setSolicitacaoSelecionada(solicitacao);
        // Preenche os dados com o que já existe (útil para edição)
        setDadosAdmin({ 
            instrutor: solicitacao.instrutor || '', 
            sala: solicitacao.sala || '', 
            horario: solicitacao.horario || '',
            dataSugerida: solicitacao.dataSugerida || ''
        });
        
        // Se já estiver confirmado, abre no modo visualização. Se não, abre editando.
        setIsEditing(solicitacao.status !== 'CONFIRMADO');
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setSolicitacaoSelecionada(null);
        setIsEditing(false);
    };

    // Função unificada para Confirmar  ou Salvar Edição
    const handleSalvar = async (id: number) => {
        if (!dadosAdmin.instrutor || !dadosAdmin.sala || !dadosAdmin.horario || !dadosAdmin.dataSugerida) {
            alert("Por favor, preencha todos os campos (Data, Instrutor, Sala e Horário).");
            return;
        }

        try {
            await api.put(`/solicitacoes/${id}/editar`, {
                status: "CONFIRMADO",
                instrutor: dadosAdmin.instrutor,
                sala: dadosAdmin.sala,
                horario: dadosAdmin.horario,
                dataSugerida: dadosAdmin.dataSugerida
            });
            alert("Agendamento guardado com sucesso!");
            fecharModal();
            carregarSolicitacoes();
        } catch (error: any) {
            alert(error.response?.data || "Erro ao guardar agendamento.");
        }
    };

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
                        {solicitacoes.map(sol => (
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
                                    <Button variant="ghost" onClick={() => abrirModalDetalhes(sol)}>
                                        Ver Detalhes
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalAberto && solicitacaoSelecionada && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={fecharModal}></div>

                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-extrabold text-gray-800">
                                {isEditing && solicitacaoSelecionada.status === 'CONFIRMADO' ? "Editar Agendamento" : "Detalhes da Solicitação"}
                            </h2>
                            <button type="button" onClick={fecharModal} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full" aria-label="Fechar">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {/* Bloco Superior (Imutável) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <span className="block text-xs font-bold text-slate-500 uppercase">Empresa Solicitante</span>
                                    <span className="block text-slate-800 mt-1">{solicitacaoSelecionada.nomeEmpresa}</span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <span className="block text-xs font-bold text-slate-500 uppercase">Protocolo</span>
                                    <span className="block text-slate-800 mt-1 font-mono">{solicitacaoSelecionada.protocolo}</span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <span className="block text-xs font-bold text-slate-500 uppercase">Treinamento</span>
                                    <span className="block text-slate-800 mt-1">{solicitacaoSelecionada.treinamento}</span>
                                </div>
                            </div>

                            {/* Área do Administrador (Mutável) */}
                            <div className="mt-6 border-t pt-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-md font-bold text-blue-800">Definições do CTA-SENAI</h3>
                                    {solicitacaoSelecionada.status === 'CONFIRMADO' && !isEditing && (
                                        <Button variant="ghost" onClick={() => setIsEditing(true)}>
                                            ✏️ Editar Dados
                                        </Button>
                                    )}
                                </div>
                                
                                {!isEditing ? (
                                    // MODO VISUALIZAÇÃO
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <div><span className="block text-xs font-bold text-blue-600 uppercase">Data</span><span className="font-semibold text-slate-800">{solicitacaoSelecionada.dataSugerida}</span></div>
                                        <div><span className="block text-xs font-bold text-blue-600 uppercase">Instrutor</span><span className="font-semibold text-slate-800">{solicitacaoSelecionada.instrutor}</span></div>
                                        <div><span className="block text-xs font-bold text-blue-600 uppercase">Sala</span><span className="font-semibold text-slate-800">{solicitacaoSelecionada.sala}</span></div>
                                        <div><span className="block text-xs font-bold text-blue-600 uppercase">Horário</span><span className="font-semibold text-slate-800">{solicitacaoSelecionada.horario}</span></div>
                                    </div>
                                ) : (
                                    // MODO EDIÇÃO / CONFIRMAÇÃO
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div>
                                            <label htmlFor="data-input" className="block text-xs font-bold text-gray-700 uppercase mb-1">Data (Reagendamento)</label>
                                            <input id="data-input" type="date" className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={dadosAdmin.dataSugerida} onChange={e => setDadosAdmin({...dadosAdmin, dataSugerida: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Instrutor</label>
                                            <input type="text" className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={dadosAdmin.instrutor} onChange={e => setDadosAdmin({...dadosAdmin, instrutor: e.target.value})} placeholder="Ex: João Silva" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Sala</label>
                                            <input type="text" className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={dadosAdmin.sala} onChange={e => setDadosAdmin({...dadosAdmin, sala: e.target.value})} placeholder="Ex: Sala 01" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Horário</label>
                                            <input type="text" className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none" value={dadosAdmin.horario} onChange={e => setDadosAdmin({...dadosAdmin, horario: e.target.value})} placeholder="Ex: 08:00 - 12:00" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <strong className="text-gray-800 flex items-center gap-2 mb-2">Lista de Alunos</strong>
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto shadow-inner">
                                    {solicitacaoSelecionada.listaParticipantes || "Nenhuma lista fornecida."}
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
                            {isEditing && solicitacaoSelecionada.status === 'CONFIRMADO' ? (
                                // Botões ao editar um já confirmado
                                <>
                                    <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancelar Edição</Button>
                                    <Button type="button" variant="primary" onClick={() => handleSalvar(solicitacaoSelecionada.id)}>Salvar Alterações</Button>
                                </>
                            ) : (
                                // Botões padrão (Fechar / Confirmar Nova)
                                <>
                                    <Button type="button" variant="secondary" onClick={fecharModal}>Fechar</Button>
                                    {!isEditing ? null : (
                                        <Button type="button" variant="success" onClick={() => handleSalvar(solicitacaoSelecionada.id)}>Confirmar Agendamento</Button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analitico;