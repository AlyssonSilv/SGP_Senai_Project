package com.senai.sgp_backend.dto;

import com.senai.sgp_backend.models.Solicitacao;
import java.time.LocalDate;

public record SolicitacaoResponseDTO(
    Long id,
    String protocolo,
    String treinamento,
    Integer quantidadeParticipantes,
    String listaParticipantes, 
    LocalDate dataSugerida,
    String status,
    String nomeEmpresa,
    String instrutor, // NOVO
    String sala,      // NOVO
    String horario    // NOVO
) {
    public static SolicitacaoResponseDTO fromEntity(Solicitacao s) {
        return new SolicitacaoResponseDTO(
            s.getId(),
            s.getProtocolo(),
            s.getTreinamento(),
            s.getQuantidadeParticipantes(),
            s.getListaParticipantes(),
            s.getDataSugerida(),
            s.getStatus(),
            s.getEmpresa() != null ? s.getEmpresa().getRazaoSocial() : "Empresa não identificada",
            s.getInstrutor(), // Mapeia o instrutor da entity para o DTO
            s.getSala(),      // Mapeia a sala da entity para o DTO
            s.getHorario()    // Mapeia o horário da entity para o DTO
        );
    }
}