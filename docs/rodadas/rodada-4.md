# Rodada 4 — A atração

**Entrega:** a invenção da equipe. O que faz alguém parar na sua barraca e gastar uma ficha nela?
**Tempo:** 30 minutos, sem aula no quadro. **IA liberada,** com a mesma condição: uma pessoa sorteada explica o código.

Vocês já têm as três peças: uma **lista** que vem do back-end, um **formulário** que grava e, se quiserem, um **endpoint novo** no controller da equipe. A atração é uma combinação delas.

Quem pilota começa com `git pull`.

## Como usar os 30 minutos

| Minutos | O quê |
|---|---|
| 0 a 5 | Escolher a ideia. Sem ideia? Sorteiem uma carta abaixo. |
| 5 a 22 | Construir a versão mais simples que funciona. |
| 22 a 27 | Testar como visitante e deixar bonito. |
| 27 a 30 | Entregar: `git add .`, `git commit`, `git push`. Confiram no telão. |

Uma regra de ouro: **entreguem cedo.** Façam um push assim que a primeira versão funcionar e continuem melhorando. O que não entrou no telão até o relógio zerar não vai para a feira.

## Cartas de ideia

**💌 Correio elegante.** O visitante escreve um recado anônimo para alguém da turma. Use o formulário da rodada 3 com dois campos: `texto` para o recado e `detalhe` para o destinatário. Não mande o `autor`.

**🎣 Pescaria.** Um botão "pescar" sorteia um prêmio. Crie um endpoint no controller da equipe que devolve um item aleatório. A barraca modelo tem um igual: o método `surpresa()` em `ModeloController.java` e o botão "Sabor surpresa" em `modelo.html`.

**❓ Quiz.** Três perguntas na tela, o visitante responde e a barraca grava a pontuação no campo `numero` do registro. A lista de registros vira o ranking.

**🗳️ Enquete.** O visitante vota em um dos itens da rodada 2. Cada voto é um registro com o nome do item em `texto`. Mostrem quantos votos cada item tem.

**🎰 Roleta de desafios.** Um botão sorteia um desafio bobo ("fale 10 segundos sem dizer a letra A"). Quem cumprir registra o nome no mural dos corajosos.

**🌟 Barraca do elogio.** O visitante clica e recebe um elogio aleatório com o nome dele. Use `this.feira.meuNome()` para saber quem está na tela.

## Como criar um endpoint novo (se a ideia pedir)

No controller da equipe (`EquipeNController.java`), acrescente um método. Este devolve um item sorteado:

```java
private final Random sorte = new Random();

@GetMapping("/pescar")
public Item pescar() {
    List<Item> premios = itens();
    return premios.get(sorte.nextInt(premios.size()));
}
```

No topo do arquivo, junto dos outros `import`, acrescente `import java.util.Random;`. Reiniciem o back-end.

No front, guardem o resultado numa caixinha e chamem o endpoint no clique:

```ts
  premio = signal<Item | null>(null);

  pescar() {
    this.api.buscar<Item>('equipe-N', 'pescar').subscribe((item) => this.premio.set(item));
  }
```

```html
<button class="botao" (click)="pescar()">🎣 Pescar</button>
@if (premio(); as item) {
  <p>{{ item.emoji }} Você pescou: <strong>{{ item.nome }}</strong>!</p>
}
```

## Depois desta rodada

A feira abre. Cada pessoa recebe 5 fichas para dar às barracas das **outras** equipes. Antes de abrir, quem ainda não falou em nenhuma vitrine faz o pregão da barraca: 1 minuto para convencer a turma a visitar.
