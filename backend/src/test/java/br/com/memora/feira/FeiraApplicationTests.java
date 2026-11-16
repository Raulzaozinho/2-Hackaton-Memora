package br.com.memora.feira;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.memora.feira.plataforma.Erros.RegraException;
import br.com.memora.feira.plataforma.EstadoDaFeira;
import br.com.memora.feira.plataforma.EstadoDaFeira.Membro;
import br.com.memora.feira.plataforma.EstadoEmCache;
import br.com.memora.feira.plataforma.FeiraService;
import br.com.memora.feira.plataforma.FichaService;
import br.com.memora.feira.plataforma.Organizadores;
import br.com.memora.feira.plataforma.Registros;
import br.com.memora.feira.plataforma.RegrasAntigasDoBanco;
import br.com.memora.feira.plataforma.Repositorios;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

/** Confere as regras da feira com os nove participantes de demonstração (três por equipe). */
@SpringBootTest
@ActiveProfiles("teste")
class FeiraApplicationTests {

    @Autowired FeiraService feira;
    @Autowired FichaService fichas;
    @Autowired Registros registros;
    @Autowired Repositorios.Participantes participantes;
    @Autowired Repositorios.Eventos eventos;
    @Autowired EstadoEmCache cache;
    @Autowired RegrasAntigasDoBanco regrasAntigas;
    @Autowired JdbcTemplate jdbc;

    @BeforeEach
    void recomecar() {
        feira.recomecar();
    }

    private void irParaAFeira() {
        while (!feira.estado().feiraAberta()) {
            feira.proximaEtapa();
        }
    }

    @Test
    void comecaNaAberturaComTresEquipesDeTres() {
        EstadoDaFeira estado = feira.estado();
        assertThat(estado.etapa().codigo()).isEqualTo("ABERTURA");
        assertThat(estado.terminaEm()).isNull();
        assertThat(estado.equipes()).hasSize(3).allSatisfy(equipe -> assertThat(equipe.membros()).hasSize(3));
        assertThat(estado.fichasTotal()).isZero(); // só há fichas durante a votação
        assertThat(estado.resultado()).isNull();
    }

    @Test
    void cadaPessoaEntraComOProprioEmailSemDiferencaDeMaiusculas() {
        assertThat(feira.estado().entrarComEmail()).isTrue();
        assertThat(participantes.findByEmailIgnoreCase("  Iris@Feira.Demo ".trim()))
                .get().extracting(p -> p.getNome()).isEqualTo("Íris");
        assertThat(participantes.findByEmailIgnoreCase("ninguem@feira.demo")).isEmpty();
    }

    @Autowired br.com.memora.feira.plataforma.Organizadores organizadores;

    @Test
    void aOrganizacaoEntraComEmailMasNaoViraParticipante() {
        assertThat(organizadores.ehOrganizador("Organizacao@feira.demo")).isTrue();
        assertThat(organizadores.ehOrganizador("ana@feira.demo")).isFalse();
        assertThat(participantes.count()).isEqualTo(9);
        assertThat(br.com.memora.feira.plataforma.Organizadores.nomeDoEmail("maria.silva@exemplo.com")).isEqualTo("Maria");
    }

    @Test
    void consultaNaoCriaEventoEnquantoAInicializacaoNaoTerminou() {
        eventos.deleteAll();
        try {
            assertThatThrownBy(() -> feira.estado())
                    .isInstanceOf(br.com.memora.feira.plataforma.Erros.InicializandoException.class);
            assertThat(eventos.count()).isZero();
        } finally {
            feira.inicializar();
        }
        assertThat(feira.estado().etapa().codigo()).isEqualTo("ABERTURA");
    }

    @Test
    void emTresCiclosTodoMundoDaEquipeEPiloto() {
        Set<String> pilotos = new HashSet<>();
        while (true) {
            List<Membro> membros = feira.estado().equipes().get(0).membros();
            if (feira.estado().etapa().rodada() > 0) {
                assertThat(membros).extracting(Membro::papel)
                        .containsExactlyInAnyOrder("piloto", "copiloto", "reporter");
                membros.stream().filter(m -> "piloto".equals(m.papel())).forEach(m -> pilotos.add(m.slug()));
            } else {
                assertThat(membros).extracting(Membro::papel).containsOnlyNulls();
            }
            if (feira.estado().etapa().codigo().equals("PREMIACAO")) break;
            feira.proximaEtapa();
        }
        assertThat(pilotos).hasSize(3);
    }

    @Test
    void fichaSoValeDuranteAVotacao() {
        assertThatThrownBy(() -> fichas.dar("demo-1", "equipe-2"))
                .isInstanceOf(RegraException.class).hasMessageContaining("durante a votação");
    }

    @Test
    void barracaAusenteTemErroDeRegra() {
        irParaAFeira();
        assertThatThrownBy(() -> fichas.dar("demo-1", null))
                .isInstanceOf(RegraException.class).hasMessageContaining("não recebe fichas");
    }

    @Test
    void fecharAVotacaoBloqueiaDevolverEOProximoCicloTemFichasNovas() {
        irParaAFeira();
        fichas.dar("demo-1", "equipe-2");
        assertThat(fichas.minhas("demo-1").restantes()).isEqualTo(1);
        feira.proximaEtapa();
        assertThatThrownBy(() -> fichas.devolver("demo-1", "equipe-2"))
                .isInstanceOf(RegraException.class).hasMessageContaining("durante a votação");
        irParaAFeira(); // votação do ciclo 2
        assertThat(feira.estado().etapa().codigo()).isEqualTo("VOTACAO_2");
        assertThat(fichas.minhas("demo-1").restantes()).isEqualTo(2);
    }

    @Test
    void devolverDuasVezesNaoCriaFichaExtra() {
        irParaAFeira();
        fichas.dar("demo-1", "equipe-2");
        fichas.devolver("demo-1", "equipe-2");
        assertThatThrownBy(() -> fichas.devolver("demo-1", "equipe-2")).isInstanceOf(RegraException.class);
        assertThat(fichas.minhas("demo-1").restantes()).isEqualTo(2);
    }

    @Test
    void quemVoltaAEquipeEntraNoFimMesmoSeHaLacunaNaOrdem() {
        try {
            feira.definirEquipe("demo-4", null);
            feira.definirEquipe("demo-4", "equipe-1");
            assertThat(feira.estado().equipes().get(0).membros()).extracting(Membro::slug)
                    .containsExactly("demo-1", "demo-7", "demo-4");
            feira.definirEquipe("demo-1", "equipe-1");
            assertThat(feira.estado().equipes().get(0).membros()).extracting(Membro::slug)
                    .containsExactly("demo-1", "demo-7", "demo-4");
        } finally {
            for (int i = 0; i < 3; i++) {
                var participante = participantes.findById("demo-" + (i * 3 + 1)).orElseThrow();
                participante.setEquipe("equipe-1");
                participante.setOrdem(i);
                participantes.save(participante);
            }
        }
    }

    @Test
    void naoValeDarFichaParaAPropriaEquipeNemPassarDeDuasPorVotacao() {
        irParaAFeira();
        // demo-1 é da equipe-1
        assertThatThrownBy(() -> fichas.dar("demo-1", "equipe-1"))
                .isInstanceOf(RegraException.class).hasMessageContaining("própria equipe");
        assertThatThrownBy(() -> fichas.dar("demo-1", "modelo"))
                .isInstanceOf(RegraException.class);

        fichas.dar("demo-1", "equipe-2");
        fichas.dar("demo-1", "equipe-3");
        assertThat(fichas.minhas("demo-1").restantes()).isZero();
        assertThatThrownBy(() -> fichas.dar("demo-1", "equipe-2"))
                .isInstanceOf(RegraException.class).hasMessageContaining("acabaram");

        assertThat(fichas.devolver("demo-1", "equipe-2").restantes()).isEqualTo(1);
    }

    @Test
    void resultadoSoApareceDepoisDeRevelado() {
        irParaAFeira();
        fichas.dar("demo-1", "equipe-3");
        fichas.dar("demo-2", "equipe-3");
        fichas.dar("demo-3", "equipe-1");
        assertThat(feira.estado().resultado()).isNull();
        assertThat(feira.estado().fichasGastas()).isEqualTo(3);

        feira.revelarResultado(true);
        assertThat(feira.estado().resultado().get(0).barraca()).isEqualTo("equipe-3");
        assertThat(feira.estado().resultado().get(0).fichas()).isEqualTo(2);
        assertThat(feira.estado().resultado().get(0).total()).isEqualTo(10);
    }

    @Autowired Repositorios.Avaliacoes avaliacoes;

    @Test
    void pontosDoManualSomamComAsFichasNoPlacar() {
        avaliacoes.save(new br.com.memora.feira.plataforma.Avaliacao("equipe-1", 1, "c1-nome", 10));
        avaliacoes.save(new br.com.memora.feira.plataforma.Avaliacao("equipe-1", 1, "c1-cor", 10));
        avaliacoes.save(new br.com.memora.feira.plataforma.Avaliacao("equipe-2", 1, "c1-nome", 10));
        assertThat(feira.estado().equipes().get(0).pontosDoManual()).isEqualTo(20);
        irParaAFeira();
        fichas.dar("demo-1", "equipe-2");
        fichas.dar("demo-3", "equipe-2");
        fichas.dar("demo-4", "equipe-2");
        var placar = feira.placar();
        assertThat(placar.get(0).barraca()).isEqualTo("equipe-2");
        assertThat(placar.get(0).total()).isEqualTo(25); // 10 do manual + 3 fichas x 5
        assertThat(placar).filteredOn(p -> p.barraca().equals("equipe-1")).first()
                .extracting(p -> p.total()).isEqualTo(20L);
        feira.recomecar();
        assertThat(avaliacoes.count()).isZero();
    }

    @Autowired br.com.memora.feira.plataforma.DinamicaService dinamicas;
    @Autowired Repositorios.Entregas entregasDoBanco;

    @Test
    void tresEntregasSeguidasValemComboEUmaRecusaZeraASequencia() {
        entregasDoBanco.deleteAll();
        for (int i = 0; i < 3; i++) {
            entregasDoBanco.save(new br.com.memora.feira.plataforma.Entrega("equipe-3", true, "ok " + i, "Carla"));
            dinamicas.conferirCombo("equipe-3");
        }
        assertThat(feira.pontosExtras("equipe-3")).isEqualTo(5);
        entregasDoBanco.save(new br.com.memora.feira.plataforma.Entrega("equipe-3", false, "não compilou", "Carla"));
        assertThat(feira.sequenciaDeEntregas("equipe-3")).isZero();
        entregasDoBanco.save(new br.com.memora.feira.plataforma.Entrega("equipe-3", true, "voltou", "Carla"));
        dinamicas.conferirCombo("equipe-3");
        assertThat(feira.pontosExtras("equipe-3")).isEqualTo(5);
        entregasDoBanco.deleteAll();
    }

    @Test
    void ajustesCartaEPerguntaAparecemNoEstadoEOPlacarSomaTudo() {
        dinamicas.ajustar("equipe-2", -5, "Espiada comprada");
        dinamicas.ajustar("equipe-2", 10, "Bônus relâmpago");
        assertThat(feira.estado().equipes().get(1).pontosExtras()).isEqualTo(5);
        assertThat(feira.placar()).filteredOn(p -> p.barraca().equals("equipe-2")).first()
                .extracting(p -> p.total()).isEqualTo(5L);
        assertThatThrownBy(() -> dinamicas.ajustar("equipe-2", 0, "nada")).isInstanceOf(RegraException.class);

        dinamicas.mostrarCarta("MUDO");
        assertThat(feira.estado().carta().titulo()).isEqualTo("Copiloto mudo");
        dinamicas.mostrarCarta(null);
        assertThat(feira.estado().carta().codigo()).isNotEqualTo("MUDO");
        dinamicas.encerrarCarta();
        assertThat(feira.estado().carta()).isNull();

        dinamicas.pergunta("proxima");
        dinamicas.pergunta("proxima");
        assertThat(feira.estado().pergunta()).isEqualTo(1);
        dinamicas.pergunta("revelar");
        assertThat(feira.estado().respostaVisivel()).isTrue();

        feira.recomecar();
        assertThat(feira.estado().pergunta()).isNull();
        assertThat(feira.pontosExtras("equipe-2")).isZero();
    }

    @Test
    void registrosSaoGuardadosPorBarraca() {
        registros.salvar("equipe-1", "Ana", "primeiro");
        registros.salvar("equipe-1", "Bruno", "segundo");
        registros.salvar("equipe-2", "Carla", "de outra barraca");

        assertThat(registros.listar("equipe-1")).extracting("texto").startsWith("segundo", "primeiro");
        assertThatThrownBy(() -> registros.salvar("equipe-1", "Ana", "  "))
                .isInstanceOf(RegraException.class);
        assertThatThrownBy(() -> registros.listar("barraca-que-nao-existe"))
                .isInstanceOf(RegraException.class);
    }

    @Test
    void asTelasRecebemOEstadoDaMemoriaEAsAcoesDaOrganizacaoAtualizamNaHora() {
        cache.esquecer();
        int[] calculos = {0};
        EstadoDaFeira primeiro = cache.estado(() -> { calculos[0]++; return feira.estado(); });
        EstadoDaFeira segundo = cache.estado(() -> { calculos[0]++; return feira.estado(); });
        assertThat(calculos[0]).isEqualTo(1);
        assertThat(segundo.equipes()).isEqualTo(primeiro.equipes());
        assertThat(segundo.agora()).isAfterOrEqualTo(primeiro.agora());

        // Depois de uma ação, o controller devolve feira.estado(), que já guarda o estado novo.
        feira.proximaEtapa();
        feira.estado();
        assertThat(cache.estado(() -> { calculos[0]++; return feira.estado(); }).etapa().codigo()).isEqualTo("AULA_1");
        assertThat(calculos[0]).isEqualTo(1);
        cache.esquecer();
    }

    @Test
    void oNomeDaOrganizacaoNaoDependeDeComoOEmailFoiDigitado() {
        assertThat(Organizadores.nomeDoEmail("MARIA.SILVA@EXEMPLO.COM")).isEqualTo("Maria");
        assertThat(Organizadores.nomeDoEmail("maria.silva@exemplo.com")).isEqualTo("Maria");
    }

    @Test
    void umaListaAntigaDeEtapasNoBancoNaoTravaOProximaEtapa() {
        // Como estava no Supabase: o banco só aceitava as etapas do formato anterior.
        // (No H2 dos testes a lista fica no tipo da coluna; no Postgres, numa regra CHECK.)
        jdbc.execute("alter table evento alter column etapa enum('ABERTURA', 'RODADA_1', 'FEIRA')");
        assertThatThrownBy(() -> feira.proximaEtapa()).isNotNull();

        regrasAntigas.remover();
        feira.proximaEtapa();
        assertThat(feira.estado().etapa().codigo()).isEqualTo("AULA_1");
    }

    @Test
    void recomecarApagaOEnsaioInteiroMasNaoAsEquipes() {
        entregasDoBanco.save(new br.com.memora.feira.plataforma.Entrega("equipe-1", true, "ensaio", "Ana"));
        registros.salvar("equipe-1", "Ana", "recado do ensaio");
        var alguem = participantes.findAll().get(0);
        String equipeAntes = alguem.getEquipe();

        feira.recomecar();

        assertThat(entregasDoBanco.count()).isZero();
        assertThat(registros.listar("equipe-1")).isEmpty();
        assertThat(participantes.findById(alguem.getSlug()).orElseThrow().getEquipe()).isEqualTo(equipeAntes).isNotNull();
    }
}
