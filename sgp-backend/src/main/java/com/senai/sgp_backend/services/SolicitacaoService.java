// Local: sgp-backend/src/main/java/com/senai/sgp_backend/services/SolicitacaoService.java
package com.senai.sgp_backend.services;

import com.senai.sgp_backend.dto.SolicitacaoResponseDTO;
import com.senai.sgp_backend.models.Solicitacao;
import com.senai.sgp_backend.repositories.SolicitacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitacaoService {

    
    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Transactional
    public SolicitacaoResponseDTO criarSolicitacao(Solicitacao solicitacao) {
        if (solicitacao.getProtocolo() == null || solicitacao.getProtocolo().isEmpty()) {
            String protocolo = "REQ-" + System.currentTimeMillis();
            solicitacao.setProtocolo(protocolo);
        }

        solicitacao.setStatus("Nova");

        // Use o nome correto aqui também
        Solicitacao salva = solicitacaoRepository.save(solicitacao);
        return SolicitacaoResponseDTO.fromEntity(salva);
    }

    public List<SolicitacaoResponseDTO> listarTodas() {
        // Use o nome correto aqui também
        return solicitacaoRepository.findAll().stream()
                .map(SolicitacaoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponseDTO> listarPorEmpresa(Long empresaId) {
        // Agora o nome 'solicitacaoRepository' será reconhecido corretamente
        return solicitacaoRepository.findByEmpresaId(empresaId)
                .stream()
                .map(SolicitacaoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}