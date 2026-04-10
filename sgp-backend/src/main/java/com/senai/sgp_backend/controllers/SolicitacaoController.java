package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.dto.SolicitacaoResponseDTO;
import com.senai.sgp_backend.models.Solicitacao;
import com.senai.sgp_backend.services.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            // Filtra por empresa se o ID for passado
            return ResponseEntity.ok(solicitacaoService.listarPorEmpresa(empresaId));
        }
        // Caso contrário, lista tudo do sistema
        return ResponseEntity.ok(solicitacaoService.listarTodas());
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<SolicitacaoResponseDTO>> listarPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(solicitacaoService.listarPorEmpresa(empresaId));
    }

    @GetMapping("/stats/empresa/{empresaId}")
    public ResponseEntity<java.util.Map<String, Long>> obterEstatisticas(@PathVariable Long empresaId) {
        return ResponseEntity.ok(solicitacaoService.getEstatisticas(empresaId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {

        String novoStatus = body.get("status");
        solicitacaoService.atualizarStatus(id, novoStatus); // Você precisará criar este método no Service
        return ResponseEntity.ok().build();
    }
}