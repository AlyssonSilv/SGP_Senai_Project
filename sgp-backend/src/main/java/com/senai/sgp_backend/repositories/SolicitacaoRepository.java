package com.senai.sgp_backend.repositories;

import com.senai.sgp_backend.models.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    // Busca as solicitações de uma empresa específica (Este sim precisa do
    // empresaId)
    @EntityGraph(attributePaths = { "empresa" })
    Page<Solicitacao> findByEmpresaId(Long empresaId, Pageable pageable);

    // CORREÇÃO: Busca TUDO (Removemos o Long empresaId daqui)
    @EntityGraph(attributePaths = { "empresa" })
    Page<Solicitacao> findAll(Pageable pageable);

    // Busca uma solicitação específica pelo seu protocolo único
    Optional<Solicitacao> findByProtocolo(String protocolo);

    // ESSENCIAL PARA O ADMIN: Conta solicitações globais de todas as empresas por
    // status
    long countByStatus(String status);

    // PARA O DASHBOARD DA EMPRESA: Estatísticas filtradas por empresa e status
    long countByEmpresaIdAndStatus(Long empresaId, String status);

    // Total de solicitações de uma empresa específica
    long countByEmpresaId(Long empresaId);

    // Retorna todas as solicitações com o status especificado
    List<Solicitacao> findByStatus(String status);

    // Verifica se já existe uma solicitação aprovada na mesma data
    boolean existsByDataSugeridaAndStatus(LocalDate dataSugerida, String status);

    // --- NOVO MÉTODO ADICIONADO ---
    // Busca treinamentos por status e data específica (usado para gerar a agenda do
    // dia seguinte)
    List<Solicitacao> findByStatusAndDataSugerida(String status, LocalDate dataSugerida);
}