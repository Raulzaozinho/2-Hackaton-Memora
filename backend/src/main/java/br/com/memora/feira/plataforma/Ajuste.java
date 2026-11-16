package br.com.memora.feira.plataforma;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;

/**
 * Pontos fora do manual: espiada comprada (-5), bônus relâmpago (+10), pergunta relâmpago (+5)
 * e combo de entregas (+5). Aparecem no telão somados aos pontos do manual.
 */
@Entity
public class Ajuste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String equipe;
    private Integer pontos;
    private String motivo;
    private Instant criadoEm = Instant.now();

    protected Ajuste() { }

    public Ajuste(String equipe, int pontos, String motivo) {
        this.equipe = equipe;
        this.pontos = pontos;
        this.motivo = motivo;
    }

    public Long getId() { return id; }
    public String getEquipe() { return equipe; }
    public Integer getPontos() { return pontos; }
    public String getMotivo() { return motivo; }
    public Instant getCriadoEm() { return criadoEm; }
}
