package com.senai.sgp_backend.dto;

import com.senai.sgp_backend.models.Empresa;

public record EmpresaResponseDTO(
    Long id,
    String razaoSocial,
    String cnpj,
    String email,
    String telefone,
    String nomeResponsavel,
    String role // ADICIONADO PARA O FILTRO FUNCIONAR
) {
    public static EmpresaResponseDTO fromEntity(Empresa empresa) {
        return new EmpresaResponseDTO(
            empresa.getId(),
            empresa.getRazaoSocial(),
            empresa.getCnpj(),
            empresa.getEmail(),
            empresa.getTelefone(),
            empresa.getNomeResponsavel(),
            // MAPEADO: Envia o papel da empresa para o Frontend
            empresa.getRole() != null ? empresa.getRole().name() : "USER"
        );
    }
}