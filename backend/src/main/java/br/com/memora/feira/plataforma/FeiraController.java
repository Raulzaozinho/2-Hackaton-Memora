package br.com.memora.feira.plataforma;

import br.com.memora.feira.plataforma.Erros.RegraException;
import br.com.memora.feira.plataforma.FichaService.MinhasFichas;
import java.util.Comparator;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** O que qualquer pessoa da feira pode consultar e fazer: estado do dia, crachás, registros e fichas. */
@RestController
@RequestMapping("/api")
public class FeiraController {

    public record Cracha(String slug, String nome, String emoji, String frase, String equipe) { }

    public record NovoRegistro(String autor, String texto, String detalhe, Integer numero) { }

    public record PedidoDeFicha(String participante, String barraca) { }

    private final FeiraService feira;
    private final FichaService fichas;
    private final Registros registros;
    private final Repositorios.Participantes participantes;

    public FeiraController(FeiraService feira, FichaService fichas, Registros registros,
            Repositorios.Participantes participantes) {
        this.feira = feira;
        this.fichas = fichas;
        this.registros = registros;
        this.participantes = participantes;
    }

    @GetMapping("/feira/estado")
    public EstadoDaFeira estado() {
        return feira.estado();
    }

    @GetMapping("/participantes")
    public List<Cracha> participantes() {
        return participantes.findAll().stream()
                .sorted(Comparator.comparing(Participante::getNome, String.CASE_INSENSITIVE_ORDER))
                .map(p -> new Cracha(p.getSlug(), p.getNome(), p.getEmoji(), p.getFrase(), p.getEquipe()))
                .toList();
    }

    public record PedidoDeEntrada(String email) { }

    /** Encontra o crachá de quem digitou o e-mail. Sem senha: serve para a feira saber quem é quem. */
    @PostMapping("/entrar")
    public Cracha entrar(@RequestBody PedidoDeEntrada pedido) {
        String email = pedido.email() == null ? "" : pedido.email().trim();
        if (email.isEmpty()) {
            throw new RegraException("Digite o seu e-mail.");
        }
        Participante p = participantes.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RegraException("Esse e-mail não está na lista da feira. Confira se digitou certo."));
        return new Cracha(p.getSlug(), p.getNome(), p.getEmoji(), p.getFrase(), p.getEquipe());
    }

    // Registros: valem para qualquer barraca, então nenhuma equipe precisa escrever estes dois endpoints.

    @GetMapping("/barracas/{barraca}/registros")
    public List<Registro> registros(@PathVariable String barraca) {
        return registros.listar(barraca);
    }

    @PostMapping("/barracas/{barraca}/registros")
    public Registro salvarRegistro(@PathVariable String barraca, @RequestBody NovoRegistro novo) {
        return registros.salvar(barraca, novo.autor(), novo.texto(), novo.detalhe(), novo.numero());
    }

    // Fichas

    @GetMapping("/fichas")
    public MinhasFichas minhasFichas(@RequestParam String participante) {
        return fichas.minhas(participante);
    }

    @PostMapping("/fichas")
    public MinhasFichas darFicha(@RequestBody PedidoDeFicha pedido) {
        return fichas.dar(pedido.participante(), pedido.barraca());
    }

    @DeleteMapping("/fichas")
    public MinhasFichas devolverFicha(@RequestParam String participante, @RequestParam String barraca) {
        return fichas.devolver(participante, barraca);
    }
}
