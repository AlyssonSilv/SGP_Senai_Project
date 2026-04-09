package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.models.Empresa;
import com.senai.sgp_backend.repositories.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "http://localhost:5173")
public class EmpresaController {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. Cadastrar uma nova empresa (POST)
    @PostMapping
    public Empresa cadastrar(@RequestBody Empresa empresa) {
        // Criptografando a senha antes de salvar no banco
        String senhaCriptografada = passwordEncoder.encode(empresa.getSenha());
        empresa.setSenha(senhaCriptografada);

        // Salva e retorna o objeto Empresa
        return empresaRepository.save(empresa);
    }

    // 2. Listar todas as empresas (GET)
    @GetMapping
    public List<Empresa> listarTodas() {
        return empresaRepository.findAll();
    }

    // 3. Buscar empresa por CNPJ (AJUSTADO PARA USERDETAILS)
    @GetMapping("/cnpj/{cnpj}")
    public ResponseEntity<Empresa> buscarPorCnpj(@PathVariable String cnpj) {
        return empresaRepository.findByCnpj(cnpj)
                .map(userDetails -> ResponseEntity.ok().body((Empresa) userDetails)) // Faz o cast de UserDetails para Empresa
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. Buscar por ID (GET)
    @GetMapping("/{id}")
    public ResponseEntity<Empresa> buscarPorId(@PathVariable Long id) {
        // O findById continua retornando Optional<Empresa>, então não precisa de cast
        return empresaRepository.findById(id)
                .map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build());
    }
}