package br.com.memora.feira.plataforma;

import br.com.memora.feira.plataforma.Erros.RegraException;
import br.com.memora.feira.plataforma.Erros.InicializandoException;
import br.com.memora.feira.plataforma.EstadoDaFeira.EntregaInfo;
import br.com.memora.feira.plataforma.EstadoDaFeira.EquipeInfo;
import br.com.memora.feira.plataforma.EstadoDaFeira.EtapaInfo;
import br.com.memora.feira.plataforma.EstadoDaFeira.Membro;
import br.com.memora.feira.plataforma.EstadoDaFeira.Placar;
import java.io.File;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** As regras do dia: etapas, relógio, equipes, rodízio de papéis e resultado. */
@Service
public class FeiraService {

    public static final List<String> EQUIPES = List.of("equipe-1", "equipe-2", "equipe-3");
    /** No ciclo 1 a primeira pessoa da equipe é piloto; a cada ciclo os papéis andam uma casa. */
    private static final List<String> PAPEIS = List.of("piloto", "copiloto", "reporter");

    private final Repositorios.Eventos eventos;
    private final Repositorios.Participantes participantes;
    private final Organizadores organizadores;
    private final Repositorios.Fichas fichas;
    private final Repositorios.Entregas entregas;
    private final Repositorios.Avaliacoes avaliacoes;
    private final int fichasPorCiclo;
    private final int pontosPorFicha;
    private final String enderecoConfigurado;
    private final String porta;
    private final String pastaDoFront;

    public FeiraService(Repositorios.Eventos eventos, Repositorios.Participantes participantes,
            Repositorios.Fichas fichas, Repositorios.Entregas entregas,
            Repositorios.Avaliacoes avaliacoes,
            @Value("${feira.fichas-por-ciclo:2}") int fichasPorCiclo,
            @Value("${feira.pontos-por-ficha:5}") int pontosPorFicha,
            @Value("${feira.endereco:}") String enderecoConfigurado,
            @Value("${server.port:8080}") String porta,
            @Value("${spring.web.resources.static-locations:}") String pastaDoFront,
            Organizadores organizadores) {
        this.eventos = eventos;
        this.participantes = participantes;
        this.fichas = fichas;
        this.entregas = entregas;
        this.avaliacoes = avaliacoes;
        this.fichasPorCiclo = fichasPorCiclo;
        this.pontosPorFicha = pontosPorFicha;
        this.enderecoConfigurado = enderecoConfigurado;
        this.porta = porta;
        this.pastaDoFront = pastaDoFront;
        this.organizadores = organizadores;
    }

    public int fichasPorCiclo() {
        return fichasPorCiclo;
    }

    @Transactional
    public Evento evento() {
        return eventos.findById(1).orElseThrow(InicializandoException::new);
    }

    /** Só o carregamento inicial cria o evento; consultas HTTP não disputam essa criação. */
    @Transactional
    public void inicializar() {
        if (!eventos.existsById(1)) eventos.save(new Evento());
    }

    @Transactional
    public EstadoDaFeira estado() {
        Evento evento = evento();
        Etapa etapa = evento.getEtapa();
        List<Participante> todos = participantes.findAll();
        List<EquipeInfo> equipes = EQUIPES.stream().map(id -> equipe(id, todos, etapa.rodada)).toList();
        long comEquipe = todos.stream().filter(p -> p.getEquipe() != null).count();
        return new EstadoDaFeira(
                EtapaInfo.de(etapa),
                Arrays.stream(Etapa.values()).map(EtapaInfo::de).toList(),
                evento.getTerminaEm(),
                Instant.now(),
                etapa.tipo == Etapa.Tipo.VOTACAO,
                evento.isResultadoRevelado(),
                equipes,
                fichas.countByCiclo(etapa.rodada),
                etapa.tipo == Etapa.Tipo.VOTACAO ? comEquipe * fichasPorCiclo : 0,
                evento.isResultadoRevelado() ? placar() : null,
                endereco(),
                versaoDoFront(),
                participantes.existsByEmailIsNotNull() || organizadores.existe());
    }

    /** As barracas ordenadas pelo total: pontos do manual mais as fichas de todas as votações. */
    public List<Placar> placar() {
        return EQUIPES.stream()
                .map(id -> {
                    long manual = pontosDoManual(id);
                    long recebidas = fichas.countByBarraca(id);
                    return new Placar(id, manual, recebidas, manual + recebidas * pontosPorFicha);
                })
                .sorted(Comparator.comparingLong(Placar::total).reversed())
                .toList();
    }

    public long pontosDoManual(String equipe) {
        return avaliacoes.findByEquipe(equipe).stream().mapToLong(a -> a.getPontos() == null ? 0 : a.getPontos()).sum();
    }

    // ---------------------------------------------------------------- etapas e relógio

    @Transactional
    public void proximaEtapa() {
        Evento evento = evento();
        int proxima = evento.getEtapa().ordinal() + 1;
        if (proxima >= Etapa.values().length) {
            throw new RegraException("A premiação já é a última etapa");
        }
        irPara(evento, Etapa.values()[proxima]);
    }

    @Transactional
    public void etapaAnterior() {
        Evento evento = evento();
        int anterior = evento.getEtapa().ordinal() - 1;
        if (anterior < 0) {
            throw new RegraException("A abertura já é a primeira etapa");
        }
        irPara(evento, Etapa.values()[anterior]);
    }

    @Transactional
    public void reiniciarRelogio() {
        Evento evento = evento();
        irPara(evento, evento.getEtapa());
    }

    @Transactional
    public void maisUmMinuto() {
        Evento evento = evento();
        Instant agora = Instant.now();
        Instant base = evento.getTerminaEm() == null || evento.getTerminaEm().isBefore(agora) ? agora : evento.getTerminaEm();
        evento.setTerminaEm(base.plus(Duration.ofMinutes(1)));
    }

    private void irPara(Evento evento, Etapa etapa) {
        evento.setEtapa(etapa);
        evento.setTerminaEm(Instant.now().plus(Duration.ofMinutes(etapa.minutos)));
    }

    @Transactional
    public void revelarResultado(boolean revelado) {
        evento().setResultadoRevelado(revelado);
    }

    /** Volta o dia para o começo: abertura, relógio parado, nenhuma ficha e nenhuma avaliação. */
    @Transactional
    public void recomecar() {
        Evento evento = evento();
        evento.setEtapa(Etapa.ABERTURA);
        evento.setTerminaEm(null);
        evento.setResultadoRevelado(false);
        fichas.deleteAll();
        avaliacoes.deleteAll();
    }

    // ---------------------------------------------------------------- equipes

    /** Embaralha todo mundo e distribui nas três equipes. */
    @Transactional
    public void sortearEquipes() {
        List<Participante> todos = new ArrayList<>(participantes.findAll());
        Collections.shuffle(todos);
        for (int i = 0; i < todos.size(); i++) {
            todos.get(i).setEquipe(EQUIPES.get(i % EQUIPES.size()));
            todos.get(i).setOrdem(i / EQUIPES.size());
        }
    }

    @Transactional
    public void definirEquipe(String slug, String equipe) {
        Participante participante = participantes.findById(slug)
                .orElseThrow(() -> new RegraException("Participante não encontrado: " + slug));
        if (equipe == null || equipe.isBlank()) {
            participante.setEquipe(null);
            participante.setOrdem(null);
            return;
        }
        if (!EQUIPES.contains(equipe)) {
            throw new RegraException("Equipe desconhecida: " + equipe);
        }
        if (equipe.equals(participante.getEquipe())) {
            return;
        }
        int proximaOrdem = participantes.findAll().stream()
                .filter(p -> equipe.equals(p.getEquipe()) && !p.getSlug().equals(slug))
                .mapToInt(p -> p.getOrdem() == null ? -1 : p.getOrdem())
                .max().orElse(-1) + 1;
        participante.setEquipe(equipe);
        participante.setOrdem(proximaOrdem);
    }

    private EquipeInfo equipe(String id, List<Participante> todos, int rodada) {
        List<Participante> daEquipe = todos.stream()
                .filter(p -> id.equals(p.getEquipe()))
                .sorted(Comparator.comparing((Participante p) -> p.getOrdem() == null ? 0 : p.getOrdem())
                        .thenComparing(Participante::getSlug))
                .toList();
        List<Membro> membros = new ArrayList<>();
        for (int i = 0; i < daEquipe.size(); i++) {
            Participante p = daEquipe.get(i);
            membros.add(new Membro(p.getSlug(), p.getNome(), p.getEmoji(), papel(i, daEquipe.size(), rodada)));
        }
        EntregaInfo ultima = entregas.findFirstByEquipeOrderByIdDesc(id)
                .map(e -> new EntregaInfo(e.isOk(), e.getMensagem(), e.getAutor(), e.getCriadoEm()))
                .orElse(null);
        return new EquipeInfo(id, membros, ultima, entregas.countByEquipeAndOkTrue(id), pontosDoManual(id));
    }

    /** Quem está na posição do piloto muda a cada ciclo, então em três ciclos todos digitam. */
    static String papel(int posicao, int tamanhoDaEquipe, int rodada) {
        if (rodada <= 0 || tamanhoDaEquipe == 0) {
            return null;
        }
        int piloto = (rodada - 1) % tamanhoDaEquipe;
        int distancia = Math.floorMod(posicao - piloto, tamanhoDaEquipe);
        return distancia < PAPEIS.size() ? PAPEIS.get(distancia) : "apoio";
    }

    /**
     * No telão o back-end entrega o front compilado de uma pasta. A data do index.html dessa pasta
     * muda a cada compilação, e é assim que as telas abertas descobrem que há uma versão nova.
     */
    private Long versaoDoFront() {
        if (!pastaDoFront.startsWith("file:")) {
            return null;
        }
        File index = new File(pastaDoFront.substring("file:".length()), "index.html");
        return index.exists() ? index.lastModified() : null;
    }

    // ---------------------------------------------------------------- endereço para os outros computadores

    private String enderecoDescoberto;

    /** O endereço desta máquina na rede local, para os outros computadores abrirem a feira. */
    private String endereco() {
        if (!enderecoConfigurado.isBlank()) {
            return enderecoConfigurado;
        }
        if (enderecoDescoberto == null) {
            enderecoDescoberto = descobrirEndereco();
        }
        return enderecoDescoberto.isEmpty() ? null : enderecoDescoberto;
    }

    private String descobrirEndereco() {
        try {
            for (NetworkInterface rede : Collections.list(NetworkInterface.getNetworkInterfaces())) {
                if (!rede.isUp() || rede.isLoopback() || rede.isVirtual()) {
                    continue;
                }
                for (InetAddress ip : Collections.list(rede.getInetAddresses())) {
                    if (ip instanceof Inet4Address && ip.isSiteLocalAddress()) {
                        return "http://" + ip.getHostAddress() + ":" + porta;
                    }
                }
            }
        } catch (Exception e) {
            // Sem rede não há endereço para mostrar; a feira continua funcionando nesta máquina.
        }
        return "";
    }
}
