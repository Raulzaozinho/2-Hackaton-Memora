package br.com.memora.feira.plataforma;

import br.com.memora.feira.plataforma.Erros.RegraException;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;

/**
 * O jeito pronto de guardar e ler coisas no banco, para qualquer barraca.
 *
 * <p>Exemplo de uso dentro do controller de uma equipe:
 * <pre>
 *   registros.salvar("equipe-1", "Ana", "Quero um pastel de queijo");
 *   List&lt;Registro&gt; pedidos = registros.listar("equipe-1");
 * </pre>
 */
@Service
public class Registros {

    private static final Set<String> BARRACAS = Set.of("modelo", "equipe-1", "equipe-2", "equipe-3");

    private final Repositorios.RegistrosDoBanco banco;

    public Registros(Repositorios.RegistrosDoBanco banco) {
        this.banco = banco;
    }

    /** Os 100 registros mais recentes da barraca, do mais novo para o mais antigo. */
    public List<Registro> listar(String barraca) {
        exigirBarraca(barraca);
        return banco.findTop100ByBarracaOrderByIdDesc(barraca);
    }

    public Registro salvar(String barraca, String autor, String texto) {
        return salvar(barraca, autor, texto, null, null);
    }

    public Registro salvar(String barraca, String autor, String texto, String detalhe, Integer numero) {
        exigirBarraca(barraca);
        if (texto == null || texto.isBlank()) {
            throw new RegraException("O texto não pode ficar vazio");
        }
        return banco.save(new Registro(barraca, limpar(autor, 80), limpar(texto, 500), limpar(detalhe, 500), numero));
    }

    private void exigirBarraca(String barraca) {
        if (!BARRACAS.contains(barraca)) {
            throw new RegraException("Barraca desconhecida: " + barraca);
        }
    }

    private String limpar(String valor, int tamanhoMaximo) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        String limpo = valor.trim();
        return limpo.length() > tamanhoMaximo ? limpo.substring(0, tamanhoMaximo) : limpo;
    }
}
