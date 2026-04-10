package com.senai.sgp_backend.repositories;

import com.senai.sgp_backend.models.Empresa;
import com.senai.sgp_backend.models.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying; // IMPORTANTE
import org.springframework.transaction.annotation.Transactional; // IMPORTANTE
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    Optional<RefreshToken> findByToken(String token);

    @Modifying // Indica que esta query altera o banco (delete)
    @Transactional // Garante que a remoção ocorra dentro de uma transação segura
    void deleteByEmpresa(Empresa empresa);
}