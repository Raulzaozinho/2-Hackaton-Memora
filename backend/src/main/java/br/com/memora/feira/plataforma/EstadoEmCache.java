package br.com.memora.feira.plataforma;

import br.com.memora.feira.plataforma.FeiraController.Cracha;
import java.time.Instant;
import java.util.List;
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
 */
@Component
public class EstadoEmCache {

    private static final long VALIDADE_DO_ESTADO_MS = 1000;
    private static final long VALIDADE_DOS_CRACHAS_MS = 5000;

    private record Foto<T>(T valor, long tiradaEm) {
        boolean valeAinda(long validade) {
            return System.currentTimeMillis() - tiradaEm < validade;
        }
    }

    private final Object travaDoEstado = new Object();
    private final Object travaDosCrachas = new Object();
    private volatile Foto<EstadoDaFeira> estado;
    private volatile Foto<List<Cracha>> crachas;

    /** O estado guardado, se ainda vale; senão calcula de novo (uma tela calcula, as outras esperam). */
    public EstadoDaFeira estado(Supplier<EstadoDaFeira> calcular) {
        Foto<EstadoDaFeira> atual = estado;
        if (atual != null && atual.valeAinda(VALIDADE_DO_ESTADO_MS)) {
            return atual.valor().comAgora(Instant.now());
        }
        synchronized (travaDoEstado) {
            atual = estado;
            if (atual != null && atual.valeAinda(VALIDADE_DO_ESTADO_MS)) {
                return atual.valor().comAgora(Instant.now());
            }
            // O cálculo chama guardar(), que não usa esta trava.
            return calcular.get();
        }
    }

    /** Chamado a cada estado calculado, inclusive logo depois de uma ação da organização. Não espera trava nenhuma. */
    public void guardar(EstadoDaFeira novo) {
        estado = new Foto<>(novo, System.currentTimeMillis());
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
            crachas = new Foto<>(lista, System.currentTimeMillis());
            return lista;
        }
    }

    /** As equipes mudaram: a lista de crachás é buscada de novo na próxima pergunta. */
    public void esquecerCrachas() {
        crachas = null;
    }

    /** Esquece tudo; a próxima pergunta vai ao banco. */
    public void esquecer() {
        estado = null;
        crachas = null;
    }
}
