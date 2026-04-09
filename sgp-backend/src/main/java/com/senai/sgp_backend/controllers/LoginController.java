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
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO data) {
        // 1. Cria um token temporário só com o login e senha digitados
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.cnpj(), data.senha());
        
        // 2. O Spring Security vai no banco (via UserDetails) e compara a senha com o BCrypt
        var auth = this.authenticationManager.authenticate(usernamePassword);
        
        // 3. Se a senha bater, pegamos a empresa autenticada
        Empresa empresa = (Empresa) auth.getPrincipal();
        
        // 4. Geramos o Token JWT real
        String token = jwtService.gerarToken(empresa);
        
        // 5. Devolvemos o Token + os dados da empresa para o React
        return ResponseEntity.ok(new LoginResponseDTO(
                token, 
                empresa.getId(), 
                empresa.getRazaoSocial(), 
                empresa.getCnpj(), 
                empresa.getEmail()
        ));
    }
}