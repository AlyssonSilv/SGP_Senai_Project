package com.senai.sgp_backend.dto;

public record LoginResponseDTO(
    Long id,
    String razaoSocial,
    String cnpj,
    String email,
    String role
) {}