package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.models.Solicitacao;
import com.senai.sgp_backend.repositories.SolicitacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @PostMapping
    public Solicitacao novaSolicitacao(@RequestBody Solicitacao solicitacao) {
        // Lógica para gerar protocolo automático: CTE + Data + 3 números aleatórios
        String data = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomNum = new Random().nextInt(900) + 100; // Gera entre 100 e 999
        solicitacao.setProtocolo("CTE-" + data + randomNum);

        // Toda nova solicitação começa com status "Nova"
        if (solicitacao.getStatus() == null) {
            solicitacao.setStatus("Nova");
        }

        return solicitacaoRepository.save(solicitacao);
    }

    @GetMapping("/empresa/{empresaId}")
    public List<Solicitacao> listarPorEmpresa(@PathVariable Long empresaId) {
        return solicitacaoRepository.findByEmpresaId(empresaId);
    }

    @GetMapping("/{protocolo}")
    public Solicitacao buscarPorProtocolo(@PathVariable String protocolo) {
        return solicitacaoRepository.findByProtocolo(protocolo)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada"));
    }
}