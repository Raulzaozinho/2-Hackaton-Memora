package br.com.memora.feira.plataforma;

import br.com.memora.feira.plataforma.Erros.RegraException;
import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * As dinâmicas do jogo: cartas de evento, pontos fora do manual (espiada comprada, bônus,
 * pergunta relâmpago), combo de entregas e a pergunta relâmpago da avaliação.
 */
@Service
public class DinamicaService {

    /** A cada 3 entregas aceitas seguidas, sem recusa no meio, a equipe ganha estes pontos. */

    private final FeiraService feira;
    private final Repositorios.Ajustes ajustes;

    public DinamicaService(FeiraService feira, Repositorios.Ajustes ajustes) {
        this.feira = feira;
        this.ajustes = ajustes;
    }

    // ---------------------------------------------------------------- cartas

    /** Mostra uma carta no telão. Sem código, sorteia uma diferente da última. */
    @Transactional
    public Carta mostrarCarta(String codigo) {
        Evento evento = feira.evento();
        Carta carta;
        if (codigo == null || codigo.isBlank()) {
            List<Carta> opcoes = Arrays.stream(Carta.values()).filter(c -> c != evento.getCarta()).toList();
            carta = opcoes.get(ThreadLocalRandom.current().nextInt(opcoes.size()));
        } else {
            try {
                carta = Carta.valueOf(codigo);
            } catch (IllegalArgumentException e) {
                throw new RegraException("Carta desconhecida: " + codigo);
            }
        }
        evento.setCarta(carta);
        evento.setCartaTerminaEm(Instant.now().plus(Duration.ofMinutes(carta.minutos)));
        return carta;
    }

    @Transactional
    public void encerrarCarta() {
        Evento evento = feira.evento();
        evento.setCarta(null);
        evento.setCartaTerminaEm(null);
    }

    // ---------------------------------------------------------------- pontos fora do manual

    @Transactional
    public Ajuste ajustar(String equipe, int pontos, String motivo) {
        if (!FeiraService.EQUIPES.contains(equipe)) {
            throw new RegraException("Equipe desconhecida: " + equipe);
        }
        if (pontos == 0 || Math.abs(pontos) > 50) {
            throw new RegraException("Use um ajuste entre -50 e +50 pontos");
        }
        String texto = motivo == null || motivo.isBlank() ? "Ajuste da organização" : motivo.trim();
        return ajustes.save(new Ajuste(equipe, pontos, texto.length() > 120 ? texto.substring(0, 120) : texto));
    }

    @Transactional
    public void desfazer(long id) {
        ajustes.deleteById(id);
    }

    public List<Ajuste> ajustes() {
        return ajustes.findAllByOrderByIdDesc();
    }

    // O combo agora é calculado pelas tarefas aprovadas (FeiraService.pontosDeCombo), não pelas entregas.

    /** Liga ou desliga os pontos em dobro nas tarefas do manual de uma equipe. */
    @Transactional
    public void pontosEmDobro(String equipe, boolean ligado) {
        if (!FeiraService.EQUIPES.contains(equipe)) {
            throw new RegraException("Equipe desconhecida: " + equipe);
        }
        feira.evento().setEmDobro(equipe, ligado);
    }

    // ---------------------------------------------------------------- pergunta relâmpago

    /** "proxima" mostra a próxima pergunta do ciclo, "revelar" mostra a resposta e "esconder" tira do telão. */
    @Transactional
    public void pergunta(String acao) {
        Evento evento = feira.evento();
        switch (acao) {
            case "proxima" -> {
                evento.setPergunta(evento.getPergunta() == null ? 0 : evento.getPergunta() + 1);
                evento.setRespostaVisivel(false);
            }
            case "revelar" -> {
                if (evento.getPergunta() == null) evento.setPergunta(0);
                evento.setRespostaVisivel(true);
            }
            case "esconder" -> {
                evento.setPergunta(null);
                evento.setRespostaVisivel(false);
            }
            default -> throw new RegraException("Ação desconhecida: " + acao);
        }
    }
}
