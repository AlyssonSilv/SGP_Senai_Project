package com.senai.sgp_backend.services;

import com.senai.sgp_backend.dto.SolicitacaoResponseDTO;
import com.senai.sgp_backend.models.Solicitacao;
import com.senai.sgp_backend.repositories.SolicitacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Transactional
    public SolicitacaoResponseDTO criarSolicitacao(Solicitacao solicitacao) {
        if (solicitacao.getProtocolo() == null || solicitacao.getProtocolo().isEmpty()) {
            solicitacao.setProtocolo("CTE-" + System.currentTimeMillis());
        }

        solicitacao.setStatus("Nova");

        // Lógica para contagem exata de participantes baseada na lista de nomes
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

    // MÉTODO QUE ESTAVA FALTANDO:
    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarTodas() {
        return solicitacaoRepository.findAll().stream()
                .map(SolicitacaoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarPorEmpresa(Long empresaId) {
        return solicitacaoRepository.findByEmpresaId(empresaId)
                .stream()
                .map(SolicitacaoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public java.util.Map<String, Long> getEstatisticas(Long empresaId) {
        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("total", solicitacaoRepository.countByEmpresaId(empresaId));
        stats.put("novas", solicitacaoRepository.countByEmpresaIdAndStatus(empresaId, "Nova"));
        stats.put("pendentes", solicitacaoRepository.countByEmpresaIdAndStatus(empresaId, "Pendente"));
        stats.put("agendadas", solicitacaoRepository.countByEmpresaIdAndStatus(empresaId, "Agendada"));
        return stats;
    }

    @Transactional // Garante que a alteração seja salva corretamente no banco
    public void atualizarStatus(Long id, String novoStatus) {
        // 1. Busca a solicitação pelo ID ou lança um erro se não existir
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada com o ID: " + id));

        // 2. Atualiza o campo status
        solicitacao.setStatus(novoStatus);

        // 3. Salva a alteração (Opcional se usar @Transactional, mas boa prática)
        solicitacaoRepository.save(solicitacao);

        System.out.println("Status da solicitação " + id + " alterado para: " + novoStatus);
    }
}