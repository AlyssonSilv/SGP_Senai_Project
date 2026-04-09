// Local: sgp-backend/src/main/java/com/senai/sgp_backend/repositories/SolicitacaoRepository.java
package com.senai.sgp_backend.repositories;

import com.senai.sgp_backend.models.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    // Busca todas as solicitações de uma empresa específica
    List<Solicitacao> findByEmpresaId(Long empresaId);
    
    Optional<Solicitacao> findByProtocolo(String protocolo);
}