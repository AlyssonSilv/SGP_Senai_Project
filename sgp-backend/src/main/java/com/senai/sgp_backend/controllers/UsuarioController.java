package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.models.Usuario;
import com.senai.sgp_backend.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public Usuario criarUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Busca todos os usuários de uma empresa específica
    @GetMapping("/empresa/{empresaId}")
    public List<Usuario> listarPorEmpresa(@PathVariable Long empresaId) {
        // O JPA é inteligente o suficiente para filtrar pelo ID da empresa vinculada
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getEmpresa().getId().equals(empresaId))
                .toList();
    }
}