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
    
    // Busca uma solicitação específica pelo seu protocolo único
    Optional<Solicitacao> findByProtocolo(String protocolo);

    // ESSENCIAL PARA O ADMIN: Conta solicitações globais de todas as empresas por status
    long countByStatus(String status);

    // PARA O DASHBOARD DA EMPRESA: Estatísticas filtradas por empresa e status
    long countByEmpresaIdAndStatus(Long empresaId, String status);
    
    // Total de solicitações de uma empresa específica
    long countByEmpresaId(Long empresaId);
}