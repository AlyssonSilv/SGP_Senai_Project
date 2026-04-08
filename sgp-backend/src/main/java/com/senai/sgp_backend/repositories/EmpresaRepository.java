package com.senai.sgp_backend.repositories;

import com.senai.sgp_backend.models.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Long> {

    // Busca uma empresa específica pelo CNPJ (Útil para a hora do Login)
    Optional<Empresa> findByCnpj(String cnpj);

    // Busca uma empresa pelo E-mail (Para validações de cadastro duplo)
    Optional<Empresa> findByEmail(String email);
}