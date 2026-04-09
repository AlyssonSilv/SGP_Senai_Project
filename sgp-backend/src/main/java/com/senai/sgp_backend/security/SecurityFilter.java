package com.senai.sgp_backend.security;

import com.senai.sgp_backend.repositories.EmpresaRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recoverToken(request);

        // 👉 RASTREADOR 1: Verifica se o React realmente enviou o Token
        if (!request.getRequestURI().contains("/login") && !request.getRequestURI().contains("/empresas")) {
            System.out.println("=================================================");
            System.out.println("RASTREADOR 1 - Token recebido no Header: " + token);
        }

        if (token != null) {
            var cnpj = jwtService.validarToken(token);

            // 👉 RASTREADOR 2: Verifica se o Java conseguiu ler o Token e achar o CNPJ
            System.out.println("RASTREADOR 2 - CNPJ extraído do Token: '" + cnpj + "'");

            if (cnpj != null && !cnpj.isEmpty()) {
                UserDetails empresa = empresaRepository.findByCnpj(cnpj)
                        .orElseThrow(() -> new RuntimeException("Usuário não encontrado no banco"));

                var authentication = new UsernamePasswordAuthenticationToken(empresa, null, empresa.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 👉 RASTREADOR 3: Sucesso total!
                System.out.println("RASTREADOR 3 - Autenticação APROVADA para: " + empresa.getUsername());
            } else {
                // 👉 RASTREADOR 4: Falha na validação
                System.out.println("RASTREADOR ERRO - O Token é inválido, expirou ou a chave secreta está errada.");
            }
            System.out.println("=================================================");
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}