package br.com.memora.feira.plataforma;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

/**
 * Um item do manual que a organização conferiu e aprovou para uma equipe num ciclo.
 * Os pontos vêm do manual; existir a linha quer dizer "feito".
 */
@Entity
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String equipe;
    private Integer ciclo;
    /** O identificador do item no manual, como "c1-nome". */
    private String item;
    private Integer pontos;
    private Instant criadoEm = Instant.now();

    protected Avaliacao() { }

    public Avaliacao(String equipe, int ciclo, String item, int pontos) {
        this.equipe = equipe;
        this.ciclo = ciclo;
        this.item = item;
        this.pontos = pontos;
    }

    public Long getId() { return id; }
    public String getEquipe() { return equipe; }
    public Integer getCiclo() { return ciclo; }
    public String getItem() { return item; }
    public Integer getPontos() { return pontos; }
    public void setPontos(Integer pontos) { this.pontos = pontos; }
}
