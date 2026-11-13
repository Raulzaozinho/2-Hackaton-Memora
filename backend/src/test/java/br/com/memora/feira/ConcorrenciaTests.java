package br.com.memora.feira;

import static org.assertj.core.api.Assertions.assertThat;

import br.com.memora.feira.plataforma.Erros.RegraException;
import br.com.memora.feira.plataforma.FeiraService;
import br.com.memora.feira.plataforma.FichaService;
import java.util.ArrayList;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("teste")
class ConcorrenciaTests {
    @Autowired FeiraService feira;
    @Autowired FichaService fichas;

    @Test
    void cliquesSimultaneosNaoGastamMaisDeCincoFichas() throws Exception {
        feira.recomecar();
        while (!feira.estado().feiraAberta()) feira.proximaEtapa();
        var largada = new CountDownLatch(1);
        var prontos = new CountDownLatch(10);
        try (var tarefas = Executors.newFixedThreadPool(10)) {
            var resultados = new ArrayList<Future<Boolean>>();
            for (int i = 0; i < 10; i++) {
                resultados.add(tarefas.submit(() -> {
                    prontos.countDown();
                    largada.await();
                    try {
                        fichas.dar("demo-1", "equipe-2");
                        return true;
                    } catch (RegraException e) {
                        assertThat(e).hasMessageContaining("acabaram");
                        return false;
                    }
                }));
            }
            boolean todosProntos = prontos.await(10, TimeUnit.SECONDS);
            largada.countDown();
            assertThat(todosProntos).isTrue();
            int aceitas = 0;
            for (var resultado : resultados) if (resultado.get(20, TimeUnit.SECONDS)) aceitas++;
            assertThat(aceitas).isEqualTo(5);
            assertThat(fichas.minhas("demo-1").restantes()).isZero();
        }
    }
}
