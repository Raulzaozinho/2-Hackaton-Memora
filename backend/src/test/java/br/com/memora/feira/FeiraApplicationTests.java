package br.com.memora.feira;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import br.com.memora.feira.plataforma.Erros.RegraException;
import br.com.memora.feira.plataforma.EstadoDaFeira;
import br.com.memora.feira.plataforma.EstadoDaFeira.Membro;
import br.com.memora.feira.plataforma.FeiraService;
import br.com.memora.feira.plataforma.FichaService;
import br.com.memora.feira.plataforma.Registros;
import br.com.memora.feira.plataforma.Repositorios;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
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
        assertThat(estado.fichasTotal()).isEqualTo(45);
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
    void emQuatroRodadasTodoMundoDaEquipeEPiloto() {
        Set<String> pilotos = new HashSet<>();
        feira.proximaEtapa(); // rodada 1
        for (int etapa = 0; etapa < 5; etapa++) {
            List<Membro> membros = feira.estado().equipes().get(0).membros();
            if (feira.estado().etapa().rodada() > 0) {
                assertThat(membros).extracting(Membro::papel)
                        .containsExactlyInAnyOrder("piloto", "copiloto", "reporter");
                membros.stream().filter(m -> "piloto".equals(m.papel())).forEach(m -> pilotos.add(m.slug()));
            } else {
                assertThat(membros).extracting(Membro::papel).containsOnlyNulls();
            }
            feira.proximaEtapa();
        }
        assertThat(pilotos).hasSize(3);
    }

    @Test
    void fichaSoValeComAFeiraAberta() {
        assertThatThrownBy(() -> fichas.dar("demo-1", "equipe-2"))
                .isInstanceOf(RegraException.class).hasMessageContaining("feira aberta");
    }

    @Test
    void barracaAusenteTemErroDeRegra() {
        irParaAFeira();
        assertThatThrownBy(() -> fichas.dar("demo-1", null))
                .isInstanceOf(RegraException.class).hasMessageContaining("não recebe fichas");
    }

    @Test
    void fecharAFeiraTambemBloqueiaDevolverFichas() {
        irParaAFeira();
        fichas.dar("demo-1", "equipe-2");
        feira.proximaEtapa();
        assertThatThrownBy(() -> fichas.devolver("demo-1", "equipe-2"))
                .isInstanceOf(RegraException.class).hasMessageContaining("feira aberta");
        assertThat(fichas.minhas("demo-1").restantes()).isEqualTo(4);
    }

    @Test
    void devolverDuasVezesNaoCriaFichaExtra() {
        irParaAFeira();
        fichas.dar("demo-1", "equipe-2");
        fichas.devolver("demo-1", "equipe-2");
        assertThatThrownBy(() -> fichas.devolver("demo-1", "equipe-2")).isInstanceOf(RegraException.class);
        assertThat(fichas.minhas("demo-1").restantes()).isEqualTo(5);
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
    void naoValeDarFichaParaAPropriaEquipeNemPassarDeCinco() {
        irParaAFeira();
        // demo-1 é da equipe-1
        assertThatThrownBy(() -> fichas.dar("demo-1", "equipe-1"))
                .isInstanceOf(RegraException.class).hasMessageContaining("própria equipe");
        assertThatThrownBy(() -> fichas.dar("demo-1", "modelo"))
                .isInstanceOf(RegraException.class);

        for (int i = 0; i < 5; i++) {
            fichas.dar("demo-1", i % 2 == 0 ? "equipe-2" : "equipe-3");
        }
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
}
