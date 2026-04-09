package com.senai.sgp_backend.repositories;

import com.senai.sgp_backend.models.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails; // Importação importante
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    // Mudamos o retorno de Empresa para UserDetails para facilitar a vida do Spring Security
    Optional<UserDetails> findByCnpj(String cnpj);

    boolean existsByCnpj(String cnpj);
}