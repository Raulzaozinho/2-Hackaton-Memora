package br.com.memora.feira.plataforma;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import java.time.Instant;

/** O estado do dia. Existe uma linha só, com id 1. */
@Entity
public class Evento {

    @Id
    private Integer id = 1;

    @Enumerated(EnumType.STRING)
    private Etapa etapa = Etapa.ABERTURA;

    /** Quando o relógio da etapa zera. Vazio enquanto o relógio não foi iniciado. */
    private Instant terminaEm;

    private boolean resultadoRevelado;

    public Etapa getEtapa() { return etapa; }
    public void setEtapa(Etapa etapa) { this.etapa = etapa; }
    public Instant getTerminaEm() { return terminaEm; }
    public void setTerminaEm(Instant terminaEm) { this.terminaEm = terminaEm; }
    public boolean isResultadoRevelado() { return resultadoRevelado; }
    public void setResultadoRevelado(boolean resultadoRevelado) { this.resultadoRevelado = resultadoRevelado; }
}
