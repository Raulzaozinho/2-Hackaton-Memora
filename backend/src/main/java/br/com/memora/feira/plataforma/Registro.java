package br.com.memora.feira.plataforma;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

/**
 * Qualquer coisa que uma barraca queira guardar no banco: um pedido, um recado, uma resposta de quiz.
 * Os campos são genéricos de propósito, para servir a todas as barracas.
 */
@Entity
public class Registro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String barraca;
    private String autor;
    @Column(length = 500)
    private String texto;
    @Column(length = 500)
    private String detalhe;
    private Integer numero;
    private Instant criadoEm = Instant.now();

    protected Registro() { }

    public Registro(String barraca, String autor, String texto, String detalhe, Integer numero) {
        this.barraca = barraca;
        this.autor = autor;
        this.texto = texto;
        this.detalhe = detalhe;
        this.numero = numero;
    }

    public Long getId() { return id; }
    public String getBarraca() { return barraca; }
    public String getAutor() { return autor; }
    public String getTexto() { return texto; }
    public String getDetalhe() { return detalhe; }
    public Integer getNumero() { return numero; }
    public Instant getCriadoEm() { return criadoEm; }
}
