package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.models.Empresa;
import com.senai.sgp_backend.repositories.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "http://localhost:5173") // Libera o acesso para o seu Vite/React
public class EmpresaController {

    @Autowired
    private EmpresaRepository empresaRepository;

    // 1. Cadastrar uma nova empresa (POST)
    @PostMapping
    public Empresa cadastrar(@RequestBody Empresa empresa) {
        // O JPA salva no Neon e retorna o objeto com o ID gerado
        return empresaRepository.save(empresa);
    }

    // 2. Listar todas as empresas (GET)
    @GetMapping
    public List<Empresa> listarTodas() {
        return empresaRepository.findAll();
    }

    // 3. Buscar empresa por CNPJ (Útil para validação no Front-end)
    @GetMapping("/cnpj/{cnpj}")
    public ResponseEntity<Empresa> buscarPorCnpj(@PathVariable String cnpj) {
        return empresaRepository.findByCnpj(cnpj)
                .map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Buscar por ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Empresa> buscarPorId(@PathVariable Long id) {
        return empresaRepository.findById(id)
                .map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build());
    }
}