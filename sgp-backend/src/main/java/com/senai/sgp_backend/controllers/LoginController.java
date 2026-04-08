package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.models.Empresa;
import com.senai.sgp_backend.repositories.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/login")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    @Autowired
    private EmpresaRepository empresaRepository;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody Map<String, String> dados) {
        String cnpj = dados.get("cnpj");
        String senha = dados.get("senha");

        return empresaRepository.findByCnpj(cnpj)
                .filter(empresa -> empresa.getSenha().equals(senha))
                .map(empresa -> ResponseEntity.ok().body(empresa))
                .orElse(ResponseEntity.status(401).build()); // 401 = Não autorizado
    }
}