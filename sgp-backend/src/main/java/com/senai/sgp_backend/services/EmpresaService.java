package com.senai.sgp_backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.senai.sgp_backend.dto.EmpresaResponseDTO;
import com.senai.sgp_backend.models.Empresa;
import com.senai.sgp_backend.repositories.EmpresaRepository;

import jakarta.transaction.Transactional;

@Service
public class EmpresaService {
    @Autowired
    private EmpresaRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public EmpresaResponseDTO salvarEmpresa(Empresa empresa) {
        // Validação defensiva extra: verificar se CNPJ já existe
        if (repository.findByCnpj(empresa.getCnpj()).isPresent()) {
            throw new RuntimeException("Este CNPJ já está cadastrado.");
        }

        empresa.setCnpj(empresa.getCnpj().replaceAll("[^0-9]", ""));
        empresa.setSenha(passwordEncoder.encode(empresa.getSenha()));

        Empresa salva = repository.save(empresa);
        return EmpresaResponseDTO.fromEntity(salva);
    }
}
