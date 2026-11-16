package br.com.memora.feira.plataforma;

import java.time.Instant;
import java.util.List;

/** Tudo o que o telão e os computadores da sala precisam saber, numa resposta só. */
public record EstadoDaFeira(
        EtapaInfo etapa,
        List<EtapaInfo> etapas,
        Instant terminaEm,
        Instant agora,
        /** Verdadeiro durante a votação de um ciclo: as fichas valem. */
        boolean feiraAberta,
        boolean resultadoRevelado,
        List<EquipeInfo> equipes,
        long fichasGastas,
        long fichasTotal,
        List<Placar> resultado,
        String endereco,
        /** Muda a cada compilação nova do front no telão; as telas abertas usam isso para se recarregar. */
        Long versaoDoFront,
        /** A carta de evento no telão, ou null. */
        CartaInfo carta,
        /** A pergunta relâmpago no telão (posição na lista do ciclo), ou null. */
        Integer pergunta,
        boolean respostaVisivel,
        /** Verdadeiro quando há e-mails cadastrados: cada pessoa entra com o próprio e-mail em vez de escolher numa lista. */
        boolean entrarComEmail) {

    /** "rodada" é o número do ciclo (1 a 3); "tipo" é AULA, MISSAO, AVALIACAO, VOTACAO ou OUTRA. */
    public record EtapaInfo(String codigo, String titulo, int minutos, int rodada, String tipo, String quadro, String entrega) {
        static EtapaInfo de(Etapa etapa) {
            return new EtapaInfo(etapa.name(), etapa.titulo, etapa.minutos, etapa.rodada, etapa.tipo.name(), etapa.quadro, etapa.entrega);
        }
    }

    /** "pontosDoManual" é a soma do que a organização aprovou nas avaliações. As fichas ficam secretas até a premiação. */
    public record EquipeInfo(String id, List<Membro> membros, EntregaInfo ultimaEntrega, long entregas, long pontosDoManual,
            /** Espiadas compradas, bônus, perguntas e combos. */ long pontosExtras,
            /** Entregas aceitas seguidas, sem recusa no meio. */ long sequencia) { }

    public record CartaInfo(String codigo, String emoji, String titulo, String texto, java.time.Instant terminaEm) { }

    /** O papel só existe durante os ciclos: piloto, copiloto, reporter ou apoio. */
    public record Membro(String slug, String nome, String emoji, String papel) { }

    public record EntregaInfo(boolean ok, String mensagem, String autor, Instant quando) { }

    /** Pontos do manual, fichas recebidas em todas as votações e o total (cada ficha vale "pontos-por-ficha"). */
    public record Placar(String barraca, long pontosDoManual, long pontosExtras, long fichas, long total) { }
}
