package com.senai.sgp_backend.repositories;

import com.senai.sgp_backend.models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Mágica do Spring: Ele lê o nome do método e cria o "SELECT * FROM usuarios WHERE email = ?" automático!
    Optional<Usuario> findByEmail(String email);
}