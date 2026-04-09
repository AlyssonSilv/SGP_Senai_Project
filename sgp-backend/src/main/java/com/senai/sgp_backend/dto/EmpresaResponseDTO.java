package com.senai.sgp_backend.dto;

import com.senai.sgp_backend.models.Empresa;

public record EmpresaResponseDTO(
    Long id,
    String razaoSocial,
    String cnpj,
    String email,
    String telefone,
    String nomeResponsavel
) {
    // Método utilitário para conversão da Entidade em DTO
    public static EmpresaResponseDTO fromEntity(Empresa empresa) {
        return new EmpresaResponseDTO(
            empresa.getId(),
            empresa.getRazaoSocial(),
            empresa.getCnpj(),
            empresa.getEmail(),
            empresa.getTelefone(),
            empresa.getNomeResponsavel()
        );
    }
}