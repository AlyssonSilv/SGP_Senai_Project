package com.senai.sgp_backend.config;

import com.senai.sgp_backend.exceptions.CnpjJaCadastradoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Erros de Validação (Ex: Formato de e-mail, campos obrigatórios vazios)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    // 2. Erros de Login (Credenciais incorretas no AuthenticationManager)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ou senha inválidos.");
    }

    // 2.5 Erro de Conflito de Negócio (CNPJ duplicado no EmpresaService)
    @ExceptionHandler(CnpjJaCadastradoException.class)
    public ResponseEntity<String> handleCnpjDuplicado(CnpjJaCadastradoException ex) {
        // Retornamos 409 (Conflict), ideal para tentativas de criar recursos duplicados
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    // 3. Recurso não encontrado (Ex: buscar empresa por ID inexistente no banco)
    @ExceptionHandler(jakarta.persistence.EntityNotFoundException.class)
    public ResponseEntity<String> handleNotFound() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("O recurso solicitado não foi encontrado.");
    }

    // 4. Erro Genérico (Segurança: impede o vazamento de stacktraces do servidor)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGenericException(Exception ex) {
        // Em produção, você logaria o erro aqui: logger.error(ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Ocorreu um erro inesperado no servidor. Tente novamente mais tarde.");
    }
}