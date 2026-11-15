package br.com.memora.feira.barracas.modelo;

import br.com.memora.feira.barracas.Item;
import java.util.List;
import java.util.Random;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BARRACA MODELO — a Barraca do Pastel. Está completa e serve de consulta: copie daqui à vontade.
 *
 * <p>Um controller recebe os pedidos que chegam do front e devolve as respostas.
 * Tudo aqui dentro responde em /api/barracas/modelo/...
 */
@RestController
@RequestMapping("/api/barracas/modelo")
public class ModeloController {

    private static final List<Item> SABORES = List.of(
            new Item("🧀", "Queijo", "O clássico que nunca falha"),
            new Item("🥩", "Carne", "Bem temperada, com azeitona"),
            new Item("🍫", "Chocolate", "Para quem pula direto para a sobremesa"),
            new Item("🌽", "Milho com catupiry", "O queridinho da barraca"));

    private final Random sorte = new Random();

    /** CICLO 2 — a lista do que a barraca oferece. O front pede em GET /api/barracas/modelo/itens. */
    @GetMapping("/itens")
    public List<Item> itens() {
        return SABORES;
    }

    /** CICLO 3 · DESAFIO — um endpoint inventado pela barraca: sorteia um sabor surpresa a cada pedido. */
    @GetMapping("/surpresa")
    public Item surpresa() {
        return SABORES.get(sorte.nextInt(SABORES.size()));
    }
}
