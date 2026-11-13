package br.com.memora.feira.plataforma;

import java.io.InputStream;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.json.JsonMapper;

/**
 * Lê os crachás de src/main/resources/crachas quando a aplicação sobe.
 * Cada arquivo .json vira um participante; arquivos que começam com "_" são ignorados.
 */
@Component
public class Crachas {

    private static final Logger log = LoggerFactory.getLogger(Crachas.class);

    record Cracha(String nome, String emoji, String frase) { }

    private static final List<String[]> DEMO = List.of(
            new String[] {"Ana", "🦊"}, new String[] {"Bruno", "🐢"}, new String[] {"Carla", "🦉"},
            new String[] {"Diego", "🐙"}, new String[] {"Elisa", "🦜"}, new String[] {"Fábio", "🐝"},
            new String[] {"Gabi", "🦋"}, new String[] {"Heitor", "🐧"}, new String[] {"Íris", "🐬"});

    private final Repositorios.Participantes participantes;
    private final FeiraService feira;
    private final boolean demo;
    private final JsonMapper json = JsonMapper.builder().build();

    public Crachas(Repositorios.Participantes participantes, FeiraService feira,
            @Value("${feira.demo:false}") boolean demo) {
        this.participantes = participantes;
        this.feira = feira;
        this.demo = demo;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void carregar() throws Exception {
        feira.inicializar();
        // O ensaio usa somente pessoas fictícias, mesmo quando já existem crachás no projeto.
        if (demo) {
            if (participantes.count() == 0) {
                criarParticipantesDeDemonstracao();
            }
            return;
        }
        Resource[] arquivos = new PathMatchingResourcePatternResolver().getResources("classpath:crachas/*.json");
        int lidos = 0;
        for (Resource arquivo : arquivos) {
            String nomeDoArquivo = arquivo.getFilename();
            if (nomeDoArquivo == null || nomeDoArquivo.startsWith("_")) {
                continue;
            }
            String slug = nomeDoArquivo.substring(0, nomeDoArquivo.length() - ".json".length()).toLowerCase();
            try (InputStream conteudo = arquivo.getInputStream()) {
                Cracha cracha = json.readValue(conteudo, Cracha.class);
                if (cracha.nome() == null || cracha.nome().isBlank()) {
                    log.warn("Crachá {} ignorado: falta o campo \"nome\"", nomeDoArquivo);
                    continue;
                }
                salvar(slug, cracha.nome().trim(), cracha.emoji(), cracha.frase());
                lidos++;
            } catch (Exception e) {
                // Um crachá com erro de digitação não pode derrubar a feira de todo mundo.
                log.warn("Crachá {} ignorado: o JSON tem um erro ({})", nomeDoArquivo, e.getMessage());
            }
        }
        log.info("Crachás carregados: {}", lidos);
    }

    private void salvar(String slug, String nome, String emoji, String frase) {
        Participante participante = participantes.findById(slug).orElseGet(() -> new Participante(slug));
        participante.setNome(nome);
        participante.setEmoji(emoji == null || emoji.isBlank() ? "🙂" : emoji.trim());
        participante.setFrase(frase);
        participantes.save(participante);
    }

    /** Só no perfil demo: nove pessoas inventadas, já em equipes, para ensaiar o dia sem os crachás reais. */
    private void criarParticipantesDeDemonstracao() {
        for (int i = 0; i < DEMO.size(); i++) {
            Participante participante = new Participante("demo-" + (i + 1));
            participante.setNome(DEMO.get(i)[0]);
            participante.setEmoji(DEMO.get(i)[1]);
            participante.setFrase("Participante de demonstração");
            participante.setEquipe(FeiraService.EQUIPES.get(i % 3));
            participante.setOrdem(i / 3);
            participantes.save(participante);
        }
        log.info("Perfil demo: {} participantes de demonstração criados", DEMO.size());
    }
}
