package br.com.memora.feira.plataforma;

import br.com.memora.feira.plataforma.Erros.RegraException;
import java.util.Map;
import java.util.TreeMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** As regras das fichas: cada pessoa tem um número fixo e só gasta nas barracas das outras equipes. */
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

    @Transactional(readOnly = true)
    public MinhasFichas minhas(String slug) {
        Map<String, Long> porBarraca = new TreeMap<>();
        for (Ficha ficha : fichas.findByParticipante(slug)) {
            porBarraca.merge(ficha.getBarraca(), 1L, Long::sum);
        }
        long gastas = porBarraca.values().stream().mapToLong(Long::longValue).sum();
        return new MinhasFichas(feira.fichasPorPessoa() - gastas, feira.fichasPorPessoa(), porBarraca);
    }

    @Transactional
    public MinhasFichas dar(String slug, String barraca) {
        Participante participante = participanteParaAlterarFichas(slug);
        exigirFeiraAberta();
        if (barraca == null || !FeiraService.EQUIPES.contains(barraca)) {
            throw new RegraException("Essa barraca não recebe fichas");
        }
        if (participante.getEquipe() == null) {
            throw new RegraException("Você ainda não está em uma equipe");
        }
        if (barraca.equals(participante.getEquipe())) {
            throw new RegraException("Não vale dar ficha para a barraca da própria equipe");
        }
        if (fichas.countByParticipante(slug) >= feira.fichasPorPessoa()) {
            throw new RegraException("Suas fichas acabaram");
        }
        fichas.save(new Ficha(slug, barraca));
        return minhas(slug);
    }

    @Transactional
    public MinhasFichas devolver(String slug, String barraca) {
        participanteParaAlterarFichas(slug);
        exigirFeiraAberta();
        Ficha ficha = fichas.findFirstByParticipanteAndBarracaOrderByIdDesc(slug, barraca)
                .orElseThrow(() -> new RegraException("Você não deu ficha para essa barraca"));
        fichas.delete(ficha);
        return minhas(slug);
    }

    private Participante participanteParaAlterarFichas(String slug) {
        return participantes.findBySlug(slug == null ? "" : slug)
                .orElseThrow(() -> new RegraException("Escolha quem você é antes de dar fichas"));
    }

    private void exigirFeiraAberta() {
        if (feira.evento().getEtapa() != Etapa.FEIRA) {
            throw new RegraException("As fichas só valem com a feira aberta");
        }
    }
}
