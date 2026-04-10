package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.dto.LoginRequestDTO;
import com.senai.sgp_backend.dto.LoginResponseDTO;
import com.senai.sgp_backend.models.Empresa;
import com.senai.sgp_backend.models.RefreshToken;
import com.senai.sgp_backend.repositories.RefreshTokenRepository;
import com.senai.sgp_backend.security.JwtService;
import com.senai.sgp_backend.services.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    
    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @PostMapping
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.cnpj(), data.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        
        Empresa empresa = (Empresa) auth.getPrincipal();
        
        // 1. Gera o JWT (Access Token) - Vida curta (ex: 2 horas)
        String token = jwtService.gerarToken(empresa);
        
        // 2. Gera o Refresh Token - Vida longa (ex: 7 dias) e salva no banco
        RefreshToken refreshToken = refreshTokenService.criarRefreshToken(empresa);
        
        return ResponseEntity.ok(new LoginResponseDTO(
                token, 
                refreshToken.getToken(), // NOVO: Agora incluímos o Refresh Token na resposta
                empresa.getId(), 
                empresa.getRazaoSocial(), 
                empresa.getCnpj(), 
                empresa.getEmail()
        ));
    }

    // Endpoint para renovar o Access Token usando o Refresh Token
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String tokenDeRenovacao = request.get("refreshToken");

        return refreshTokenRepository.findByToken(tokenDeRenovacao)
                .map(refreshTokenService::validarExpiracao)
                .map(RefreshToken::getEmpresa)
                .map(empresa -> {
                    // Gera um novo Access Token (JWT)
                    String novoAccessToken = jwtService.gerarToken(empresa);
                    return ResponseEntity.ok(Map.of(
                            "token", novoAccessToken,
                            "refreshToken", tokenDeRenovacao
                    ));
                })
                .orElseThrow(() -> new RuntimeException("Refresh Token inválido ou não encontrado."));
    }
}