# Roteiro do dia — para a organização

Duas horas e quarenta e cinco minutos, em **3 ciclos**. Em cada ciclo, cada pessoa da equipe tem um papel e enxerga só uma parte do trabalho: o piloto executa sem ver o resultado, o copiloto tem o manual e o repórter vê a tela. No ciclo seguinte os papéis giram e a equipe continua o código de onde parou. Em três ciclos, todo mundo passa pelos três papéis.

O painel da organização já traz as etapas nesta ordem: a cada mudança, clique em **Próxima etapa** e o relógio do telão começa sozinho.

| Tempo | Etapa | Duração |
|---|---|---|
| 0:00 | Abertura | 10 min |
| 0:10 | **Ciclo 1** · Aula → Missão → Avaliação → Votação | 5 + 30 + 5 + 5 min |
| 0:55 | **Ciclo 2** · Aula → Missão → Avaliação → Votação | 5 + 30 + 5 + 5 min |
| 1:40 | Intervalo | 10 min |
| 1:50 | **Ciclo 3** · Aula → Missão → Avaliação → Votação | 5 + 30 + 5 + 5 min |
| 2:35 | Premiação | 10 min |

Sobram 15 minutos de folga para as avaliações que demorarem ou para **+1 minuto** no fim de uma missão.

## Como se ganha ponto

- **Manual:** cada item do manual vale pontos (10 a 20). Na avaliação, você abre cada barraca na feira e marca no painel o que a equipe cumpriu. Vale o que **entrou no telão** até o relógio da missão zerar. Cada ciclo vale até 100 pontos.
- **Votação:** depois de cada avaliação, cada pessoa dá **2 fichas** às barracas das outras equipes. Cada ficha vale **5 pontos**.
- **Placar:** os pontos do manual aparecem no telão na hora; as fichas ficam secretas até a premiação.

## As regras, para dizer na abertura

1. **Cada equipe monta uma barraca** dentro da mesma feira, em três missões.
2. **Três papéis, cada um no próprio computador:**
   - **Piloto:** só o editor de código. Não vê o manual nem o navegador.
   - **Copiloto:** só o manual, que abre na página da feira. Não vê a tela do piloto.
   - **Repórter:** só o painel do repórter: a barraca rodando e as mensagens de erro.
3. **Ninguém mostra a tela para ninguém.** Cada equipe tem 2 espiadas de 30 segundos por ciclo no computador do piloto.
4. **A cada ciclo os papéis giram** (o telão mostra quem é quem) e a equipe continua o código de onde parou.
5. **Só pontua o que entrar no telão.** Entreguem cedo e de novo a cada item feito.
6. **Copo vermelho** na mesa quer dizer "travamos".
7. **IA:** não nos ciclos 1 e 2; liberada no ciclo 3, e uma pessoa sorteada da equipe explica o código na votação.

## O que cada um faz em cada fase

| Fase | Você | Piloto | Copiloto | Repórter |
|---|---|---|---|---|
| **Aula** (5 min) | Ensina no quadro o assunto do ciclo e as palavras do manual | Assiste | Assiste | Assiste |
| **Missão** (30 min) | Circula, atende copos vermelhos, fiscaliza as espiadas, avisa aos 20 e aos 25 minutos | `git pull`, `node scripts/piloto.mjs`, executa o que o copiloto pede, entrega com `git push` | Abre o manual, explica item por item, dita a entrega | Abre o painel do piloto, conta o que apareceu, lê os erros, confere no telão se a entrega entrou |
| **Avaliação** (5 min) | Abre cada barraca e marca no painel os itens cumpridos | Descansa | Confere no manual o que deveria ter saído | Acompanha no telão os pontos da equipe |
| **Votação** (5 min) | Chama todos para visitar as barracas | Visita e dá 2 fichas | Visita e dá 2 fichas | Visita e dá 2 fichas |

---

## Abertura (10 min)

- Telão na etapa **Abertura**. Mostre a feira com as três barracas "em montagem".
- Monte as equipes no painel (ou **Sortear equipes**). A ordem define o rodízio.
- Peça para todos entrarem na feira com o e-mail. Cada um vê o próprio papel do ciclo 1 na página da feira.
- Diga as regras e mostre a arrumação: o piloto de frente para o notebook, o copiloto de costas com o manual, o repórter com o painel. Mostre o piloto rodando `node scripts/piloto.mjs` e o repórter abrindo o endereço que termina em `/painel`.
- Abra a **barraca modelo** e faça um pedido nela: "no fim do dia a barraca de vocês faz coisas assim".

## Ciclo 1 — Levantar a barraca

**Aula: como uma página é montada.** Uma página é feita de caixas dentro de caixas, e cada caixa é um componente.

Desenhe um retângulo grande, "a feira"; dentro, a moldura da barraca; dentro dela, destacada, "a página da equipe": "esta caixa é de vocês". Ao lado, quatro fichas:

```
barraca.config.ts → nome, slogan, emoji, cor
equipe-N.html     → o que aparece
equipe-N.css      → como aparece
equipe-N.ts       → os dados e as ações
```

**Palavras do manual:** aspas simples, `<h2>`, `<p>`, `<section>`, `<ul>` e `<li>`. Mostre ao vivo: troque o emoji da barraca modelo e a página atualiza sozinha.

**Missão:** nome, slogan, emoji, cor, título e texto da vitrine (essenciais); visual no CSS e "Quem atende aqui" (bônus); três motivos em lista (desafio).

## Ciclo 2 — Abastecer a barraca

**Aula: pedido e resposta.** O navegador não sabe nada sozinho; ele pede e o back-end responde.

```
[ Navegador ]  ──── pedido ───▶  [ Back-end ]  ────▶  [ Banco ]
   Angular     ◀─── resposta ──   Spring Boot          Supabase
```

Em cima da seta de ida: `GET /api/barracas/modelo/itens`. Na de volta: `[ {nome: "Queijo"}, {nome: "Carne"} ]`. Abra esse endereço no navegador: "isto é a resposta pura, em JSON". Depois mostre o `@GetMapping("/itens")` no `ModeloController.java`.

**Palavras do manual:** `List.of`, `new Item`, signal ("uma caixinha com um valor"), subscribe ("quando a resposta chegar, faça isto"), `@for`. Lembre que o novo piloto começa com `git pull`.

**Missão:** três itens no Java, a resposta pura, a caixinha da lista e a lista na tela (essenciais); contador e `@empty` (bônus); itens com cara de cartão (desafio).

## Intervalo (10 min)

Bom momento para destravar no particular quem ficou para trás.

## Ciclo 3 — Atender o visitante

**Aula: clique, estado e salvar.** Um formulário é um círculo:

```
1. a pessoa digita        →  o texto vai para a caixinha  (ngModel)
2. a pessoa clica         →  roda a função enviar()        (click)
3. o front manda um POST  →  o back-end grava no banco
4. o front pede a lista   →  a tela mostra o registro novo
```

Desenhe a tabela `registro` com as colunas `id`, `barraca`, `autor`, `texto`. Mostre ao vivo: faça um pedido na barraca modelo, recarregue e ele continua lá.

**Palavras do manual:** `[(ngModel)]`, `(click)`, `[disabled]`, `this.carregarRecados()`. IA liberada.

**Missão:** caixinhas, enviar, lista carregada no começo, formulário e lista de recados (essenciais); total de recados (bônus); pescaria com endpoint novo no Java (desafio).

## Avaliação (5 min, em cada ciclo)

1. No painel da organização, na seção **Avaliação do manual**, o ciclo atual já vem escolhido.
2. Abra cada barraca na feira do telão e marque os itens cumpridos. A linha "O repórter deve ver" do manual diz o que conferir.
3. Os pontos aparecem no telão assim que você marca.

Vale o que está na feira, isto é, o que entrou no telão. Se uma equipe fez mas não entregou, não pontua: é a regra que faz todos entregarem cedo.

## Votação (5 min, em cada ciclo)

1. **Próxima etapa.** A feira libera 2 fichas por pessoa.
2. Todos visitam as barracas das outras equipes e dão as fichas. Não dá para votar na própria.
3. O telão mostra quantas fichas já foram gastas, sem dizer para quem.
4. Na votação do ciclo 3, uma pessoa sorteada de cada equipe explica em 1 minuto um trecho do código (a condição da IA).

## Premiação (10 min)

1. **Próxima etapa.** O telão mostra "Resultado trancado".
2. Uma rodada rápida: cada pessoa diz **uma frase** com o que aprendeu hoje.
3. Entregue os dois prêmios da organização: **ideia mais criativa** e **melhor trabalho em equipe**.
4. Clique em **Revelar no telão**: cada barraca aparece com os pontos do manual, as fichas e o total.

Se duas ou três barracas empatarem no total, o telão mostra o empate e divide a posição.

## Depois

Pergunte à turma o que foi mais difícil e o que foi mais divertido, e anote. É o material para a próxima edição.
