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
 */
@Component
public class EstadoEmCache {

    private static final long VALIDADE_DO_ESTADO_MS = 1000;
    private static final long VALIDADE_DOS_CRACHAS_MS = 5000;

    private EstadoDaFeira estado;
    private long estadoCalculadoEm;
    private List<Cracha> crachas;
    private long crachasCalculadosEm;

    /** O estado guardado, se ainda vale; senão calcula de novo (uma tela calcula, as outras esperam). */
    public synchronized EstadoDaFeira estado(Supplier<EstadoDaFeira> calcular) {
        if (estado != null && System.currentTimeMillis() - estadoCalculadoEm < VALIDADE_DO_ESTADO_MS) {
            return estado.comAgora(Instant.now());
        }
        return calcular.get();
    }

    /** Chamado a cada estado calculado, inclusive logo depois de uma ação da organização. */
    public synchronized void guardar(EstadoDaFeira novo) {
        estado = novo;
        estadoCalculadoEm = System.currentTimeMillis();
        // Uma ação da organização pode ter mudado as equipes: os crachás são buscados de novo.
        crachas = null;
    }

    public synchronized List<Cracha> crachas(Supplier<List<Cracha>> buscar) {
        if (crachas == null || System.currentTimeMillis() - crachasCalculadosEm >= VALIDADE_DOS_CRACHAS_MS) {
            crachas = buscar.get();
            crachasCalculadosEm = System.currentTimeMillis();
        }
        return crachas;
    }

    /** Esquece tudo; a próxima pergunta vai ao banco. */
    public synchronized void esquecer() {
        estado = null;
        crachas = null;
    }
}
