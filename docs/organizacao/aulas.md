# As 3 aulas, em detalhe — para a organização

O [roteiro do dia](roteiro-do-dia.md) traz a versão curta. Aqui está tudo o que você pode precisar para explicar com segurança: o que falar, como explicar cada conceito, o que vão perguntar e os erros que vão aparecer na missão.

Toda aula tem 5 minutos no relógio do telão. Você **não** precisa falar tudo o que está aqui: a parte "Para explicar" é o seu estoque. Use o que couber e guarde o resto para quando alguém levantar o copo vermelho.

**Uma imagem só para o dia inteiro:** a barraca tem uma **vitrine** (o Angular, o que o visitante vê), uma **cozinha** (o Spring Boot, que prepara) e um **garçom** que leva e traz pedidos entre as duas (a requisição HTTP). O papel que o garçom carrega é o **JSON**.

---

## Aula 1 — A vitrine e a cozinha

**O que eles precisam sair sabendo:** onde fica cada coisa (HTML, TS, CSS, Java), o que é uma caixinha (`signal`), como mostrar o valor dela (`{{ }}`), como reagir a um clique (`(click)`) e como criar um endereço na cozinha (`@GetMapping`).

### Antes da aula

- Desenhe no quadro (antes de todos chegarem):

```
 VITRINE (Angular)                         COZINHA (Spring Boot)
 equipe-N.html   o que aparece             EquipeNController.java
 equipe-N.ts     as caixinhas              @GetMapping("/destaque")
 equipe-N.css    a roupa: cor, letra       devolve um Item
         ◀──── garçom com o JSON {"emoji":"⭐","nome":"..."} ────

 curtidas = signal(0)    uma caixinha com um valor dentro
 {{ curtidas() }}        mostra na tela o que tem na caixinha
 (click)="..."           faz alguma coisa quando clicam
```

- No navegador do telão, deixe duas abas abertas: a barraca modelo (`http://localhost:8080/#/barraca/modelo`) e `http://localhost:8080/api/barracas/modelo/itens`.

### Minuto a minuto

| Tempo | O que fazer | O que falar |
|---|---|---|
| 0:00 | Aponte o quadro inteiro | "Toda barraca tem uma vitrine e uma cozinha. A vitrine é o Angular: é o que o cliente vê. A cozinha é o Spring Boot: prepara e manda para a frente. Entre as duas anda um garçom com um papel escrito, o JSON." |
| 1:00 | Aponte os 3 arquivos da vitrine | "O HTML é o que aparece. O TS guarda as caixinhas. O CSS é a roupa: cor, borda, tamanho da letra." |
| 1:40 | Aponte as 3 linhas de baixo | "Com essas três coisas vocês fazem o botão de curtir. A caixinha guarda um número; as chaves duplas mostram; o clique troca. Para ler a caixinha, sempre com parênteses: `curtidas()`." |
| 2:30 | Aponte a cozinha | "O `@GetMapping` é uma etiqueta que diz: este método atende neste endereço. A equipe 1 vai criar `/api/barracas/equipe-1/destaque`." |
| 3:00 | Mágica: aba da barraca modelo | "Esta é a vitrine." |
| 3:20 | Troque para a aba do `/itens` | "Isto é o que a cozinha manda: só texto, sem cor, sem botão. A vitrine pega isso e deixa bonito." Volte e aponte os mesmos sabores. |
| 4:00 | Pergunta valendo aplauso | "Quem prepara o destaque do dia?" (A cozinha. A vitrine só mostra.) |
| 4:30 | Ponte com o SSM | "Toda API do SSM tem controllers assim: `@RestController`, endereço `/api/módulo/recurso` e nomes em português, como `consultarPorId`. O de vocês vai se chamar `consultarDestaque`." |
| 4:50 | Fechamento | "Fáceis primeiro. Item pronto, commit e push: um commit para cada item." |

### Para explicar (estoque)

- **Por que três arquivos na vitrine?** Cada um tem um trabalho: o HTML diz *o que* aparece, o CSS diz *como* aparece e o TS diz *o que a tela sabe e faz* (as caixinhas e as ações).
- **`signal` é uma caixinha com etiqueta.** `curtidas = signal(0)` cria uma caixinha chamada `curtidas` com o número 0 dentro. Para **ler**: `curtidas()`. Para **trocar**: `curtidas.set(5)`. Quando o valor muda, a tela se atualiza sozinha.
- **As chaves duplas `{{ }}` são uma janela** na tela para dentro da caixinha: `{{ curtidas() }}` mostra o número que está lá agora.
- **Os parênteses `(click)` são um ouvido**: "quando clicarem aqui, faça isto". `(click)="curtidas.set(curtidas() + 1)"` lê o valor, soma um e guarda de novo.
- **Colchetes e parênteses no Angular:** `( )` é algo que vem da tela para o código (um evento, como o clique); `{{ }}` é algo que vai do código para a tela. No ciclo 3 aparece o `[( )]`, que vai e volta.
- **`@GetMapping("/destaque")` é uma etiqueta no método.** O Spring lê a etiqueta e passa a atender esse endereço. O endereço completo junta o do controller (`/api/barracas/equipe-N`) com o do método (`/destaque`).
- **`new Item("⭐", "Churros de doce de leite", "O destaque do dia")`** cria um item com três informações, nesta ordem: emoji, nome e descrição. O Spring transforma isso em JSON sozinho: `{"emoji":"⭐","nome":"...","descricao":"..."}`.
- **O desafio (o destaque na tela)** junta tudo: a vitrine pede o destaque à cozinha (`this.api.buscar<Item>('equipe-N', 'destaque')`), o `.subscribe(...)` quer dizer "quando a resposta chegar, faça isto", e o que chega vai para uma caixinha que começa vazia (`signal<Item | null>(null)`). Na tela, `destaque()?.nome`: o `?.` quer dizer "se já chegou".

### O que vão perguntar

| Pergunta | Resposta curta |
|---|---|
| "Onde eu escrevo?" | Nos marcadores `// CICLO 1 — ...` e `<!-- CICLO 1 — ... -->` dos arquivos da equipe. O manual diz o arquivo de cada item. |
| "Por que `curtidas()` com parênteses?" | Porque é uma caixinha: os parênteses abrem a caixinha para ler o valor. |
| "O botão não faz nada" | Confira o `(click)` (parênteses, não colchetes) e se o `.set` está escrito certo. |
| "Como o repórter vê o JSON?" | No endereço do painel do repórter, troque `/painel` por `/api/barracas/equipe-N/destaque`. |
| "Entreguei e não apareceu" | O repórter olha o telão: se diz "não entrou", o motivo está lá (arquivo e linha). Corrija e entregue de novo. |

### Erros que vão aparecer (e o que dizer)

- **"Unterminated string literal" no `barraca.config.ts`:** faltou fechar uma aspa simples. Cada texto entre `'...'` e uma vírgula no fim da linha.
- **`';' expected` ou `cannot find symbol` no Java:** faltou ponto e vírgula, ou o nome tem letra trocada (Java diferencia maiúscula de minúscula: `Item`, não `item`).
- **O back-end "parou" no painel do repórter depois de salvar um Java:** é normal por uns 20 segundos (ele reinicia sozinho). Se continuar parado, tem erro: o painel mostra o arquivo e a linha.
- **"mexeu fora da pasta da equipe" no telão:** alguém mexeu na barraca modelo ou em outra equipe. `git restore` no arquivo errado e entregar de novo.

### Itens da missão 1 e o conceito de cada um

| Item | Nível | Conceito |
|---|---|---|
| Nome e slogan | fácil | texto entre aspas no `barraca.config.ts` |
| Emoji e cor | fácil | idem; a cor vira `var(--cor-da-barraca)` no CSS |
| Os textos da vitrine | fácil | HTML: `<h2>` e `<p>` |
| Quem atende aqui | fácil | HTML: uma `<section>` nova |
| O botão de curtir | médio | `signal`, `{{ }}`, `(click)` |
| O visual da vitrine | médio | CSS na classe `.vitrine` |
| O destaque do dia no back-end | médio | `@GetMapping`, `new Item(...)` |
| O destaque do dia na tela | desafio | `api.buscar`, `.subscribe`, `?.` |

---

## Aula 2 — A bandeja

**O que eles precisam sair sabendo:** uma lista no Java vira uma lista no JSON; a vitrine guarda a lista numa caixinha; o `@for` desenha um pedaço da tela para cada item; o `@PathVariable` pega um pedaço do endereço; e, no SSM, o controller chama um service.

### Antes da aula

Desenhe durante a votação do ciclo 1:

```
 COZINHA:  List.of(prato 0, prato 1, prato 2)
             ↓
 GARÇOM:   [ {...}, {...}, {...} ]                colchetes = lista
             ↓
 VITRINE:  itens = signal<Item[]>([])             a caixinha agora guarda uma lista
           .subscribe(lista => itens.set(lista))  "quando a bandeja chegar, guarde na caixinha"
           @for (item of itens(); track item.nome) { <li>…</li> }   um <li> por prato
           @if ($first) { ⭐ }                     só na primeira volta do @for

 @GetMapping("/itens/{posicao}")    /itens/0 = o primeiro prato    @PathVariable pega o número

 Controller ──▶ Service
```

### Minuto a minuto

| Tempo | O que fazer | O que falar |
|---|---|---|
| 0:00 | Comparação | "No ciclo 1 o garçom trouxe um prato só. Agora ele traz uma bandeja cheia: uma lista. Na mesa, o `@for` tira um prato de cada vez e põe um `<li>` para cada um." |
| 1:00 | Aponte de cima para baixo | "Na cozinha, `List.of` monta a bandeja. No caminho ela vira colchetes com chaves dentro. Na vitrine, a caixinha agora guarda uma lista, e o `.subscribe` diz: quando a bandeja chegar, guarde na caixinha." |
| 2:00 | Aponte o `@for` e o `$first` | "O `@for` repete o bloco uma vez por item. O `$first` é verdadeiro só na primeira volta: é assim que se põe o selo de mais pedido." |
| 2:30 | Aponte o `/itens/{posicao}` | "O `{posicao}` é um pedaço do endereço que muda. O `@PathVariable` entrega esse pedaço ao método. E atenção: o primeiro é o zero." |
| 3:00 | Mágica | Os três da primeira mesa são a bandeja, sem levantar. "`@for`, cumprimente cada um": acene para um de cada vez. "O primeiro é o `$first`. E quantos são? `itens().length`." No telão, a barraca modelo: "Quatro sabores no Java, quatro linhas na tela, e ninguém escreveu quatro `<li>`." |
| 4:00 | Pergunta valendo aplauso | "Se a bandeja tem 3 pratos, quantas vezes o `@for` repete o bloco?" (Três.) |
| 4:20 | Ponte com o SSM (aponte `Controller ──▶ Service`) | "No SSM o controller nunca trabalha sozinho: recebe o pedido e chama o service, que vem pelo construtor. É o desafio de hoje. E `consultarPorId(@PathVariable Long id)` é um dos endpoints mais comuns de lá." |
| 4:50 | Lembrete | "Os papéis giraram. Novo piloto: `git pull` e `.\piloto.cmd`." |

Não abra `/itens/0` na barraca modelo: ela não tem esse endpoint. Quem faz são as equipes.

### Para explicar (estoque)

- **`List.of(a, b, c)`** cria uma lista fixa. Entre um `new Item(...)` e outro vai **vírgula**; sem ela o Java não compila (é o erro mais comum deste ciclo).
- **`signal<Item[]>([])`**: os colchetes depois de `Item` querem dizer "uma lista de itens", e o `([])` é a lista vazia com que a caixinha começa.
- **Onde chamar a cozinha:** dentro do `constructor() { }`, porque é o que roda assim que a barraca abre.
- **`track item.nome`** diz ao Angular como reconhecer cada item (pelo nome), para ele não redesenhar tudo à toa.
- **`itens().length`** é o tamanho da lista: abre a caixinha e conta.
- **`/itens/{posicao}` e `itens().get(posicao)`:** o método reaproveita a lista e devolve só o item daquela posição. `/itens/0` é o primeiro, `/itens/2` o terceiro.
- **O service (desafio):** um arquivo novo `EquipeNService.java` com `@Service` e o `listarTodos()`. O controller recebe o service no construtor e o `itens()` passa a só chamar `equipeNService.listarTodos()`. O controller atende; o service trabalha.

### O que vão perguntar

| Pergunta | Resposta curta |
|---|---|
| "A lista não aparece" | O repórter abre `/api/barracas/equipe-N/itens`: se o JSON está certo, o problema é na vitrine (a chamada no constructor ou o `@for`). Se não está, é no Java. |
| "Por que começa no zero?" | Porque a posição conta quantos passos andar desde o começo da lista: o primeiro está a zero passos. |
| "/itens/5 deu erro" | A lista só tem 3 itens: 0, 1 e 2. Erro esperado. |
| "method itens() is already defined" | No service, o `itens()` antigo tem que ser **apagado** e o novo escrito no lugar. |

### Itens da missão 2 e o conceito de cada um

| Item | Nível | Conceito |
|---|---|---|
| Os itens no back-end | fácil | `List.of(new Item(...), ...)` |
| A resposta pura | fácil | abrir `/itens` e ver o JSON |
| A caixinha da lista | médio | `signal<Item[]>`, `.subscribe` no constructor |
| A lista na tela | médio | `@for` com `track` |
| Quantas opções | fácil | `itens().length` |
| Um item só, pelo endereço | médio | `@GetMapping("/itens/{posicao}")`, `@PathVariable` |
| O selo de mais pedido | médio | `@if ($first)` |
| A camada de service | desafio | `@Service`, injeção pelo construtor |

---

## Aula 3 — O correio

**O que eles precisam sair sabendo:** o campo do formulário fica ligado a uma caixinha (`[(ngModel)]`); o botão roda uma ação; a ação manda um POST que grava no banco; depois da gravação, a lista é buscada de novo; e o botão pode ficar apagado (`[disabled]`).

### Antes da aula

Desenhe durante o intervalo:

```
 1. a pessoa digita        →  o texto vai para a caixinha    [(ngModel)]="recado"
 2. a pessoa clica         →  roda cadastrarRecado()          (click)
 3. o front manda um POST  →  o Spring Boot grava no banco    (o POST já está pronto: vocês só chamam)
 4. o front busca de novo  →  o mural mostra a carta nova

 [disabled]="!recado()"    o botão fica apagado enquanto o campo está vazio
```

### Minuto a minuto

| Tempo | O que fazer | O que falar |
|---|---|---|
| 0:00 | Comparação | "Até agora o garçom só buscava coisas na cozinha: isso é um GET. Hoje ele leva a carta do visitante para a cozinha guardar no arquivo, que é o banco: isso é um POST. E o mural da barraca mostra todas as cartas." |
| 1:00 | Passos 1 e 2 | "O que a pessoa digita vai direto para a caixinha. O `[(ngModel)]`, colchete com parêntese, é um fio de duas mãos: do campo para a caixinha e da caixinha para o campo. No clique, roda o `cadastrarRecado()`." |
| 1:50 | Passos 3 e 4 | "O `cadastrarRecado` manda o recado num POST. Quando a cozinha responde que gravou, a gente limpa o campo e busca a lista de novo, para a carta nova aparecer no mural." |
| 2:30 | Aponte o `[disabled]` | "Atenção: no `[(ngModel)]` vai a caixinha inteira, sem parênteses: `recado`. Para ler o valor, com parênteses: `!recado()`. O ponto de exclamação é 'não': apagado enquanto não tem texto." |
| 3:00 | Mágica e pergunta | No telão, na barraca modelo: "Olhem o Pedir apagado." Escolha um sabor: "Acendeu. Isso é o `[disabled]`." Clique em **Pedir**. Pergunte, valendo aplauso: "O que acontece com este pedido se eu recarregar a página? Por quê?" Deixe responderem e aperte F5: "Fica: está no banco, não na tela." Clique três vezes em **🎲 Sabor surpresa**: "O Java sorteia um sabor a cada clique. A pescaria de vocês faz a mesma coisa, com o `Random`." |
| 4:30 | Ponte com o SSM | "No SSM quem cria um registro se chama `cadastrar`, é sempre um POST e termina com uma mensagem como 'Marca cadastrada com sucesso!'. Hoje vocês fazem o `cadastrarRecado` e a mensagem 'Recado cadastrado com sucesso!'." |

### Para explicar (estoque)

- **GET busca, POST envia.** O GET pede algo à cozinha; o POST leva algo para ela guardar. Os recados já têm os dois endereços prontos na plataforma (`this.api.registros(...)` e `this.api.salvar(...)`): as equipes só chamam.
- **`carregarRecados()`** é uma ação reaproveitável: busca a lista e guarda na caixinha `recados`. Roda quando a barraca abre (no constructor) e depois de cada envio.
- **`{ autor: this.feira.meuNome(), texto: this.recado() }`** é o recado: quem escreveu (o nome de quem entrou na feira) e o texto que está na caixinha.
- **Dentro do `.subscribe(() => { ... })`** fica o que acontece **depois** que a cozinha gravou: limpar o campo, buscar a lista e mostrar o aviso de sucesso.
- **`@if (aviso()) { ... }`** só mostra a caixinha de aviso quando ela tem texto.
- **A pescaria (Java):** `new Random()` sorteia; `sorte.nextInt(premios.size())` dá um número de 0 até o tamanho da lista menos um, e o `get` pega o item daquela posição. Juntam o ciclo 2 (posição na lista) com o sorteio.

### O que vão perguntar

| Pergunta | Resposta curta |
|---|---|
| "O botão Enviar nunca acende" | O `[(ngModel)]` está ligado a outra caixinha, ou escreveram `recado()` com parênteses dentro do `[(ngModel)]`. |
| "Enviei e não apareceu" | Falta buscar a lista de novo dentro do `.subscribe` do `cadastrarRecado`. |
| "Cannot find name 'premio'" | A caixinha `premio` foi escrita **dentro** do `cadastrarRecado`. Tem que ficar fora, depois da chave `}` que fecha o método. |
| "O pescar sempre traz o mesmo" | Pode ser sorte (são 3 itens). Recarregue algumas vezes o `/api/barracas/equipe-N/pescar`. |

### Itens da missão 3 e o conceito de cada um

| Item | Nível | Conceito |
|---|---|---|
| O convite | fácil | HTML: uma `<section>` |
| As caixinhas | médio | `signal('')`, `signal<Registro[]>`, `carregarRecados` |
| A ação de cadastrar | médio | `cadastrarRecado`, POST com `api.salvar` |
| O formulário | médio | `[(ngModel)]`, `(click)`, `[disabled]` |
| A lista de recados | fácil | `@for` (já visto no ciclo 2) |
| A mensagem de sucesso | fácil | `signal` + `@if` |
| A pescaria no back-end | médio | `Random`, `nextInt`, `get` |
| O botão de pescar | desafio | `api.buscar`, `.subscribe`, `@if (...; as item)` |
