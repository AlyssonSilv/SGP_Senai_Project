package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.dto.SolicitacaoResponseDTO;
import com.senai.sgp_backend.models.Solicitacao;
import com.senai.sgp_backend.services.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService solicitacaoService;

    @PostMapping
    public ResponseEntity<SolicitacaoResponseDTO> criar(@RequestBody @Valid Solicitacao solicitacao) {
        return ResponseEntity.ok(solicitacaoService.criarSolicitacao(solicitacao));
    }

    // LISTAGEM PARA ADMIN (Com ou sem filtro)
    @GetMapping("/admin/todas")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarParaAdmin(
            @RequestParam(required = false) Long empresaId) {
        if (empresaId != null) {
            return ResponseEntity.ok(solicitacaoService.listarPorEmpresa(empresaId));
        }
        return ResponseEntity.ok(solicitacaoService.listarTodas());
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(solicitacaoService.listarPorEmpresa(empresaId));
    }

    @GetMapping("/stats/empresa/{empresaId}")
    public ResponseEntity<Map<String, Long>> obterEstatisticas(@PathVariable Long empresaId) {
        return ResponseEntity.ok(solicitacaoService.getEstatisticas(empresaId));
    }

    // MÉTODO CORRIGIDO
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

    @PutMapping("/{id}/editar")
    public ResponseEntity<Void> editarAgendamento(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");
        String instrutor = body.get("instrutor");
        String sala = body.get("sala");
        String horario = body.get("horario");

        // Trata a conversão da data enviada pelo React
        String dataStr = body.get("dataSugerida");
        java.time.LocalDate dataSugerida = null;
        if (dataStr != null && !dataStr.trim().isEmpty()) {
            dataSugerida = java.time.LocalDate.parse(dataStr);
        }

        solicitacaoService.editarAgendamento(id, status, instrutor, sala, horario, dataSugerida);

        return ResponseEntity.ok().build();
    }
}