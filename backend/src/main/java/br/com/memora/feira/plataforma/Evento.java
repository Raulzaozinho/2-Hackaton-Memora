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

    /** A carta de evento em jogo e quando ela sai do telão. */
    @Enumerated(EnumType.STRING)
    private Carta carta;
    private Instant cartaTerminaEm;

    /** A pergunta relâmpago no telão (posição na lista do ciclo) e se a resposta já apareceu. */
    private Integer pergunta;
    private Boolean respostaVisivel;

    /** As equipes com pontos em dobro nas tarefas do manual, separadas por vírgula (ex.: "equipe-1,equipe-3"). */
    private String dobro;

    public Etapa getEtapa() { return etapa; }
    public void setEtapa(Etapa etapa) { this.etapa = etapa; }
    public Instant getTerminaEm() { return terminaEm; }
    public void setTerminaEm(Instant terminaEm) { this.terminaEm = terminaEm; }
    public boolean isResultadoRevelado() { return resultadoRevelado; }
    public void setResultadoRevelado(boolean resultadoRevelado) { this.resultadoRevelado = resultadoRevelado; }
    public Carta getCarta() { return carta; }
    public void setCarta(Carta carta) { this.carta = carta; }
    public Instant getCartaTerminaEm() { return cartaTerminaEm; }
    public void setCartaTerminaEm(Instant cartaTerminaEm) { this.cartaTerminaEm = cartaTerminaEm; }
    public Integer getPergunta() { return pergunta; }
    public void setPergunta(Integer pergunta) { this.pergunta = pergunta; }
    public boolean isRespostaVisivel() { return Boolean.TRUE.equals(respostaVisivel); }
    public void setRespostaVisivel(boolean respostaVisivel) { this.respostaVisivel = respostaVisivel; }

    public java.util.List<String> getEquipesEmDobro() {
        if (dobro == null || dobro.isBlank()) return java.util.List.of();
        return java.util.Arrays.stream(dobro.split(",")).map(String::trim).filter(e -> !e.isEmpty()).toList();
    }

    public void setEmDobro(String equipe, boolean ligado) {
        java.util.List<String> equipes = new java.util.ArrayList<>(getEquipesEmDobro());
        equipes.remove(equipe);
        if (ligado) equipes.add(equipe);
        java.util.Collections.sort(equipes);
        dobro = equipes.isEmpty() ? null : String.join(",", equipes);
    }
}
