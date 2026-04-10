package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.repositories.SolicitacaoRepository;
import com.senai.sgp_backend.repositories.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/admin/analitico")
public class AdminAnaliticoController {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @GetMapping("/resumo")
    public ResponseEntity<?> obterResumoGeral() {
        Map<String, Object> stats = new HashMap<>();
        
        // Dados de volume global
        stats.put("totalEmpresas", empresaRepository.count());
        stats.put("totalSolicitacoes", solicitacaoRepository.count());
        
        // Distribuição por Status
        stats.put("novas", solicitacaoRepository.countByStatus("Nova"));
        stats.put("agendadas", solicitacaoRepository.countByStatus("Agendada"));
        stats.put("concluidas", solicitacaoRepository.countByStatus("Concluída"));
        stats.put("canceladas", solicitacaoRepository.countByStatus("Cancelada"));

        return ResponseEntity.ok(stats);
    }
}