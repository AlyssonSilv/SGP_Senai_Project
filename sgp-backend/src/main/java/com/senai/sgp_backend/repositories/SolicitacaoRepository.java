package com.senai.sgp_backend.repositories;

import com.senai.sgp_backend.models.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    List<Solicitacao> findByEmpresaId(Long empresaId);
    
    // Novo método para contar solicitações por status e empresa
    long countByEmpresaIdAndStatus(Long empresaId, String status);
    
    long countByEmpresaId(Long empresaId);
}