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
    }

    public interface Fichas extends JpaRepository<Ficha, Long> {
        long countByParticipante(String participante);
        long countByBarraca(String barraca);
        List<Ficha> findByParticipante(String participante);
        Optional<Ficha> findFirstByParticipanteAndBarracaOrderByIdDesc(String participante, String barraca);
    }

    public interface RegistrosDoBanco extends JpaRepository<Registro, Long> {
        List<Registro> findTop100ByBarracaOrderByIdDesc(String barraca);
    }

    public interface Entregas extends JpaRepository<Entrega, Long> {
        Optional<Entrega> findFirstByEquipeOrderByIdDesc(String equipe);
        long countByEquipeAndOkTrue(String equipe);
    }
}
