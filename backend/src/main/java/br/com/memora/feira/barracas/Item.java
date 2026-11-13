package br.com.memora.feira.barracas;

/**
 * Uma coisa que a barraca oferece: um sabor de pastel, um prêmio, uma pergunta do quiz.
 *
 * <p>É um record: uma classe curtinha que só guarda dados. Para criar um, escreva
 * {@code new Item("🧀", "Queijo", "O clássico que nunca falha")}.
 */
public record Item(String emoji, String nome, String descricao) { }
