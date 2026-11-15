package br.com.memora.feira.plataforma;

import java.util.Locale;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import org.springframework.stereotype.Component;

/**
 * Quem conduz o dia. Entra na feira com o e-mail, como os participantes, mas não está em nenhuma
 * equipe e não dá fichas. Vem da linha "organizacao=" de backend/emails.local.properties.
 * O painel da organização continua pedindo o PIN: o e-mail só diz quem é, não prova.
 */
@Component
public class Organizadores {

    public static final String SLUG = "organizacao";

    private final Set<String> emails = new CopyOnWriteArraySet<>();

    void definir(Set<String> novos) {
        emails.clear();
        novos.forEach(email -> emails.add(email.trim().toLowerCase(Locale.ROOT)));
    }

    public boolean existe() {
        return !emails.isEmpty();
    }

    public boolean ehOrganizador(String email) {
        return email != null && emails.contains(email.trim().toLowerCase(Locale.ROOT));
    }

    /** "maria.silva@exemplo.com" vira "Maria". */
    public static String nomeDoEmail(String email) {
        String inicio = email.trim().split("[@.]")[0];
        return inicio.isEmpty() ? "Organização" : Character.toUpperCase(inicio.charAt(0)) + inicio.substring(1);
    }
}
