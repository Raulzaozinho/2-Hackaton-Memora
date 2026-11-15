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
7. **O piloto nunca usa IA nem pesquisa.** O copiloto e o repórter podem pesquisar à vontade (Google, documentação, IA) e explicar ao piloto o que fazer. O manual traz, em cada item difícil, o que pesquisar.

## O que cada um faz em cada fase

| Fase | Você | Piloto | Copiloto | Repórter |
|---|---|---|---|---|
| **Aula** (5 min) | Ensina no quadro o assunto do ciclo e as palavras do manual | Assiste | Assiste | Assiste |
| **Missão** (30 min) | Circula, atende copos vermelhos, fiscaliza as espiadas, avisa aos 20 e aos 25 minutos | `git pull`, `node scripts/piloto.mjs`, executa o que o copiloto pede, entrega com `git push` | Abre o manual, explica item por item, pesquisa quando travar, dita a entrega | Abre o painel do piloto, conta o que apareceu, lê e pesquisa os erros, confere no telão se a entrega entrou |
| **Avaliação** (5 min) | Abre cada barraca e marca no painel os itens cumpridos | Descansa | Confere no manual o que deveria ter saído | Acompanha no telão os pontos da equipe |
| **Votação** (5 min) | Chama todos para visitar as barracas | Visita e dá 2 fichas | Visita e dá 2 fichas | Visita e dá 2 fichas |

---

## Abertura (10 min)

- Telão na etapa **Abertura**. Mostre a feira com as três barracas "em montagem".
- Monte as equipes no painel (ou **Sortear equipes**). A ordem define o rodízio.
- Peça para todos entrarem na feira com o e-mail. Cada um vê o próprio papel do ciclo 1 na página da feira.
- Diga as regras e mostre a arrumação: o piloto de frente para o notebook, o copiloto de costas com o manual, o repórter com o painel. Mostre o piloto rodando `node scripts/piloto.mjs` e o repórter abrindo o endereço que termina em `/painel`.
- Abra a **barraca modelo** e faça um pedido nela: "no fim do dia a barraca de vocês faz coisas assim".

## Como dar a aula de 5 minutos

Toda aula tem o mesmo formato, para caber em 5 minutos e ser divertida:

1. **Uma comparação com a feira** (1 min): uma imagem que todo mundo entende.
2. **Um desenho no quadro** (2 min): no máximo três caixas e duas setas.
3. **Uma mágica ao vivo** (1 min): você muda uma linha e a tela muda na hora.
4. **Uma pergunta valendo aplauso** (1 min): quem acertar ganha palmas da turma.

Cada missão tem tarefas fáceis, médias e um desafio, sempre misturando Angular e Spring Boot. A aula explica só o que aparece nos itens médios: os fáceis eles resolvem lendo o manual, e o desafio é para quem quiser ir além.

## Ciclo 1 — Levantar a barraca

**A comparação:** "a barraca tem uma vitrine, que é o Angular, e uma cozinha, que é o Spring Boot. O cliente só vê a vitrine; quem prepara é a cozinha."

**O desenho:**

```
 VITRINE (Angular)                         COZINHA (Spring Boot)
 equipe-N.html   o que aparece             @GetMapping("/destaque")
 equipe-N.ts     as caixinhas (signals)    devolve um Item, que vira JSON
 {{ curtidas() }}  mostra o valor
 (click)="..."     faz algo no clique
```

**A mágica:** na barraca modelo, troque o emoji no `barraca.config.ts` e a página muda sozinha. Depois abra `/api/barracas/modelo/itens` no navegador: "isto é o que a cozinha manda".

**A pergunta:** "se eu quero que o número de curtidas apareça na tela, uso chaves duplas ou parênteses?" (chaves duplas).

**Missão:** nome, slogan, emoji, cor, vitrine e "Quem atende aqui" (fáceis); botão de curtir, visual da vitrine e o endpoint do destaque (médios); o destaque do Java aparecendo na tela (desafio).

## Ciclo 2 — Abastecer a barraca

**A comparação:** "a cozinha manda uma bandeja com vários pratos; o garçom (o `@for`) leva cada prato até a mesa, um por vez."

**O desenho:**

```
Java: List.of(item1, item2, item3)  ──▶  JSON: [ {...}, {...}, {...} ]  ──▶  @for desenha um <li> por item
/itens/{posicao}  →  /itens/0 é o primeiro prato da bandeja
```

**A mágica:** chame três voluntários para serem os itens da lista. Diga "@for, cumprimente cada um" e aperte a mão de um por um. Depois aponte o primeiro: "esse é o `$first`".

**A pergunta:** "na lista do Java, qual é a posição do primeiro item: 0 ou 1?" (0).

Lembre que o novo piloto começa com `git pull`.

**Missão:** os três itens no Java, a resposta pura e o contador (fáceis); a caixinha da lista, a lista na tela, um item só pelo endereço (`@PathVariable`) e os cartões no CSS (médios); o selo de "mais pedido" com `$first` (desafio).

## Intervalo (10 min)

Bom momento para destravar no particular quem ficou para trás.

## Ciclo 3 — Atender o visitante

**A comparação:** "o formulário é o correio da barraca: o visitante escreve a carta, o botão leva até a cozinha, a cozinha guarda no arquivo (o banco), e o mural mostra todas as cartas."

**O desenho:**

```
1. a pessoa digita        →  o texto vai para a caixinha  [(ngModel)]
2. a pessoa clica         →  roda enviar()                 (click)
3. o front manda um POST  →  o Spring Boot grava no banco
4. o front busca de novo  →  o mural mostra a carta nova
```

**A mágica:** faça um pedido na barraca modelo, recarregue a página e mostre que ele continua lá: "está no banco, não na tela". Depois abra `/api/barracas/modelo/surpresa` duas vezes: "o Java sorteou de novo".

**A pergunta:** "por que a gente busca a lista de novo depois de enviar?" (para a carta nova aparecer no mural).

**Missão:** o convite, a lista de recados e o total (fáceis); as caixinhas, o enviar, o formulário e a pescaria no Java (médios); o botão de pescar na tela (desafio).

## Avaliação (5 min, em cada ciclo)

1. No painel da organização, na seção **Avaliação do manual**, o ciclo atual já vem escolhido.
2. Abra cada barraca na feira do telão e marque os itens cumpridos. A linha "O repórter deve ver" do manual diz o que conferir.
3. Os pontos aparecem no telão assim que você marca.

Vale o que está na feira, isto é, o que entrou no telão. Se uma equipe fez mas não entregou, não pontua: é a regra que faz todos entregarem cedo.

## Votação (5 min, em cada ciclo)

1. **Próxima etapa.** A feira libera 2 fichas por pessoa.
2. Todos visitam as barracas das outras equipes e dão as fichas. Não dá para votar na própria.
3. O telão mostra quantas fichas já foram gastas, sem dizer para quem.
4. Na votação, uma pessoa sorteada de cada equipe pode explicar em 1 minuto o item de que mais gostou.

## Premiação (10 min)

1. **Próxima etapa.** O telão mostra "Resultado trancado".
2. Uma rodada rápida: cada pessoa diz **uma frase** com o que aprendeu hoje.
3. Entregue os dois prêmios da organização: **ideia mais criativa** e **melhor trabalho em equipe**.
4. Clique em **Revelar no telão**: cada barraca aparece com os pontos do manual, as fichas e o total.

Se duas ou três barracas empatarem no total, o telão mostra o empate e divide a posição.

## Depois

Pergunte à turma o que foi mais difícil e o que foi mais divertido, e anote. É o material para a próxima edição.
