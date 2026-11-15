package br.com.memora.feira.plataforma;

import br.com.memora.feira.plataforma.Erros.PinInvalidoException;
import br.com.memora.feira.plataforma.Erros.RegraException;
import br.com.memora.feira.plataforma.EstadoDaFeira.Placar;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** O painel de quem conduz o dia. Toda chamada precisa do PIN no cabeçalho X-Pin. */
@RestController
@RequestMapping("/api/organizacao")
public class OrganizacaoController {

    public record NovaEquipe(String equipe) { }

    public record Revelacao(boolean revelado) { }

    public record NovaEntrega(String equipe, boolean ok, String mensagem, String autor) { }

    /** Marca (feito = true) ou desmarca um item do manual para uma equipe. Os pontos vêm do manual. */
    public record ItemAvaliado(String equipe, int ciclo, String item, int pontos, boolean feito) { }

    public record ItemAprovado(String equipe, int ciclo, String item, int pontos) { }

    private final FeiraService feira;
    private final Repositorios.Entregas entregas;
    private final Repositorios.Avaliacoes avaliacoes;
    private final String pin;

    public OrganizacaoController(FeiraService feira, Repositorios.Entregas entregas, Repositorios.Avaliacoes avaliacoes,
            @Value("${feira.pin:feira}") String pin) {
        this.feira = feira;
        this.entregas = entregas;
        this.avaliacoes = avaliacoes;
        this.pin = pin;
    }

    @GetMapping("/conferir")
    public void conferir(@RequestHeader(value = "X-Pin", required = false) String pin) {
        exigirPin(pin);
    }

    @PostMapping("/etapa/{acao}")
    public EstadoDaFeira etapa(@RequestHeader(value = "X-Pin", required = false) String pin, @PathVariable String acao) {
        exigirPin(pin);
        switch (acao) {
            case "proxima" -> feira.proximaEtapa();
            case "anterior" -> feira.etapaAnterior();
            case "mais-um-minuto" -> feira.maisUmMinuto();
            case "reiniciar-relogio" -> feira.reiniciarRelogio();
            default -> throw new RegraException("Ação desconhecida: " + acao);
        }
        return feira.estado();
    }

    @PostMapping("/equipes/sortear")
    public EstadoDaFeira sortear(@RequestHeader(value = "X-Pin", required = false) String pin) {
        exigirPin(pin);
        feira.sortearEquipes();
        return feira.estado();
    }

    @PutMapping("/participantes/{slug}/equipe")
    public EstadoDaFeira definirEquipe(@RequestHeader(value = "X-Pin", required = false) String pin,
            @PathVariable String slug, @RequestBody NovaEquipe nova) {
        exigirPin(pin);
        feira.definirEquipe(slug, nova.equipe());
        return feira.estado();
    }

    @GetMapping("/resultado")
    public List<Placar> resultado(@RequestHeader(value = "X-Pin", required = false) String pin) {
        exigirPin(pin);
        return feira.placar();
    }

    @PostMapping("/resultado")
    public EstadoDaFeira revelar(@RequestHeader(value = "X-Pin", required = false) String pin,
            @RequestBody Revelacao revelacao) {
        exigirPin(pin);
        feira.revelarResultado(revelacao.revelado());
        return feira.estado();
    }

    @PostMapping("/recomecar")
    public EstadoDaFeira recomecar(@RequestHeader(value = "X-Pin", required = false) String pin) {
        exigirPin(pin);
        feira.recomecar();
        return feira.estado();
    }

    /** O que já foi aprovado num ciclo, para o painel marcar as caixinhas. */
    @GetMapping("/avaliacoes")
    public List<ItemAprovado> avaliacoes(@RequestHeader(value = "X-Pin", required = false) String pin,
            @RequestParam int ciclo) {
        exigirPin(pin);
        return avaliacoes.findByCiclo(ciclo).stream()
                .map(a -> new ItemAprovado(a.getEquipe(), a.getCiclo(), a.getItem(), a.getPontos()))
                .toList();
    }

    @PutMapping("/avaliacoes")
    @Transactional
    public EstadoDaFeira avaliar(@RequestHeader(value = "X-Pin", required = false) String pin,
            @RequestBody ItemAvaliado avaliado) {
        exigirPin(pin);
        if (!FeiraService.EQUIPES.contains(avaliado.equipe())) {
            throw new RegraException("Equipe desconhecida: " + avaliado.equipe());
        }
        if (avaliado.ciclo() < 1 || avaliado.ciclo() > 3 || avaliado.item() == null || avaliado.item().isBlank()) {
            throw new RegraException("Item do manual inválido");
        }
        var existente = avaliacoes.findByEquipeAndCicloAndItem(avaliado.equipe(), avaliado.ciclo(), avaliado.item());
        if (avaliado.feito()) {
            Avaliacao avaliacao = existente.orElseGet(() ->
                    new Avaliacao(avaliado.equipe(), avaliado.ciclo(), avaliado.item(), avaliado.pontos()));
            avaliacao.setPontos(Math.max(0, avaliado.pontos()));
            avaliacoes.save(avaliacao);
        } else {
            existente.ifPresent(avaliacoes::delete);
        }
        return feira.estado();
    }

    /** Chamado pelo script do telão a cada push de equipe que ele aceita ou recusa. */
    @PostMapping("/entregas")
    public void registrarEntrega(@RequestHeader(value = "X-Pin", required = false) String pin,
            @RequestBody NovaEntrega nova) {
        exigirPin(pin);
        if (!FeiraService.EQUIPES.contains(nova.equipe())) {
            throw new RegraException("Equipe desconhecida: " + nova.equipe());
        }
        String mensagem = nova.mensagem() == null ? "" : nova.mensagem();
        entregas.save(new Entrega(nova.equipe(), nova.ok(),
                mensagem.length() > 500 ? mensagem.substring(0, 500) : mensagem, nova.autor()));
    }

    private void exigirPin(String recebido) {
        if (recebido == null || !recebido.equals(pin)) {
            throw new PinInvalidoException();
        }
    }
}
