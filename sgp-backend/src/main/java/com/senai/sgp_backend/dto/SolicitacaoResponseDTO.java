package com.senai.sgp_backend.dto;

import com.senai.sgp_backend.models.Solicitacao;
import java.time.LocalDate;

public record SolicitacaoResponseDTO(
    Long id,
    String protocolo,
    String treinamento,
    Integer quantidadeParticipantes,
    LocalDate dataSugerida,
    String status,
    String nomeEmpresa
) {
    public static SolicitacaoResponseDTO fromEntity(Solicitacao s) {
        return new SolicitacaoResponseDTO(
            s.getId(),
            s.getProtocolo(),
            s.getTreinamento(),
            s.getQuantidadeParticipantes(),
            s.getDataSugerida(),
            s.getStatus(),
            s.getEmpresa().getRazaoSocial() // Defesa: Pegando apenas o nome da empresa
        );
    }
}