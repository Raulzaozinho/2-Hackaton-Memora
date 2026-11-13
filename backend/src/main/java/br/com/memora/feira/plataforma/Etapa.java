package br.com.memora.feira.plataforma;

/** As etapas do dia, na ordem em que acontecem. O telão mostra a etapa atual e o relógio dela. */
public enum Etapa {
    ABERTURA("Abertura", 10, 0, null, "Regras, equipes e a feira ainda vazia no telão"),
    RODADA_1("Rodada 1 · Levantar a barraca", 30, 1, "Como uma página é montada em componentes", "Nome, cores e texto da barraca aparecem na feira"),
    RODADA_2("Rodada 2 · Abastecer a barraca", 30, 2, "De onde vêm os dados: pedido e resposta", "A barraca mostra uma lista que vem do back-end"),
    INTERVALO("Intervalo", 10, 0, null, "Água, café e esticar as pernas"),
    RODADA_3("Rodada 3 · Atender o visitante", 30, 3, "Clique, estado e salvar", "Um formulário que grava e aparece na lista"),
    RODADA_4("Rodada 4 · A atração", 30, 4, null, "A invenção da equipe: o que faz alguém parar na sua barraca?"),
    FEIRA("Feira aberta", 25, 0, null, "Visite as barracas das outras equipes e gaste suas fichas"),
    PREMIACAO("Premiação", 10, 0, null, "Resultado e uma frase de cada um: o que aprendi hoje");

    public final String titulo;
    public final int minutos;
    /** Número da rodada (1 a 4) ou 0 quando a etapa não é uma rodada. */
    public final int rodada;
    /** Assunto da aula de 5 minutos no quadro, quando houver. */
    public final String quadro;
    public final String entrega;

    Etapa(String titulo, int minutos, int rodada, String quadro, String entrega) {
        this.titulo = titulo;
        this.minutos = minutos;
        this.rodada = rodada;
        this.quadro = quadro;
        this.entrega = entrega;
    }
}
