package com.senai.sgp_backend.services;

import com.senai.sgp_backend.dto.SolicitacaoResponseDTO;
import com.senai.sgp_backend.models.Empresa;
import com.senai.sgp_backend.models.Solicitacao;
import com.senai.sgp_backend.repositories.SolicitacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @CacheEvict(value = "estatisticas", allEntries = true)
    @Transactional
    public SolicitacaoResponseDTO criarSolicitacao(Solicitacao solicitacao) {
        if (solicitacao.getProtocolo() == null || solicitacao.getProtocolo().isEmpty()) {
            solicitacao.setProtocolo("CTE-" + System.currentTimeMillis());
        }

        solicitacao.setStatus("Nova");

        // Lógica para contagem exata de participantes baseada na lista de nomes ao
        // criar
        if (solicitacao.getListaParticipantes() != null) {
            int totalReal = (int) Arrays.stream(solicitacao.getListaParticipantes().split("\\R"))
                    .filter(nome -> !nome.trim().isEmpty())
                    .count();

            // Define a quantidade exata baseada nos nomes encontrados
            solicitacao.setQuantidadeParticipantes(totalReal);
        }

        Solicitacao salva = solicitacaoRepository.save(solicitacao);
        return SolicitacaoResponseDTO.fromEntity(salva);
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoResponseDTO> listarTodas(Pageable pageable) {
        // O Page já tem o método map embutido, fica muito mais elegante!
        return solicitacaoRepository.findAll(pageable)
                .map(SolicitacaoResponseDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<SolicitacaoResponseDTO> listarPorEmpresa(Long empresaId, Pageable pageable) {
        return solicitacaoRepository.findByEmpresaId(empresaId, pageable)
                .map(SolicitacaoResponseDTO::fromEntity);
    }

    @Cacheable(value = "estatisticas", key = "#empresaId")
    @Transactional(readOnly = true)
    public java.util.Map<String, Long> getEstatisticas(Long empresaId) {
        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("total", solicitacaoRepository.countByEmpresaId(empresaId));
        stats.put("novas", solicitacaoRepository.countByEmpresaIdAndStatus(empresaId, "Nova"));
        stats.put("pendentes", solicitacaoRepository.countByEmpresaIdAndStatus(empresaId, "Pendente"));
        stats.put("agendadas", solicitacaoRepository.countByEmpresaIdAndStatus(empresaId, "Agendada"));
        return stats;
    }

    @CacheEvict(value = "estatisticas", allEntries = true)
    @Transactional // Garante que a alteração seja salva corretamente no banco
    public void atualizarStatus(Long id, String novoStatus, String instrutor, String sala, String horario) {
        // 1. Busca a solicitação pelo ID ou lança um erro se não existir
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada com o ID: " + id));

        // 2. Atualiza o campo status
        solicitacao.setStatus(novoStatus);

        // 3. Se o status for aprovado pelo CTA-SENAI, salva os dados físicos
        if ("CONFIRMADO".equals(novoStatus)) {
            solicitacao.setInstrutor(instrutor);
            solicitacao.setSala(sala);
            solicitacao.setHorario(horario);
        }

        // 4. Salva a alteração
        solicitacaoRepository.save(solicitacao);

        System.out.println("Status da solicitação " + id + " alterado para: " + novoStatus);
    }

    private Solicitacao buscarEValidarPropriedade(Long id, Empresa empresaLogada) {
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));

        // Se a empresa logada NÃO for ADMIN, verifica se ela é a dona da solicitação
        if (!empresaLogada.getRole().name().equals("ADMIN")) {
            if (!solicitacao.getEmpresa().getCnpj().equals(empresaLogada.getCnpj())) {
                throw new AccessDeniedException("Você não tem permissão para acessar ou modificar esta solicitação.");
            }
        }
        return solicitacao;
    }

    @CacheEvict(value = "estatisticas", allEntries = true)
    public void confirmarSolicitacao(Long id) throws Exception {
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new Exception("Solicitação não encontrada"));

        boolean dataOcupada = solicitacaoRepository.existsByDataSugeridaAndStatus(solicitacao.getDataSugerida(),
                "CONFIRMADO");

        if (dataOcupada) {
            throw new Exception("A data sugerida já possui um agendamento confirmado na agenda.");
        }

        solicitacao.setStatus("CONFIRMADO");
        solicitacaoRepository.save(solicitacao);
    }

    
    @CacheEvict(value = "estatisticas", allEntries = true)
    @Transactional
    public void editarAgendamento(Long id, String status, String instrutor, String sala, String horario,
            LocalDate dataSugerida, String listaParticipantes, Integer quantidadeParticipantes, Empresa empresaLogada) {

        // Usa o método seguro que bloqueia IDOR
        Solicitacao solicitacao = buscarEValidarPropriedade(id, empresaLogada);

        solicitacao.setStatus(status);
        solicitacao.setInstrutor(instrutor);
        solicitacao.setSala(sala);
        solicitacao.setHorario(horario);
        solicitacao.setDataSugerida(dataSugerida);

        if (listaParticipantes != null) {
            solicitacao.setListaParticipantes(listaParticipantes);
            solicitacao.setQuantidadeParticipantes(quantidadeParticipantes != null ? quantidadeParticipantes : 0);
        }

        solicitacaoRepository.save(solicitacao);
    }

    public SolicitacaoResponseDTO buscarPorId(Long id, Empresa empresaLogada) {
        Solicitacao solicitacao = buscarEValidarPropriedade(id, empresaLogada);
        return SolicitacaoResponseDTO.fromEntity(solicitacao);
    }
}