package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.dto.EmpresaResponseDTO;
import com.senai.sgp_backend.models.Empresa;
import com.senai.sgp_backend.repositories.EmpresaRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<EmpresaResponseDTO> cadastrar(@RequestBody @Valid Empresa empresa) {
        // Limpeza defensiva do CNPJ
        empresa.setCnpj(empresa.getCnpj().replaceAll("[^0-9]", ""));
        
        empresa.setSenha(passwordEncoder.encode(empresa.getSenha()));
        Empresa salva = empresaRepository.save(empresa);
        
        return ResponseEntity.ok(EmpresaResponseDTO.fromEntity(salva));
    }

    @GetMapping
    public List<EmpresaResponseDTO> listarTodas() {
        return empresaRepository.findAll()
                .stream()
                .map(EmpresaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

}