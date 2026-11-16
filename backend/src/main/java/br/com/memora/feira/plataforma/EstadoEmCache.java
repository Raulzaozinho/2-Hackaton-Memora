package br.com.memora.feira.plataforma;

import br.com.memora.feira.plataforma.FeiraController.Cracha;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Supplier;
import org.springframework.stereotype.Component;

/**
 * Todas as telas da sala perguntam o estado a cada 3 segundos. Com o banco no Supabase, cada
 * consulta leva uns 170 ms; sem esta memória, dez telas juntas enfileiravam dezenas de consultas e
 * a resposta chegava a demorar mais de 10 segundos. Aqui o estado é calculado uma vez por segundo,
 * no máximo, e quem pergunta nesse meio-tempo recebe a mesma resposta.
 *
 * Cuidado com travas: quem calcula o estado segura uma conexão do banco. Por isso só o cálculo
 * passa por uma trava (para dez telas não calcularem ao mesmo tempo), e guardar um estado novo não
 * espera nada. Se guardar esperasse a trava, uma ação da organização (com a conexão na mão) e uma
 * tela calculando (com a trava na mão) podiam esperar uma pela outra até o banco desistir.
 *
 * E um cálculo que começou antes nunca substitui um que começou depois: assim o telão não volta
 * a mostrar, por um segundo, os pontos de antes da última marcação da organização.
 */
@Component
public class EstadoEmCache {

    private static final long VALIDADE_DO_ESTADO_MS = 1000;
    private static final long VALIDADE_DOS_CRACHAS_MS = 5000;

    /** "comecou" ordena os cálculos (System.nanoTime no início); "guardadaEm" conta a validade. */
    private record Foto<T>(T valor, long comecou, long guardadaEm) {
        boolean valeAinda(long validade) {
            return System.currentTimeMillis() - guardadaEm < validade;
        }
    }

    private final Object travaDoEstado = new Object();
    private final Object travaDosCrachas = new Object();
    private final AtomicReference<Foto<EstadoDaFeira>> estado = new AtomicReference<>();
    private volatile Foto<List<Cracha>> crachas;

    /** O estado guardado, se ainda vale; senão calcula de novo (uma tela calcula, as outras esperam). */
    public EstadoDaFeira estado(Supplier<EstadoDaFeira> calcular) {
        Foto<EstadoDaFeira> atual = estado.get();
        if (atual != null && atual.valeAinda(VALIDADE_DO_ESTADO_MS)) {
            return atual.valor().comAgora(Instant.now());
        }
        synchronized (travaDoEstado) {
            atual = estado.get();
            if (atual != null && atual.valeAinda(VALIDADE_DO_ESTADO_MS)) {
                return atual.valor().comAgora(Instant.now());
            }
            // O cálculo chama guardar(), que não usa esta trava.
            return calcular.get();
        }
    }

    /**
     * Chamado a cada estado calculado, inclusive logo depois de uma ação da organização. Não espera
     * trava nenhuma e só troca o guardado se este cálculo começou depois do que já está lá.
     */
    public void guardar(EstadoDaFeira novo, long comecou) {
        Foto<EstadoDaFeira> foto = new Foto<>(novo, comecou, System.currentTimeMillis());
        estado.accumulateAndGet(foto, (atual, nova) -> atual == null || nova.comecou() - atual.comecou() >= 0 ? nova : atual);
    }

    public List<Cracha> crachas(Supplier<List<Cracha>> buscar) {
        Foto<List<Cracha>> atual = crachas;
        if (atual != null && atual.valeAinda(VALIDADE_DOS_CRACHAS_MS)) {
            return atual.valor();
        }
        synchronized (travaDosCrachas) {
            atual = crachas;
            if (atual != null && atual.valeAinda(VALIDADE_DOS_CRACHAS_MS)) {
                return atual.valor();
            }
            List<Cracha> lista = buscar.get();
            crachas = new Foto<>(lista, 0, System.currentTimeMillis());
            return lista;
        }
    }

    /** As equipes mudaram: a lista de crachás é buscada de novo na próxima pergunta. */
    public void esquecerCrachas() {
        crachas = null;
    }

    /** Esquece tudo; a próxima pergunta vai ao banco. */
    public void esquecer() {
        estado.set(null);
        crachas = null;
    }
}
