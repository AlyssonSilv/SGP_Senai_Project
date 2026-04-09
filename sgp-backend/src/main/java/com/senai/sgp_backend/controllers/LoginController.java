package com.senai.sgp_backend.controllers;

import com.senai.sgp_backend.dto.LoginRequestDTO;
import com.senai.sgp_backend.dto.LoginResponseDTO;
import com.senai.sgp_backend.models.Empresa;
import com.senai.sgp_backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login") // Refatorado: Adicionado prefixo /api
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.cnpj(), data.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        
        Empresa empresa = (Empresa) auth.getPrincipal();
        String token = jwtService.gerarToken(empresa);
        
        return ResponseEntity.ok(new LoginResponseDTO(
                token, 
                empresa.getId(), 
                empresa.getRazaoSocial(), 
                empresa.getCnpj(), 
                empresa.getEmail()
        ));
    }
}