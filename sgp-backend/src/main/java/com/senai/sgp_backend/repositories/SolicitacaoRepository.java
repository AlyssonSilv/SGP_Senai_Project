package com.senai.sgp_backend.repositories;

import com.senai.sgp_backend.models.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    // Busca todas as solicitações que pertencem a um ID de empresa específico
    List<Solicitacao> findByEmpresaId(Long empresaId);

    // Busca uma solicitação pelo número do protocolo (Ex: CTE-20260407001)
    Optional<Solicitacao> findByProtocolo(String protocolo);
}