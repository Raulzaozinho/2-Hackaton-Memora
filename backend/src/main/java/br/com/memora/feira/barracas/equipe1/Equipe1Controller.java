package br.com.memora.feira.barracas.equipe1;

import br.com.memora.feira.barracas.Item;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * O back-end da barraca da EQUIPE 1. Este arquivo é de vocês: podem mexer em tudo.
 *
 * <p>Tudo aqui dentro responde em /api/barracas/equipe-1/...
 * Na dúvida, olhem a barraca modelo: barracas/modelo/ModeloController.java
 */
@RestController
@RequestMapping("/api/barracas/equipe-1")
public class Equipe1Controller {

    /**
     * CICLO 2 — a lista do que a barraca de vocês oferece.
     * Troquem o item de exemplo e acrescentem os de vocês, separados por vírgula.
     */
    @GetMapping("/itens")
    public List<Item> itens() {
        return List.of(
                new Item("❓", "Item de exemplo", "Troque por algo que a barraca de vocês oferece"));
    }

    // CICLO 3 · DESAFIO — se a atração de vocês precisar de um endpoint novo, ele entra aqui.
    // O ModeloController tem um exemplo pronto: o método surpresa().
}
