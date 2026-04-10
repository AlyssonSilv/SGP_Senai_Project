package com.senai.sgp_backend.services;

import com.senai.sgp_backend.models.Empresa;
import com.senai.sgp_backend.models.RefreshToken;
import com.senai.sgp_backend.repositories.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenService {
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Transactional //Necessário para a operação de delete funcionar
    public RefreshToken criarRefreshToken(Empresa empresa) {
        // Remove tokens antigos da mesma empresa antes de criar um novo
        refreshTokenRepository.deleteByEmpresa(empresa);

        RefreshToken refreshToken = RefreshToken.builder()
                .empresa(empresa)
                .token(UUID.randomUUID().toString())
                .dataExpiracao(Instant.now().plusSeconds(604800)) // 7 dias de validade
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    public RefreshToken validarExpiracao(RefreshToken token) {
        if (token.getDataExpiracao().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token expirado. Faça login novamente.");
        }
        return token;
    }
}