package com.senai.sgp_backend.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "empresas")
@Data
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String razaoSocial;

    @Column(unique = true, nullable = false, length = 18)
    private String cnpj;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    private String telefone;

    private String nomeResponsavel;
}