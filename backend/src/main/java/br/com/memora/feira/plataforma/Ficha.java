package br.com.memora.feira.plataforma;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

/** Uma ficha que um participante deu a uma barraca na votação de um ciclo. */
@Entity
public class Ficha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String participante;
    private String barraca;
    /** Em qual ciclo (1 a 3) a ficha foi dada. Cada ciclo tem a própria votação. */
    private Integer ciclo;
    private Instant criadoEm = Instant.now();

    protected Ficha() { }

    public Ficha(String participante, String barraca, int ciclo) {
        this.participante = participante;
        this.barraca = barraca;
        this.ciclo = ciclo;
    }

    public Long getId() { return id; }
    public String getParticipante() { return participante; }
    public String getBarraca() { return barraca; }
    public Integer getCiclo() { return ciclo; }
    public Instant getCriadoEm() { return criadoEm; }
}
