package br.com.memora.feira.plataforma;

import br.com.memora.feira.plataforma.Erros.RegraException;
import br.com.memora.feira.plataforma.Erros.InicializandoException;
import br.com.memora.feira.plataforma.EstadoDaFeira.CartaInfo;
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
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
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
    private final Repositorios.Ajustes ajustes;
    private final Repositorios.RegistrosDoBanco registros;
    private final int fichasPorCiclo;
    private final int pontosPorFicha;
    /** Falso: o dia não tem votação (as etapas de votação são puladas e as fichas não contam). */
    private boolean votacao;
    private final String enderecoConfigurado;
    private final String porta;
    private final String pastaDoFront;
    private final EstadoEmCache cache;

    public FeiraService(Repositorios.Eventos eventos, Repositorios.Participantes participantes,
            Repositorios.Fichas fichas, Repositorios.Entregas entregas,
            Repositorios.Avaliacoes avaliacoes,
            Repositorios.Ajustes ajustes,
            Repositorios.RegistrosDoBanco registros,
            @Value("${feira.fichas-por-ciclo:2}") int fichasPorCiclo,
            @Value("${feira.pontos-por-ficha:5}") int pontosPorFicha,
            @Value("${feira.votacao:false}") boolean votacao,
            @Value("${feira.endereco:}") String enderecoConfigurado,
            @Value("${server.port:8080}") String porta,
            @Value("${spring.web.resources.static-locations:}") String pastaDoFront,
            Organizadores organizadores,
            EstadoEmCache cache) {
        this.cache = cache;
        this.eventos = eventos;
        this.participantes = participantes;
        this.fichas = fichas;
        this.entregas = entregas;
        this.avaliacoes = avaliacoes;
        this.ajustes = ajustes;
        this.registros = registros;
        this.fichasPorCiclo = fichasPorCiclo;
        this.pontosPorFicha = pontosPorFicha;
        this.votacao = votacao;
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

    /**
     * O estado calculado agora, direto do banco (e guardado para as telas). Faz poucas consultas,
     * todas de uma vez, porque com o Supabase cada consulta custa uns 170 ms.
     */
    @Transactional
    public EstadoDaFeira estado() {
        long comecou = System.nanoTime();
        Evento evento = evento();
        Etapa etapa = evento.getEtapa();
        List<Participante> todos = participantes.findAll();
        Pontuacao pontuacao = pontuacao();
        List<EquipeInfo> equipes = EQUIPES.stream().map(id -> equipe(id, todos, etapa.rodada, pontuacao)).toList();
        long comEquipe = todos.stream().filter(p -> p.getEquipe() != null).count();
        EstadoDaFeira estado = new EstadoDaFeira(
                EtapaInfo.de(etapa),
                etapasDoDia().stream().map(EtapaInfo::de).toList(),
                evento.getTerminaEm(),
                Instant.now(),
                votacao && etapa.tipo == Etapa.Tipo.VOTACAO,
                evento.isResultadoRevelado(),
                equipes,
                votacao ? fichas.countByCiclo(etapa.rodada) : 0,
                votacao && etapa.tipo == Etapa.Tipo.VOTACAO ? comEquipe * fichasPorCiclo : 0,
                evento.isResultadoRevelado() ? placar(pontuacao) : null,
                endereco(),
                versaoDoFront(),
                cartaNoTelao(evento),
                evento.getPergunta(),
                evento.isRespostaVisivel(),
                todos.stream().anyMatch(p -> p.getEmail() != null) || organizadores.existe(),
                evento.getEquipesEmDobro());
        cache.guardar(estado, comecou);
        return estado;
    }

    /** O combo: a cada 3 tarefas do manual aprovadas pela organização, a equipe ganha +5. */
    public static final int TAREFAS_DO_COMBO = 3;
    public static final int PONTOS_DO_COMBO = 5;

    static long pontosDeCombo(long tarefasAprovadas) {
        return (tarefasAprovadas / TAREFAS_DO_COMBO) * PONTOS_DO_COMBO;
    }

    /**
     * Entregas (da mais nova para a mais antiga), pontos do manual, tarefas aprovadas e extras
     * (ajustes da organização mais o combo) de todas as equipes, em três consultas.
     */
    private record Pontuacao(Map<String, List<Entrega>> entregas, Map<String, Long> manual, Map<String, Long> tarefas,
            Map<String, Long> extras) {
        List<Entrega> entregasDe(String equipe) {
            return entregas.getOrDefault(equipe, List.of());
        }
    }

    private Pontuacao pontuacao() {
        Map<String, List<Entrega>> porEquipe = entregas.findAll(Sort.by(Sort.Direction.DESC, "id")).stream()
                .filter(e -> e.getEquipe() != null)
                .collect(Collectors.groupingBy(Entrega::getEquipe));
        List<Avaliacao> aprovadas = avaliacoes.findAll().stream().filter(a -> a.getEquipe() != null).toList();
        Map<String, Long> manual = aprovadas.stream()
                .collect(Collectors.groupingBy(Avaliacao::getEquipe,
                        Collectors.summingLong(a -> a.getPontos() == null ? 0 : a.getPontos())));
        Map<String, Long> tarefas = aprovadas.stream()
                .collect(Collectors.groupingBy(Avaliacao::getEquipe, Collectors.counting()));
        Map<String, Long> extras = new java.util.HashMap<>(ajustes.findAll().stream()
                .filter(a -> a.getEquipe() != null)
                .collect(Collectors.groupingBy(Ajuste::getEquipe,
                        Collectors.summingLong(a -> a.getPontos() == null ? 0 : a.getPontos()))));
        tarefas.forEach((equipe, quantas) -> extras.merge(equipe, pontosDeCombo(quantas), Long::sum));
        return new Pontuacao(porEquipe, manual, tarefas, extras);
    }

    /** As barracas ordenadas pelo total: pontos do manual, extras e as fichas de todas as votações. */
    @Transactional
    public List<Placar> placar() {
        return placar(pontuacao());
    }

    private List<Placar> placar(Pontuacao pontuacao) {
        // Sem votação, as fichas não contam no placar.
        Map<String, Long> recebidas = votacao
                ? fichas.findAll().stream().collect(Collectors.groupingBy(Ficha::getBarraca, Collectors.counting()))
                : Map.of();
        return EQUIPES.stream()
                .map(id -> {
                    long manual = pontuacao.manual().getOrDefault(id, 0L);
                    long extras = pontuacao.extras().getOrDefault(id, 0L);
                    long fichasDaBarraca = recebidas.getOrDefault(id, 0L);
                    return new Placar(id, manual, extras, fichasDaBarraca, manual + extras + fichasDaBarraca * pontosPorFicha);
                })
                .sorted(Comparator.comparingLong(Placar::total).reversed())
                .toList();
    }

    private static long sequencia(List<Entrega> daMaisNova) {
        long seguidas = 0;
        for (Entrega entrega : daMaisNova) {
            if (!entrega.isOk()) break;
            seguidas++;
        }
        return seguidas;
    }

    /** Ajustes da organização (espiadas, bônus, perguntas) mais o combo de tarefas. */
    public long pontosExtras(String equipe) {
        long ajustados = ajustes.findByEquipe(equipe).stream().mapToLong(a -> a.getPontos() == null ? 0 : a.getPontos()).sum();
        return ajustados + pontosDeCombo(avaliacoes.findByEquipe(equipe).size());
    }

    /** Quantas entregas aceitas seguidas a equipe tem, contando da mais recente até a última recusa. */
    public long sequenciaDeEntregas(String equipe) {
        return sequencia(entregas.findByEquipeOrderByIdDesc(equipe));
    }

    private CartaInfo cartaNoTelao(Evento evento) {
        Carta carta = evento.getCarta();
        if (carta == null || evento.getCartaTerminaEm() == null || evento.getCartaTerminaEm().isBefore(Instant.now())) {
            return null;
        }
        return new CartaInfo(carta.name(), carta.emoji, carta.titulo, carta.texto, evento.getCartaTerminaEm());
    }

    public long pontosDoManual(String equipe) {
        return avaliacoes.findByEquipe(equipe).stream().mapToLong(a -> a.getPontos() == null ? 0 : a.getPontos()).sum();
    }

    // ---------------------------------------------------------------- etapas e relógio

    /** Quanto vale uma tarefa para quem está com o bônus ligado (1,5x, arredondado). */
    public static final double BONUS_DE_RECUPERACAO = 1.5;

    /** Os pontos de uma tarefa do manual para a equipe: 1,5x quando a organização ligou o bônus dela. */
    public int pontosDaTarefa(String equipe, int pontos) {
        return evento().getEquipesEmDobro().contains(equipe) ? (int) Math.round(pontos * BONUS_DE_RECUPERACAO) : pontos;
    }

    public boolean temVotacao() {
        return votacao;
    }

    /** As etapas que acontecem hoje: sem votação, as etapas de votação ficam de fora. */
    public List<Etapa> etapasDoDia() {
        return Arrays.stream(Etapa.values()).filter(e -> votacao || e.tipo != Etapa.Tipo.VOTACAO).toList();
    }

    @Transactional
    public void proximaEtapa() {
        Evento evento = evento();
        Etapa proxima = Arrays.stream(Etapa.values())
                .filter(e -> e.ordinal() > evento.getEtapa().ordinal())
                .filter(e -> votacao || e.tipo != Etapa.Tipo.VOTACAO)
                .findFirst()
                .orElseThrow(() -> new RegraException("A premiação já é a última etapa"));
        irPara(evento, proxima);
    }

    @Transactional
    public void etapaAnterior() {
        Evento evento = evento();
        Etapa anterior = Arrays.stream(Etapa.values())
                .filter(e -> e.ordinal() < evento.getEtapa().ordinal())
                .filter(e -> votacao || e.tipo != Etapa.Tipo.VOTACAO)
                .reduce((primeira, segunda) -> segunda)
                .orElseThrow(() -> new RegraException("A abertura já é a primeira etapa"));
        irPara(evento, anterior);
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

    /**
     * Volta o dia para o começo: abertura, relógio parado, sem fichas, avaliações, extras, entregas
     * nem recados. Assim um ensaio na manhã do evento não deixa rastro. Equipes e crachás ficam.
     */
    @Transactional
    public void recomecar() {
        Evento evento = evento();
        evento.setEtapa(Etapa.ABERTURA);
        evento.setTerminaEm(null);
        evento.setResultadoRevelado(false);
        // deleteAllInBatch: um DELETE por tabela. O deleteAll() apagava linha por linha.
        fichas.deleteAllInBatch();
        avaliacoes.deleteAllInBatch();
        ajustes.deleteAllInBatch();
        entregas.deleteAllInBatch();
        registros.deleteAllInBatch();
        evento.setCarta(null);
        evento.setCartaTerminaEm(null);
        evento.setPergunta(null);
        evento.setRespostaVisivel(false);
        for (String equipe : EQUIPES) evento.setEmDobro(equipe, false);
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
        cache.esquecerCrachas();
    }

    @Transactional
    public void definirEquipe(String slug, String equipe) {
        cache.esquecerCrachas();
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

    private EquipeInfo equipe(String id, List<Participante> todos, int rodada, Pontuacao pontuacao) {
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
        List<Entrega> entregasDaEquipe = pontuacao.entregasDe(id);
        EntregaInfo ultima = entregasDaEquipe.stream().findFirst()
                .map(e -> new EntregaInfo(e.isOk(), e.getMensagem(), e.getAutor(), e.getCriadoEm()))
                .orElse(null);
        long aceitas = entregasDaEquipe.stream().filter(Entrega::isOk).count();
        return new EquipeInfo(id, membros, ultima, aceitas, pontuacao.manual().getOrDefault(id, 0L),
                pontuacao.extras().getOrDefault(id, 0L), pontuacao.tarefas().getOrDefault(id, 0L));
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
