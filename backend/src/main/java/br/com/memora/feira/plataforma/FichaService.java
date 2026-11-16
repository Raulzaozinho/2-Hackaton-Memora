package br.com.memora.feira.plataforma;

import br.com.memora.feira.plataforma.Erros.RegraException;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * As regras das fichas: em cada votação (uma por ciclo) cada pessoa tem um número fixo de fichas
 * e só pode dá-las às barracas das outras equipes.
 */
@Service
public class FichaService {

    public record MinhasFichas(long restantes, long total, Map<String, Long> porBarraca) { }

    private final Repositorios.Fichas fichas;
    private final Repositorios.Participantes participantes;
    private final FeiraService feira;

    public FichaService(Repositorios.Fichas fichas, Repositorios.Participantes participantes, FeiraService feira) {
        this.fichas = fichas;
        this.participantes = participantes;
        this.feira = feira;
    }

    /** As fichas da pessoa no ciclo atual. */
    @Transactional(readOnly = true)
    public MinhasFichas minhas(String slug) {
        int ciclo = feira.evento().getEtapa().rodada;
        Map<String, Long> porBarraca = new TreeMap<>();
        for (Ficha ficha : fichas.findByParticipanteAndCiclo(slug, ciclo)) {
            porBarraca.merge(ficha.getBarraca(), 1L, Long::sum);
        }
        long gastas = porBarraca.values().stream().mapToLong(Long::longValue).sum();
        return new MinhasFichas(feira.fichasPorCiclo() - gastas, feira.fichasPorCiclo(), porBarraca);
    }

    @Transactional
    public MinhasFichas dar(String slug, String barraca) {
        Participante participante = participanteParaAlterarFichas(slug);
        int ciclo = cicloDaVotacao();
        if (barraca == null || !FeiraService.EQUIPES.contains(barraca)) {
            throw new RegraException("Essa barraca não recebe fichas");
        }
        if (participante.getEquipe() == null) {
            throw new RegraException("Você ainda não está em uma equipe");
        }
        if (barraca.equals(participante.getEquipe())) {
            throw new RegraException("Não vale dar ficha para a barraca da própria equipe");
        }
        if (fichas.countByParticipanteAndCiclo(slug, ciclo) >= feira.fichasPorCiclo()) {
            throw new RegraException("Suas fichas desta votação acabaram");
        }
        fichas.save(new Ficha(slug, barraca, ciclo));
        return minhas(slug);
    }

    @Transactional
    public MinhasFichas devolver(String slug, String barraca) {
        participanteParaAlterarFichas(slug);
        int ciclo = cicloDaVotacao();
        Ficha ficha = fichas.findFirstByParticipanteAndBarracaAndCicloOrderByIdDesc(slug, barraca, ciclo)
                .orElseThrow(() -> new RegraException("Você não deu ficha para essa barraca nesta votação"));
        fichas.delete(ficha);
        return minhas(slug);
    }

    private Participante participanteParaAlterarFichas(String slug) {
        return participantes.findBySlug(slug == null ? "" : slug)
                .orElseThrow(() -> new RegraException("Entre com o seu e-mail antes de dar fichas"));
    }

    private int cicloDaVotacao() {
        Etapa etapa = feira.evento().getEtapa();
        if (!feira.temVotacao()) {
            throw new RegraException("Hoje não tem votação");
        }
        if (etapa.tipo != Etapa.Tipo.VOTACAO) {
            throw new RegraException("As fichas só valem durante a votação");
        }
        return etapa.rodada;
    }
}
