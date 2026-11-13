package br.com.memora.feira.plataforma;

import java.time.Instant;
import java.util.List;

/** Tudo o que o telão e os celulares precisam saber, numa resposta só. */
public record EstadoDaFeira(
        EtapaInfo etapa,
        List<EtapaInfo> etapas,
        Instant terminaEm,
        Instant agora,
        boolean feiraAberta,
        boolean resultadoRevelado,
        List<EquipeInfo> equipes,
        long fichasGastas,
        long fichasTotal,
        List<Placar> resultado,
        String endereco,
        /** Muda a cada compilação nova do front no telão; as telas abertas usam isso para se recarregar. */
        Long versaoDoFront) {

    public record EtapaInfo(String codigo, String titulo, int minutos, int rodada, String quadro, String entrega) {
        static EtapaInfo de(Etapa etapa) {
            return new EtapaInfo(etapa.name(), etapa.titulo, etapa.minutos, etapa.rodada, etapa.quadro, etapa.entrega);
        }
    }

    public record EquipeInfo(String id, List<Membro> membros, EntregaInfo ultimaEntrega, long entregas) { }

    /** O papel só existe durante as rodadas: piloto, copiloto, reporter ou apoio. */
    public record Membro(String slug, String nome, String emoji, String papel) { }

    public record EntregaInfo(boolean ok, String mensagem, String autor, Instant quando) { }

    public record Placar(String barraca, long fichas) { }
}
