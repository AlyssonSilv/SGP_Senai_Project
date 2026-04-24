package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.dto.SolicitacaoResponseDTO;
import com.senai.sgp_backend.models.Solicitacao;
import com.senai.sgp_backend.services.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.senai.sgp_backend.models.Empresa;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService solicitacaoService;

    private Empresa getEmpresaLogada() {
        return (Empresa) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody @Valid Solicitacao solicitacao) {

        // 1. Pega a hora atual usando o fuso horário correto (Maranhão / Brasília)
        ZoneId fusoHorario = ZoneId.of("America/Fortaleza");
        LocalTime agora = LocalTime.now(fusoHorario);

        // 2. Define o limite (16h00)
        LocalTime limite = LocalTime.of(16, 00);

        // 3.Trava de Segurança do  Backend
        if (agora.isAfter(limite)) {
            // Retorna um erro 403 (Proibido) com uma mensagem clara para o React capturar
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("A agenda do dia foi encerrada. O horário limite para envio de solicitações é até as 16:30. Por favor, retorne amanhã.");
        }

        // Se estiver dentro do horário permitido, cria a solicitação normalmente
        return ResponseEntity.ok(solicitacaoService.criarSolicitacao(solicitacao));
    }

    // --- Repassa a empresa logada para prevenir IDOR ---
    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponseDTO> buscarPorId(@PathVariable Long id) {
        Empresa empresaLogada = getEmpresaLogada();
        return ResponseEntity.ok(solicitacaoService.buscarPorId(id, empresaLogada));
    }
    // ----------------------------------

    // LISTAGEM PARA ADMIN (Com ou sem filtro)
    @GetMapping("/admin/todas")
    public ResponseEntity<Page<SolicitacaoResponseDTO>> listarParaAdmin(
            @RequestParam(required = false) Long empresaId,
            @PageableDefault(size = 10, page = 0, sort = "id") Pageable pageable) { // Define o padrão: página 0, 10
                                                                                    

        if (empresaId != null) {
            return ResponseEntity.ok(solicitacaoService.listarPorEmpresa(empresaId, pageable));
        }
        return ResponseEntity.ok(solicitacaoService.listarTodas(pageable));
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<Page<SolicitacaoResponseDTO>> listarPorEmpresa(
            @PathVariable Long empresaId,
            @PageableDefault(size = 10, page = 0, sort = "id") Pageable pageable) {

        return ResponseEntity.ok(solicitacaoService.listarPorEmpresa(empresaId, pageable));
    }

    @GetMapping("/stats/empresa/{empresaId}")
    public ResponseEntity<Map<String, Long>> obterEstatisticas(@PathVariable Long empresaId) {
        return ResponseEntity.ok(solicitacaoService.getEstatisticas(empresaId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String novoStatus = body.get("status");
        String instrutor = body.get("instrutor");
        String sala = body.get("sala");
        String horario = body.get("horario");

        // Repassa todos os dados para o Service
        solicitacaoService.atualizarStatus(id, novoStatus, instrutor, sala, horario);

        return ResponseEntity.ok().build();
    }

    // --- ROTA ATUALIZADA: Repassa a empresa logada para prevenir IDOR ---
    @PutMapping("/{id}/editar")
    public ResponseEntity<Void> editarAgendamento(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Empresa empresaLogada = getEmpresaLogada(); // Captura empresa logada

        String status = body.get("status");
        String instrutor = body.get("instrutor");
        String sala = body.get("sala");
        String horario = body.get("horario");

        String listaParticipantes = body.get("listaParticipantes");

        Integer quantidadeParticipantes = body.get("quantidadeParticipantes") != null
                ? Integer.parseInt(body.get("quantidadeParticipantes").toString())
                : 0;

        String dataStr = body.get("dataSugerida");
        java.time.LocalDate dataSugerida = null;
        if (dataStr != null && !dataStr.trim().isEmpty()) {
            dataSugerida = java.time.LocalDate.parse(dataStr);
        }

        // Repassa a empresaLogada no final
        solicitacaoService.editarAgendamento(id, status, instrutor, sala, horario, dataSugerida, listaParticipantes,
                quantidadeParticipantes, empresaLogada);

        return ResponseEntity.ok().build();
    }
}