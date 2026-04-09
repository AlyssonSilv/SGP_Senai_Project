package com.senai.sgp_backend.dto;

// O React vai receber o token e os dados para salvar no localStorage
public record LoginResponseDTO(
    String token, 
    Long id, 
    String razaoSocial, 
    String cnpj, 
    String email
) {}