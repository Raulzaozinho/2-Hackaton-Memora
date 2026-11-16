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
- **Extras:** espiada comprada (−5), bônus relâmpago (+10), pergunta relâmpago (+5) e combo de 3 entregas seguidas (+5, automático).
- **Placar:** os pontos do manual e os extras aparecem no telão na hora; as fichas ficam secretas até a premiação.

## As dinâmicas (todas no painel da organização, seção 🎲 Dinâmicas)

| Dinâmica | Quando | Como funciona |
|---|---|---|
| 🃏 **Carta de evento** | Uma por missão, perto dos 15 minutos | Você sorteia (ou escolhe) e o telão mostra a carta com um relógio próprio: copiloto mudo, troca relâmpago, bônus relâmpago (+10 para quem entregar primeiro), modo papagaio, sim ou não, espiada de presente |
| 👀 **Espiada comprada** | Quando uma equipe já usou as 2 espiadas do ciclo | A equipe pede, você clica em "Espiada comprada −5" e ela ganha mais 30 segundos de espiada |
| 🔥 **Combo de entregas** | Sozinho, o tempo todo | A cada 3 entregas aceitas seguidas, sem recusa no meio, a equipe ganha +5. O telão mostra 🔥 com a sequência atual |
| ⚡ **Pergunta relâmpago** | Durante a avaliação | Enquanto você confere as barracas, o telão mostra uma pergunta sobre a aula do ciclo. Quem responder primeiro em voz alta ganha +5 (botão "Pergunta relâmpago +5"). "Revelar resposta" mostra a resposta no telão |

Errou um clique? A lista de ajustes no painel tem **Desfazer**.

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
| **Missão** (30 min) | Circula, atende copos vermelhos, fiscaliza as espiadas, avisa aos 20 e aos 25 minutos | `git pull`, `.piloto.cmd`, executa o que o copiloto pede, entrega com `git push` | Abre o manual, explica item por item, pesquisa quando travar, dita a entrega | Abre o painel do piloto, conta o que apareceu, lê e pesquisa os erros, confere no telão se a entrega entrou |
| **Avaliação** (5 min) | Abre cada barraca e marca no painel os itens cumpridos | Descansa | Confere no manual o que deveria ter saído | Acompanha no telão os pontos da equipe |
| **Votação** (5 min) | Chama todos para visitar as barracas | Visita e dá 2 fichas | Visita e dá 2 fichas | Visita e dá 2 fichas |

---

## Abertura (10 min)

- Telão na etapa **Abertura**. Mostre a feira com as três barracas "em montagem".
- Monte as equipes no painel (ou **Sortear equipes**). A ordem define o rodízio.
- Peça para todos entrarem na feira com o e-mail. Cada um vê o próprio papel do ciclo 1 na página da feira.
- Diga as regras e mostre a arrumação: o piloto de frente para o notebook, o copiloto de costas com o manual, o repórter com o painel. Peça para **todos** rodarem `git switch equipe-N` (o número da própria equipe; a página da feira mostra o comando certo). Mostre o piloto rodando `.piloto.cmd` e o repórter abrindo o endereço que termina em `/painel`.
- Abra a **barraca modelo** e faça um pedido nela: "no fim do dia a barraca de vocês faz coisas assim".

## Como dar a aula de 5 minutos

O telão marca os 5 minutos. Toda aula tem o mesmo formato:

| Tempo | O quê |
|---|---|
| 0:00 | **A comparação** com a feira: uma imagem que todo mundo entende |
| 1:00 | **O desenho** no quadro: no máximo três caixas e duas setas |
| 3:00 | **A mágica** no telão: a barraca modelo funcionando de verdade |
| 4:00 | **A pergunta valendo aplauso** e a ponte com o SSM |

Regras que deixam a aula curta:

- Explique só o que aparece nos itens **médios**. Os fáceis eles fazem lendo o manual, e o desafio é para quem quiser ir além.
- Deixe o desenho pronto no quadro **antes** de a aula começar (na votação do ciclo anterior ou no intervalo). Na aula você só aponta e conta.
- Termine sempre com: "Fáceis primeiro, entreguem cedo e entreguem de novo a cada item".

As mágicas usam a barraca modelo no navegador do telão: `http://localhost:8080/#/barraca/modelo`.

## Ciclo 1 — Levantar a barraca: a vitrine e a cozinha

**A comparação (1 min).** "Toda barraca tem uma vitrine e uma cozinha. A vitrine é o Angular: é o que o cliente vê. A cozinha é o Spring Boot: prepara a comida e manda para a frente. Entre as duas anda um garçom com um papel escrito; esse papel se chama JSON."

**O desenho (2 min).**

```
 VITRINE (Angular)                            COZINHA (Spring Boot)
 equipe-N.html   o que aparece                EquipeNController.java
 equipe-N.ts     as caixinhas                 @GetMapping("/destaque")
                                              devolve um Item
          ◀────────  JSON  {"emoji": "⭐", "nome": "..."}  ────────

 curtidas = signal(0)          uma caixinha com um valor dentro
 {{ curtidas() }}              mostra na tela o que tem na caixinha
 (click)="..."                 faz alguma coisa quando clicam
```

Aponte as três linhas de baixo: "Com essas três coisas vocês fazem o botão de curtir." Depois aponte a cozinha: "e o `@GetMapping` cria um endereço novo na cozinha: o destaque do dia".

**A mágica (1 min).** No telão, abra a barraca modelo e mostre os sabores. Abra uma aba nova em `http://localhost:8080/api/barracas/modelo/itens`: "Isto é o que a cozinha manda. Feio, né? A vitrine pega isso e deixa bonito." Volte para a barraca e aponte os mesmos sabores.

**A pergunta (30 s).** "Quem prepara o destaque do dia: a vitrine ou a cozinha?" (A cozinha, o Spring Boot. A vitrine só mostra.)

**Ponte com o SSM (30 s).** "Toda API do SSM tem controllers assim: `@RestController`, endereço `/api/<modulo>/<recurso>` e métodos com nome em português, como `consultarPorId`. O de vocês vai se chamar `consultarDestaque`."

**Na missão:** nome, slogan, emoji, cor, vitrine e "Quem atende aqui" (fáceis); botão de curtir, visual da vitrine e o endpoint do destaque (médios); o destaque do Java aparecendo na tela (desafio).

## Ciclo 2 — Abastecer a barraca: a bandeja

**A comparação (1 min).** "No ciclo 1 a cozinha mandou um prato só. Agora ela manda uma bandeja cheia: uma lista. E o garçom, que é o `@for`, leva um prato de cada vez até a mesa."

**O desenho (2 min).**

```
 Java:   List.of(prato 0, prato 1, prato 2)
   ↓
 JSON:   [ {...}, {...}, {...} ]                  colchetes = lista
   ↓
 itens = signal<Item[]>([])                       a caixinha agora guarda uma lista
 @for (item of itens(); track item.nome) { <li>…</li> }     um <li> por prato

 /itens/0  →  o primeiro prato da bandeja         @PathVariable pega o número do endereço
```

Aponte o `0`: "Na lista, quem chega primeiro é o zero, não o um".

**A mágica (1 min).** Chame três voluntários para serem os pratos da bandeja. Diga "`@for`, cumprimente cada um" e aperte a mão de um por um. Aponte o primeiro: "este é o `$first`, o mais pedido". Pergunte quantos são: "três, isso é o `itens().length`". Se der tempo, abra de novo `http://localhost:8080/api/barracas/modelo/itens` e mostre os colchetes e as chaves.

**A pergunta (30 s).** "Se a bandeja tem 3 pratos, quantas vezes o `@for` repete o bloco?" (Três: uma vez por prato.)

**Ponte com o SSM (30 s).** Desenhe `Controller → Service`. "No SSM o controller nunca trabalha sozinho: ele recebe o pedido e chama o service, que vem pelo construtor. É o desafio de hoje. E `consultarPorId(@PathVariable Long id)` é um dos endpoints mais comuns de lá; vocês fazem o mesmo com a posição."

**Lembrete:** os papéis giraram. O novo piloto começa com `git pull` e `.\piloto.cmd`.

**Na missão:** os três itens no Java, a resposta pura e o contador (fáceis); a caixinha da lista, a lista na tela, um item pelo endereço e o selo de "mais pedido" (médios); a camada de service, como no SSM (desafio).

## Intervalo (10 min)

Bom momento para destravar no particular quem ficou para trás. E para desenhar no quadro a aula do ciclo 3.

## Ciclo 3 — Atender o visitante: o correio

**A comparação (1 min).** "O formulário é o correio da barraca. O visitante escreve a carta, o botão leva até a cozinha, a cozinha guarda no arquivo, que é o banco, e o mural mostra todas as cartas."

**O desenho (2 min).**

```
 1. a pessoa digita        →  o texto vai para a caixinha    [(ngModel)]="recado"
 2. a pessoa clica         →  roda cadastrarRecado()          (click)
 3. o front manda um POST  →  o Spring Boot grava no banco
 4. o front busca de novo  →  o mural mostra a carta nova

 [disabled]="!recado()"    o botão fica apagado enquanto o campo está vazio
```

Aponte o `[(ngModel)]`: "colchete e parêntese juntos é um fio de duas mãos: o que a pessoa digita vai para a caixinha, e o que está na caixinha aparece no campo".

**A mágica (1 min).** No telão, na barraca modelo, escolha um sabor e clique em **Pedir**. Aperte F5: o pedido continua na fila. "Está no banco, não na tela." Depois clique três vezes em **🎲 Sabor surpresa**: "o Java sorteia um sabor a cada clique. A pescaria de vocês faz a mesma coisa, com o `Random`."

**A pergunta (30 s).** "Por que a gente busca a lista de novo depois de enviar?" (Para a carta nova aparecer no mural.)

**Ponte com o SSM (30 s).** "No SSM quem cria um registro se chama `cadastrar`, é sempre um POST e termina com uma mensagem como 'Marca cadastrada com sucesso!'. Hoje vocês fazem o `cadastrarRecado` e a mensagem 'Recado cadastrado com sucesso!'."

**Na missão:** o convite, a lista de recados e a mensagem de sucesso (fáceis); as caixinhas, o `cadastrarRecado`, o formulário e a pescaria no Java (médios); o botão de pescar na tela (desafio).

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
