package br.com.memora.feira.barracas.equipe2;

import br.com.memora.feira.barracas.Item;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * O back-end da barraca da EQUIPE 2. Este arquivo é de vocês: podem mexer em tudo.
 *
 * <p>Tudo aqui dentro responde em /api/barracas/equipe-2/...
 * Na dúvida, olhem a barraca modelo: barracas/modelo/ModeloController.java
 */
@RestController
@RequestMapping("/api/barracas/equipe-2")
public class Equipe2Controller {

    /**
     * CICLO 2 — a lista do que a barraca de vocês oferece.
     * Troquem o item de exemplo e acrescentem os de vocês, separados por vírgula.
     */
    @GetMapping("/itens")
    public List<Item> itens() {
        return List.of(
                new Item("🌭", "Cachorro Quente Tradicional ao Molho", "O MAIS PEDIDO"),
                new Item("🌭", "Cachorro Quente na CHAPA", "Um dois mais gostosos"),
                new Item("🌭", "Cachorro Quente Duplo", "Dupla salsicha para se deliciar"));
    }

    // CICLO 1 — o destaque do dia entra aqui.
    @GetMapping("/destaque")
    public Item consultarDestaque() {
        return new Item("🌭", "Dogão completo, com molho da casa", "O destaque do dia");
    }
    

    // CICLO 2 — o endpoint de um item só entra aqui.

    // CICLO 3 — a pescaria entra aqui.
}
