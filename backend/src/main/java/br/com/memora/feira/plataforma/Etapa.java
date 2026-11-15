package br.com.memora.feira.plataforma;

/**
 * As etapas do dia, na ordem em que acontecem. O telão mostra a etapa atual e o relógio dela.
 *
 * <p>O dia tem 3 ciclos. Em cada um, a equipe passa por aula, missão (o piloto executa, o copiloto lê
 * o manual e o repórter conta o que aparece), avaliação da organização e votação. No ciclo seguinte
 * os papéis giram e a equipe continua o código de onde parou.
 */
public enum Etapa {
    ABERTURA("Abertura", 10, 0, Tipo.OUTRA, null,
            "Regras, equipes, papéis e como funciona o manual"),

    AULA_1("Ciclo 1 · Aula", 5, 1, Tipo.AULA, "Como uma página é montada em componentes",
            "Prestem atenção: as palavras da aula são as do manual"),
    MISSAO_1("Ciclo 1 · Missão: levantar a barraca", 30, 1, Tipo.MISSAO, null,
            "Nome, cores e vitrine da barraca. Só vale o que entrar no telão"),
    AVALIACAO_1("Ciclo 1 · Avaliação", 5, 1, Tipo.AVALIACAO, null,
            "A organização confere cada item do manual na feira"),
    VOTACAO_1("Ciclo 1 · Votação", 5, 1, Tipo.VOTACAO, null,
            "Visitem as barracas das outras equipes e deem suas fichas"),

    AULA_2("Ciclo 2 · Aula", 5, 2, Tipo.AULA, "De onde vêm os dados: pedido e resposta",
            "Prestem atenção: as palavras da aula são as do manual"),
    MISSAO_2("Ciclo 2 · Missão: abastecer a barraca", 30, 2, Tipo.MISSAO, null,
            "Uma lista que vem do back-end. Só vale o que entrar no telão"),
    AVALIACAO_2("Ciclo 2 · Avaliação", 5, 2, Tipo.AVALIACAO, null,
            "A organização confere cada item do manual na feira"),
    VOTACAO_2("Ciclo 2 · Votação", 5, 2, Tipo.VOTACAO, null,
            "Visitem as barracas das outras equipes e deem suas fichas"),

    INTERVALO("Intervalo", 10, 0, Tipo.OUTRA, null, "Água, café e esticar as pernas"),

    AULA_3("Ciclo 3 · Aula", 5, 3, Tipo.AULA, "Clique, estado e salvar",
            "Prestem atenção: as palavras da aula são as do manual"),
    MISSAO_3("Ciclo 3 · Missão: atender o visitante", 30, 3, Tipo.MISSAO, null,
            "Um formulário que grava no banco. Só vale o que entrar no telão"),
    AVALIACAO_3("Ciclo 3 · Avaliação", 5, 3, Tipo.AVALIACAO, null,
            "A organização confere cada item do manual na feira"),
    VOTACAO_3("Ciclo 3 · Votação", 5, 3, Tipo.VOTACAO, null,
            "Visitem as barracas das outras equipes e deem suas fichas"),

    PREMIACAO("Premiação", 10, 0, Tipo.OUTRA, null,
            "Placar final: pontos do manual mais fichas. E uma frase de cada um");

    public enum Tipo { OUTRA, AULA, MISSAO, AVALIACAO, VOTACAO }

    public final String titulo;
    public final int minutos;
    /** Número do ciclo (1 a 3), ou 0 quando a etapa não faz parte de um ciclo. Os papéis valem o ciclo inteiro. */
    public final int rodada;
    public final Tipo tipo;
    /** Assunto da aula de 5 minutos no quadro, quando houver. */
    public final String quadro;
    public final String entrega;

    Etapa(String titulo, int minutos, int rodada, Tipo tipo, String quadro, String entrega) {
        this.titulo = titulo;
        this.minutos = minutos;
        this.rodada = rodada;
        this.tipo = tipo;
        this.quadro = quadro;
        this.entrega = entrega;
    }
}
