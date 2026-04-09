package com.senai.sgp_backend.dto;

import com.senai.sgp_backend.models.Solicitacao;
import java.time.LocalDate;

public record SolicitacaoResponseDTO(
    Long id,
    String protocolo,
    String treinamento,
    Integer quantidadeParticipantes,
    String listaParticipantes, // ADICIONADO: Necessário para o modal de nomes
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
            s.getListaParticipantes(), // REFATORADO: Agora envia os nomes para o Front
            s.getDataSugerida(),
            s.getStatus(),
            s.getEmpresa() != null ? s.getEmpresa().getRazaoSocial() : "Empresa não identificada"
        );
    }
}