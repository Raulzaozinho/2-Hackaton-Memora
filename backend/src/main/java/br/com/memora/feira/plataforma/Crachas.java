package br.com.memora.feira.plataforma;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Properties;
import java.util.Set;
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
    private final String arquivoDeEmails;
    private final JsonMapper json = JsonMapper.builder().build();

    public Crachas(Repositorios.Participantes participantes, FeiraService feira,
            @Value("${feira.demo:false}") boolean demo,
            @Value("${feira.arquivo-de-emails:emails.local.properties}") String arquivoDeEmails) {
        this.participantes = participantes;
        this.feira = feira;
        this.demo = demo;
        this.arquivoDeEmails = arquivoDeEmails;
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
            darEmailsDeDemonstracao();
            return;
        }
        Resource[] arquivos = new PathMatchingResourcePatternResolver().getResources("classpath:crachas/*.json");
        int lidos = 0;
        Set<String> existentes = new HashSet<>();
        for (Resource arquivo : arquivos) {
            String nomeDoArquivo = arquivo.getFilename();
            if (nomeDoArquivo == null || nomeDoArquivo.startsWith("_")) {
                continue;
            }
            String slug = nomeDoArquivo.substring(0, nomeDoArquivo.length() - ".json".length()).toLowerCase();
            existentes.add(slug);
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
        // Quem teve o arquivo do crachá apagado ou renomeado sai da feira (um crachá com erro de JSON continua).
        for (Participante antigo : participantes.findAll()) {
            if (!existentes.contains(antigo.getSlug())) {
                participantes.delete(antigo);
                log.info("Crachá {} saiu da feira: o arquivo {}.json não existe mais", antigo.getSlug(), antigo.getSlug());
            }
        }
        aplicarEmails();
    }

    /**
     * Liga cada crachá a um e-mail, lendo backend/emails.local.properties (uma linha por pessoa:
     * nome-do-arquivo-do-crachá=email). O arquivo fica só na máquina do telão e nunca vai para o Git.
     * Sem o arquivo, ninguém tem e-mail e a feira volta a pedir que cada pessoa escolha o nome numa lista.
     */
    private void aplicarEmails() throws IOException {
        Path arquivo = Path.of(arquivoDeEmails);
        Properties emails = new Properties();
        if (Files.exists(arquivo)) {
            try (Reader leitor = Files.newBufferedReader(arquivo, StandardCharsets.UTF_8)) {
                emails.load(leitor);
            }
        }
        List<Participante> todos = participantes.findAll();
        Set<String> slugs = new HashSet<>();
        List<String> semEmail = new ArrayList<>();
        for (Participante participante : todos) {
            slugs.add(participante.getSlug());
            String email = emails.getProperty(participante.getSlug());
            participante.setEmail(email == null || email.isBlank() ? null : email.trim().toLowerCase(Locale.ROOT));
            if (participante.getEmail() == null) {
                semEmail.add(participante.getSlug());
            }
        }
        participantes.saveAll(todos);
        for (String slug : emails.stringPropertyNames()) {
            if (!slugs.contains(slug)) {
                log.warn("{}: não existe crachá chamado {}.json", arquivo, slug);
            }
        }
        if (emails.isEmpty()) {
            log.info("Sem {}: cada pessoa escolhe o próprio nome numa lista", arquivo);
        } else if (!semEmail.isEmpty()) {
            log.warn("Sem e-mail para entrar na feira: {}", semEmail);
        } else {
            log.info("E-mails cadastrados para todos os {} crachás", todos.size());
        }
    }

    /** No ensaio, cada pessoa inventada entra com nome@feira.demo (ana@feira.demo, iris@feira.demo...). */
    private void darEmailsDeDemonstracao() {
        List<Participante> todos = participantes.findAll();
        for (Participante participante : todos) {
            String semAcento = Normalizer.normalize(participante.getNome(), Normalizer.Form.NFD).replaceAll("\\p{M}", "");
            participante.setEmail(semAcento.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "") + "@feira.demo");
        }
        participantes.saveAll(todos);
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
