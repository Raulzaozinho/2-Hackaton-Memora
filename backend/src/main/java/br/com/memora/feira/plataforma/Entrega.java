package br.com.memora.feira.plataforma;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

/** Cada push de uma equipe que o telão recebeu: entrou na feira (ok) ou foi recusado. */
@Entity
public class Entrega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String equipe;
    private boolean ok;
    @Column(length = 500)
    private String mensagem;
    private String autor;
    private Instant criadoEm = Instant.now();

    protected Entrega() { }

    public Entrega(String equipe, boolean ok, String mensagem, String autor) {
        this.equipe = equipe;
        this.ok = ok;
        this.mensagem = mensagem;
        this.autor = autor;
    }

    public String getEquipe() { return equipe; }
    public boolean isOk() { return ok; }
    public String getMensagem() { return mensagem; }
    public String getAutor() { return autor; }
    public Instant getCriadoEm() { return criadoEm; }
}
