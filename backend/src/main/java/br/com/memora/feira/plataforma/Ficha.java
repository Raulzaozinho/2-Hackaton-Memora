package br.com.memora.feira.plataforma;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

/** Uma ficha que um participante deu a uma barraca durante a feira. */
@Entity
public class Ficha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String participante;
    private String barraca;
    private Instant criadoEm = Instant.now();

    protected Ficha() { }

    public Ficha(String participante, String barraca) {
        this.participante = participante;
        this.barraca = barraca;
    }

    public Long getId() { return id; }
    public String getParticipante() { return participante; }
    public String getBarraca() { return barraca; }
    public Instant getCriadoEm() { return criadoEm; }
}
