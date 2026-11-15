package br.com.memora.feira.plataforma;

import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

/** Os acessos ao banco da plataforma, juntos num arquivo só para facilitar a leitura. */
public final class Repositorios {

    private Repositorios() { }

    public interface Eventos extends JpaRepository<Evento, Integer> { }

    public interface Participantes extends JpaRepository<Participante, String> {
        // Serializa os cliques da mesma pessoa até a transação terminar.
        @Lock(LockModeType.PESSIMISTIC_WRITE)
        Optional<Participante> findBySlug(String slug);

        Optional<Participante> findByEmailIgnoreCase(String email);

        boolean existsByEmailIsNotNull();
    }

    public interface Fichas extends JpaRepository<Ficha, Long> {
        long countByParticipanteAndCiclo(String participante, Integer ciclo);
        long countByBarraca(String barraca);
        long countByCiclo(Integer ciclo);
        List<Ficha> findByParticipanteAndCiclo(String participante, Integer ciclo);
        Optional<Ficha> findFirstByParticipanteAndBarracaAndCicloOrderByIdDesc(String participante, String barraca, Integer ciclo);
    }

    public interface Avaliacoes extends JpaRepository<Avaliacao, Long> {
        List<Avaliacao> findByCiclo(Integer ciclo);
        List<Avaliacao> findByEquipe(String equipe);
        Optional<Avaliacao> findByEquipeAndCicloAndItem(String equipe, Integer ciclo, String item);
    }

    public interface RegistrosDoBanco extends JpaRepository<Registro, Long> {
        List<Registro> findTop100ByBarracaOrderByIdDesc(String barraca);
    }

    public interface Entregas extends JpaRepository<Entrega, Long> {
        Optional<Entrega> findFirstByEquipeOrderByIdDesc(String equipe);
        long countByEquipeAndOkTrue(String equipe);
    }
}
