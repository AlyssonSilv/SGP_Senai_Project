package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.dto.LoginRequestDTO;
import com.senai.sgp_backend.dto.LoginResponseDTO;
import com.senai.sgp_backend.models.Empresa;
import com.senai.sgp_backend.models.RefreshToken;
import com.senai.sgp_backend.repositories.EmpresaRepository;
import com.senai.sgp_backend.repositories.RefreshTokenRepository;
import com.senai.sgp_backend.security.JwtService;
import com.senai.sgp_backend.services.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/login")
public class LoginController {

        @Autowired
        private EmpresaRepository empresaRepository;

        @Autowired
        private JwtService jwtService;

        @Autowired
        private RefreshTokenService refreshTokenService;

        @Autowired
        private RefreshTokenRepository refreshTokenRepository;

        @PostMapping
        public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO data) {
                return empresaRepository.findByCnpjAndNomeResponsavelIgnoreCase(data.cnpj(), data.nomeResponsavel())
                                .map(empresa -> {
                                        String token = jwtService.gerarToken(empresa);
                                        RefreshToken refreshToken = refreshTokenService.criarRefreshToken(empresa);

                                        // 1. Criar o Cookie do Access Token (Configuração para ambiente local HTTP)
                                        ResponseCookie jwtCookie = ResponseCookie.from("accessToken", token)
                                                        .httpOnly(true)
                                                        .secure(false) // MUDADO PARA FALSE EM LOCALHOST
                                                        .sameSite("Lax") // MUDADO PARA LAX EM LOCALHOST
                                                        .path("/") // O cookie é enviado para todas as rotas do backend
                                                        .maxAge(2 * 60 * 60)
                                                        .build();

                                        // 2. Criar o Cookie do Refresh Token
                                        ResponseCookie refreshCookie = ResponseCookie
                                                        .from("refreshToken", refreshToken.getToken())
                                                        .httpOnly(true)
                                                        .secure(false) // MUDADO PARA FALSE EM LOCALHOST
                                                        .sameSite("Lax") // MUDADO PARA LAX EM LOCALHOST
                                                        .path("/api/login/refresh") // Segurança Extra: Este cookie SÓ é
                                                                                    // enviado nesta rota
                                                        .maxAge(7 * 24 * 60 * 60)
                                                        .build();

                                        LoginResponseDTO responseDTO = new LoginResponseDTO(
                                                        empresa.getId(),
                                                        empresa.getRazaoSocial(),
                                                        empresa.getCnpj(),
                                                        empresa.getEmail(),
                                                        empresa.getRole().name());

                                        // 3. Injetar os cookies nos cabeçalhos da resposta HTTP
                                        return ResponseEntity.ok()
                                                        .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                                                        .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                                        .body(responseDTO);
                                })
                                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
        }

        @PostMapping("/refresh")
        public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken") String tokenDeRenovacao) {

                return refreshTokenRepository.findByToken(tokenDeRenovacao)
                                .map(refreshTokenService::validarExpiracao)
                                .map(RefreshToken::getEmpresa)
                                .map(empresa -> {
                                        String novoAccessToken = jwtService.gerarToken(empresa);

                                        // Devolver apenas o novo Access Token atualizado num cookie (Configuração
                                        // local)
                                        ResponseCookie jwtCookie = ResponseCookie.from("accessToken", novoAccessToken)
                                                        .httpOnly(true)
                                                        .secure(false) // MUDADO PARA FALSE EM LOCALHOST
                                                        .sameSite("Lax") // MUDADO PARA LAX EM LOCALHOST
                                                        .path("/")
                                                        .maxAge(2 * 60 * 60)
                                                        .build();

                                        return ResponseEntity.ok()
                                                        .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                                                        .body(Map.of("mensagem", "Sessão renovada com sucesso."));
                                })
                                .orElseThrow(() -> new RuntimeException("Refresh Token inválido ou expirado."));
        }

        @GetMapping("/me")
        public ResponseEntity<LoginResponseDTO> getEmpresaLogada() {
                var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext()
                                .getAuthentication();

                if (authentication == null || !authentication.isAuthenticated()
                                || "anonymousUser".equals(authentication.getPrincipal())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                }

                Empresa empresaAuth = (Empresa) authentication.getPrincipal();
                String cnpj = empresaAuth.getCnpj();

                return empresaRepository.findByCnpj(cnpj)
                                .map(userDetails -> {
                                        // CONVERSÃO (CAST) EXPLÍCITA AQUI:
                                        Empresa empresa = (Empresa) userDetails;

                                        LoginResponseDTO responseDTO = new LoginResponseDTO(
                                                        empresa.getId(),
                                                        empresa.getRazaoSocial(),
                                                        empresa.getCnpj(),
                                                        empresa.getEmail(),
                                                        empresa.getRole().name());
                                        return ResponseEntity.ok(responseDTO);
                                })
                                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        }
}