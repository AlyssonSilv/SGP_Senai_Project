package com.senai.sgp_backend.repositories;

import com.senai.sgp_backend.models.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    
    // Busca todas as solicitações de uma empresa específica
    List<Solicitacao> findByEmpresaId(Long empresaId);

    // 👇 A LINHA QUE ESTAVA FALTANDO 👇
    // Busca uma solicitação específica pelo seu número de protocolo
    Optional<Solicitacao> findByProtocolo(String protocolo);
}