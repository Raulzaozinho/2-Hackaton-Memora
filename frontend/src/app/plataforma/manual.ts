/**
 * O MANUAL DO COPILOTO — as missões dos 3 ciclos.
 *
 * Só o copiloto lê o manual. Cada item vale pontos; no fim da missão a organização confere na feira
 * (o que entrou no telão) quais itens a equipe cumpriu. Nos textos, "N" vira o número da equipe.
 *
 * Todo ciclo tem o mesmo desenho: tarefas fáceis para aquecer, tarefas médias de Angular e de
 * Spring Boot, e um desafio que liga os dois. Cada ciclo vale 100 pontos.
 */

export type Nivel = 'facil' | 'medio' | 'desafio';
export type Tecnologia = 'Angular' | 'Spring Boot' | 'Angular + Spring Boot' | 'HTML e CSS' | 'Repórter';

export interface ItemDoManual {
  id: string;
  titulo: string;
  pontos: number;
  nivel: Nivel;
  tecnologia: Tecnologia;
  /** Onde o piloto mexe. */
  arquivo: string;
  /** O que o copiloto explica ao piloto, passo a passo. */
  passos: string[];
  /** O código que o piloto precisa digitar. */
  codigo?: string;
  /** O que o repórter deve ver quando estiver certo. A organização confere a mesma coisa. */
  confere: string;
  /** O que o copiloto ou o repórter podem pesquisar se a equipe travar. O piloto nunca pesquisa. */
  pesquisa?: string;
  /** Onde essa mesma ideia aparece no SSM, o sistema que eles vão usar no dia a dia. */
  noSsm?: string;
}

export interface CicloDoManual {
  numero: number;
  titulo: string;
  missao: string;
  itens: ItemDoManual[];
}

export const NIVEIS: Record<Nivel, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  desafio: 'Desafio',
};

const FRONT = 'frontend/src/app/barracas/equipe-N/';
const JAVA = 'backend/src/main/java/br/com/memora/feira/barracas/equipeN/EquipeNController.java';

export const MANUAL: CicloDoManual[] = [
  {
    numero: 1,
    titulo: 'Levantar a barraca',
    missao: 'Dar cara à barraca, criar o primeiro botão em Angular e o primeiro endpoint em Spring Boot.',
    itens: [
      {
        id: 'c1-nome',
        titulo: 'Nome e slogan',
        pontos: 10,
        nivel: 'facil',
        tecnologia: 'Angular',
        arquivo: `${FRONT}barraca.config.ts`,
        passos: [
          'Abra o arquivo barraca.config.ts.',
          'Na linha do nome, troque o texto que está entre as aspas simples pelo nome que a equipe escolheu.',
          'Na linha do slogan, escreva uma frase curta da barraca, também entre aspas simples.',
        ],
        codigo: `nome: 'Barraca do Churros',\nslogan: 'Recheio até a ponta',`,
        confere: 'O cartão da barraca, no mapa da feira, mostra o nome e o slogan novos.',
      },
      {
        id: 'c1-emoji-cor',
        titulo: 'Emoji e cor',
        pontos: 10,
        nivel: 'facil',
        tecnologia: 'Angular',
        arquivo: `${FRONT}barraca.config.ts`,
        passos: [
          'No mesmo arquivo, troque o emoji. No Windows, a tecla do Windows + ponto final abre os emojis.',
          'Troque a cor: um código com # e seis letras ou números.',
          'Opções: #8e44ad (roxo), #16a085 (verde-água), #d35400 (laranja), #2c3e50 (azul-escuro), #c0392b (vermelho).',
        ],
        codigo: `emoji: '🥖',\ncor: '#8e44ad',`,
        confere: 'A barraca tem emoji novo e mudou de cor no mapa e no topo da página.',
      },
      {
        id: 'c1-vitrine',
        titulo: 'Os textos da vitrine',
        pontos: 10,
        nivel: 'facil',
        tecnologia: 'HTML e CSS',
        arquivo: `${FRONT}equipe-N.html`,
        passos: [
          'Abra o arquivo equipe-N.html.',
          'Dentro da section com class="vitrine", troque o texto entre <h2> e </h2>.',
          'Logo abaixo, troque o texto entre <p> e </p>.',
        ],
        codigo: `<h2>O melhor churros da feira</h2>\n<p>Escolha o recheio e a gente faz na hora.</p>`,
        confere: 'Dentro da barraca, o título e o texto da caixa tracejada mudaram.',
      },
      {
        id: 'c1-equipe',
        titulo: 'Quem atende aqui',
        pontos: 10,
        nivel: 'facil',
        tecnologia: 'HTML e CSS',
        arquivo: `${FRONT}equipe-N.html`,
        passos: [
          'Logo depois do </section> da vitrine, acrescente uma section nova.',
          'Coloque o nome das três pessoas da equipe.',
        ],
        codigo: `<section>\n  <h3>Quem atende aqui</h3>\n  <p>Ana, Bruno e Carla</p>\n</section>`,
        confere: 'Abaixo da vitrine aparece "Quem atende aqui" com os três nomes.',
      },
      {
        id: 'c1-curtir',
        titulo: 'O botão de curtir',
        pontos: 15,
        nivel: 'medio',
        tecnologia: 'Angular',
        arquivo: `${FRONT}equipe-N.ts e equipe-N.html`,
        passos: [
          'No equipe-N.ts, abaixo do comentário // CICLO 1, crie uma caixinha que começa com zero (primeira linha abaixo).',
          'No equipe-N.html, abaixo do comentário <!-- CICLO 1 — o botão de curtir... -->, digite a section.',
          '(click) diz o que acontece no clique: a caixinha recebe o valor dela mais um. As chaves duplas mostram o valor.',
        ],
        codigo: `// equipe-N.ts\ncurtidas = signal(0);\n\n<!-- equipe-N.html -->\n<section>\n  <button class="botao" (click)="curtidas.set(curtidas() + 1)">❤️ Curtir</button>\n  <p>{{ curtidas() }} curtidas</p>\n</section>`,
        confere: 'Um botão "❤️ Curtir"; a cada clique, o número de curtidas sobe um.',
        pesquisa: 'angular signal set click',
        noSsm: 'As telas do SSM também reagem a cliques com (click) e mostram valores com chaves duplas.',
      },
      {
        id: 'c1-estilo',
        titulo: 'O visual da vitrine',
        pontos: 10,
        nivel: 'medio',
        tecnologia: 'HTML e CSS',
        arquivo: `${FRONT}equipe-N.css`,
        passos: [
          'Abra o equipe-N.css e encontre o bloco .vitrine { ... }.',
          'Troque a linha background por uma cor de fundo clara.',
          'Antes da chave que fecha o bloco, acrescente uma linha para aumentar a letra.',
        ],
        codigo: `.vitrine {\n  text-align: center;\n  padding: 20px;\n  border-radius: 16px;\n  border: 3px dashed var(--cor-da-barraca);\n  background: #fdf2ff;\n  font-size: 1.2rem;\n}`,
        confere: 'A caixa da vitrine tem fundo colorido e letra maior.',
        pesquisa: 'css background font-size',
      },
      {
        id: 'c1-destaque-java',
        titulo: 'O destaque do dia no back-end',
        pontos: 15,
        nivel: 'medio',
        tecnologia: 'Spring Boot',
        arquivo: JAVA,
        passos: [
          'Abra o EquipeNController.java.',
          'Abaixo do comentário // CICLO 1, digite o método consultarDestaque.',
          'Os nomes dos métodos ficam em português, como no SSM: listarTodos, consultarPorId, cadastrar.',
          '@GetMapping("/destaque") é o endereço; o método devolve um Item, que vira JSON sozinho.',
          'Ao salvar, o back-end reinicia sozinho. O repórter vê "compilando…" e depois "rodando".',
        ],
        codigo: `@GetMapping("/destaque")\npublic Item consultarDestaque() {\n    return new Item("⭐", "Churros de doce de leite", "O destaque do dia");\n}`,
        confere: 'Numa aba nova, o endereço do painel trocando /painel por /api/barracas/equipe-N/destaque mostra o item em JSON.',
        pesquisa: 'spring boot GetMapping RestController',
        noSsm: 'Toda API do SSM tem controllers assim: @RestController, @RequestMapping("/api/<modulo>/<recurso>") e um @GetMapping por consulta.',
      },
      {
        id: 'c1-destaque-tela',
        titulo: 'O destaque do dia na tela',
        pontos: 20,
        nivel: 'desafio',
        tecnologia: 'Angular + Spring Boot',
        arquivo: `${FRONT}equipe-N.ts e equipe-N.html`,
        passos: [
          'No equipe-N.ts, abaixo de curtidas, crie a caixinha do destaque (primeira linha abaixo).',
          'Dentro do constructor() { }, acrescente a linha que busca o destaque no back-end.',
          'No equipe-N.html, dentro da section do curtir, acrescente o parágrafo do destaque.',
          'O ?. quer dizer "se já tiver chegado": antes da resposta, não mostra nada.',
        ],
        codigo: `// equipe-N.ts\ndestaque = signal<Item | null>(null);\n\n// dentro do constructor() { }\nthis.api.buscar<Item>('equipe-N', 'destaque').subscribe((item) => this.destaque.set(item));\n\n<!-- equipe-N.html -->\n<p>{{ destaque()?.emoji }} Destaque do dia: <strong>{{ destaque()?.nome }}</strong></p>`,
        confere: 'A barraca mostra "⭐ Destaque do dia:" com o nome que veio do Java.',
        pesquisa: 'angular httpclient subscribe signal',
        noSsm: 'No SSM, a tela chama um service e usa .subscribe(...) para tratar a resposta, do mesmo jeito.',
      },
    ],
  },
  {
    numero: 2,
    titulo: 'Abastecer a barraca',
    missao: 'Fazer o Java mandar uma lista e o Angular desenhar cada item.',
    itens: [
      {
        id: 'c2-itens',
        titulo: 'Os itens no back-end',
        pontos: 10,
        nivel: 'facil',
        tecnologia: 'Spring Boot',
        arquivo: JAVA,
        passos: [
          'No EquipeNController.java, no método itens(), troque o item de exemplo por três itens da barraca.',
          'Cada item tem três textos entre aspas duplas: emoji, nome e descrição.',
          'Os itens são separados por vírgula. Depois do último vem parêntese e ponto e vírgula.',
        ],
        codigo: `return List.of(\n        new Item("🍫", "Doce de leite", "O mais pedido"),\n        new Item("🍓", "Morango", "Com pedaços de fruta"),\n        new Item("🥜", "Paçoca", "Só para os fortes"));`,
        confere: 'No painel, o back-end volta a ficar "rodando", sem erro.',
      },
      {
        id: 'c2-json',
        titulo: 'A resposta pura',
        pontos: 10,
        nivel: 'facil',
        tecnologia: 'Repórter',
        arquivo: 'Nenhum: quem faz é o repórter',
        passos: [
          'Peça ao repórter para abrir uma aba nova com o endereço do painel, trocando /painel por /api/barracas/equipe-N/itens.',
          'Ele lê em voz alta o que aparece: os três itens entre colchetes. Isso se chama JSON.',
        ],
        confere: 'O endereço /api/barracas/equipe-N/itens mostra os três itens da equipe.',
      },
      {
        id: 'c2-caixinha',
        titulo: 'A caixinha da lista',
        pontos: 15,
        nivel: 'medio',
        tecnologia: 'Angular',
        arquivo: `${FRONT}equipe-N.ts`,
        passos: [
          'No equipe-N.ts, abaixo do comentário // CICLO 2, crie a caixinha da lista (primeira linha abaixo).',
          'Dentro do constructor() { }, acrescente a linha que pede os itens.',
          'Em português: "peça os itens da equipe-N e, quando a resposta chegar, guarde na caixinha itens".',
        ],
        codigo: `itens = signal<Item[]>([]);\n\n// dentro do constructor() { }\nthis.api.itens('equipe-N').subscribe((lista) => this.itens.set(lista));`,
        confere: 'O painel do front-end continua "rodando", sem erro.',
        pesquisa: 'angular signal array subscribe',
        noSsm: 'No SSM, quem conversa com o back-end é um service por recurso (um arquivo .service.ts em services/). Aqui esse papel é do BarracaApi.',
      },
      {
        id: 'c2-lista',
        titulo: 'A lista na tela',
        pontos: 15,
        nivel: 'medio',
        tecnologia: 'Angular',
        arquivo: `${FRONT}equipe-N.html`,
        passos: [
          'No equipe-N.html, abaixo do comentário <!-- CICLO 2 ... -->, digite a section abaixo.',
          'O @for repete o <li> uma vez para cada item da caixinha.',
        ],
        codigo: `<section>\n  <h3>O que temos hoje</h3>\n  <ul>\n    @for (item of itens(); track item.nome) {\n      <li>{{ item.emoji }} <strong>{{ item.nome }}</strong> — {{ item.descricao }}</li>\n    }\n  </ul>\n</section>`,
        confere: 'A barraca mostra "O que temos hoje" com os três itens do Java.',
        pesquisa: 'angular @for track',
        noSsm: 'As listas do SSM usam a tabela p-table do PrimeNG; por baixo, é a mesma ideia: repetir uma linha por item.',
      },
      {
        id: 'c2-contador',
        titulo: 'Quantas opções',
        pontos: 10,
        nivel: 'facil',
        tecnologia: 'Angular',
        arquivo: `${FRONT}equipe-N.html`,
        passos: ['Logo depois do <h3>O que temos hoje</h3>, acrescente a linha abaixo. length é o tamanho da lista.'],
        codigo: `<p>{{ itens().length }} opções</p>`,
        confere: 'Aparece "3 opções" logo abaixo do título da lista.',
      },
      {
        id: 'c2-item-java',
        titulo: 'Um item só, pelo endereço',
        pontos: 15,
        nivel: 'medio',
        tecnologia: 'Spring Boot',
        arquivo: JAVA,
        passos: [
          'No topo do EquipeNController.java, junto dos outros import, acrescente a primeira linha abaixo.',
          'Abaixo do comentário // CICLO 2 — o endpoint de um item só entra aqui. (o que começa com duas barras), digite o método consultarPorPosicao.',
          '{posicao} é um pedaço do endereço que muda; @PathVariable entrega esse pedaço ao método.',
          'As posições começam em zero: /itens/0 é o primeiro.',
        ],
        codigo: `import org.springframework.web.bind.annotation.PathVariable;\n\n@GetMapping("/itens/{posicao}")\npublic Item consultarPorPosicao(@PathVariable int posicao) {\n    return itens().get(posicao);\n}`,
        confere: 'O endereço /api/barracas/equipe-N/itens/0 mostra só o primeiro item, e /itens/2 só o terceiro.',
        pesquisa: 'spring boot PathVariable',
        noSsm: 'consultarPorId(@PathVariable Long id) é um dos endpoints mais comuns das APIs do SSM.',
      },
      {
        id: 'c2-mais-pedido',
        titulo: 'O selo de mais pedido',
        pontos: 10,
        nivel: 'medio',
        tecnologia: 'Angular',
        arquivo: `${FRONT}equipe-N.html`,
        passos: [
          'Dentro do <li> do @for, depois da descrição, acrescente o @if abaixo.',
          '$first é verdadeiro só na primeira volta do @for. O @if só mostra o selo quando é verdadeiro.',
        ],
        codigo: `@if ($first) {\n  <span> · ⭐ mais pedido</span>\n}`,
        confere: 'Só o primeiro item da lista tem "⭐ mais pedido" do lado.',
        pesquisa: 'angular @for $first @if',
      },
      {
        id: 'c2-service',
        titulo: 'A camada de service, como no SSM',
        pontos: 15,
        nivel: 'desafio',
        tecnologia: 'Spring Boot',
        arquivo: 'backend/src/main/java/br/com/memora/feira/barracas/equipeN/ (arquivo novo: EquipeNService.java)',
        passos: [
          'Na pasta do EquipeNController.java, crie um arquivo novo chamado EquipeNService.java com o primeiro bloco abaixo.',
          'Coloque no listarTodos() os três itens que a equipe fez no controller.',
          'No controller, logo abaixo da linha "public class EquipeNController {", digite o campo e o construtor. Depois APAGUE o método itens() inteiro (do @GetMapping("/itens") até a chave } que fecha) e digite no lugar o método do fim do bloco.',
          'O controller recebe o pedido; o service faz o trabalho. É assim em todas as APIs do SSM.',
        ],
        codigo: `// EquipeNService.java (arquivo novo)\npackage br.com.memora.feira.barracas.equipeN;\n\nimport br.com.memora.feira.barracas.Item;\nimport java.util.List;\nimport org.springframework.stereotype.Service;\n\n@Service\npublic class EquipeNService {\n\n    public List<Item> listarTodos() {\n        return List.of(\n                new Item("🍫", "Doce de leite", "O mais pedido"),\n                new Item("🍓", "Morango", "Com pedaços de fruta"),\n                new Item("🥜", "Paçoca", "Só para os fortes"));\n    }\n}\n\n// EquipeNController.java, logo abaixo da linha "public class EquipeNController {"\nprivate final EquipeNService equipeNService;\n\npublic EquipeNController(EquipeNService equipeNService) {\n    this.equipeNService = equipeNService;\n}\n\n// apague o itens() antigo inteiro e digite no lugar:\n@GetMapping("/itens")\npublic List<Item> itens() {\n    return equipeNService.listarTodos();\n}`,
        confere: 'A lista continua igual na barraca e em /api/barracas/equipe-N/itens. A organização confere no código entregue que o EquipeNService existe.',
        pesquisa: 'spring boot service injeção pelo construtor',
        noSsm: 'No SSM é sempre XxxController → XxxService → XxxRepository, com o service recebido pelo construtor (private final).',
      },
    ],
  },
  {
    numero: 3,
    titulo: 'Atender o visitante',
    missao: 'Um formulário que grava no banco e um sorteio feito pelo Java.',
    itens: [
      {
        id: 'c3-convite',
        titulo: 'O convite',
        pontos: 10,
        nivel: 'facil',
        tecnologia: 'HTML e CSS',
        arquivo: `${FRONT}equipe-N.html`,
        passos: ['No equipe-N.html, abaixo do comentário <!-- CICLO 3 ... -->, crie a section do recado.'],
        codigo: `<section>\n  <h3>Deixe seu recado</h3>\n  <p>Conte o que achou da barraca!</p>\n</section>`,
        confere: 'Aparece "Deixe seu recado" com o convite logo abaixo.',
      },
      {
        id: 'c3-caixinhas',
        titulo: 'As caixinhas do recado',
        pontos: 15,
        nivel: 'medio',
        tecnologia: 'Angular',
        arquivo: `${FRONT}equipe-N.ts`,
        passos: [
          'No equipe-N.ts, abaixo do comentário // CICLO 3, digite as caixinhas e a ação carregarRecados.',
          'Dentro do constructor() { }, acrescente this.carregarRecados(); para a lista já vir carregada.',
        ],
        codigo: `recado = signal('');\nrecados = signal<Registro[]>([]);\n\ncarregarRecados() {\n  this.api.registros('equipe-N').subscribe((lista) => this.recados.set(lista));\n}\n\n// dentro do constructor() { }\nthis.carregarRecados();`,
        confere: 'O painel do front-end continua "rodando", sem erro.',
        pesquisa: 'angular signal string',
      },
      {
        id: 'c3-enviar',
        titulo: 'A ação de cadastrar',
        pontos: 15,
        nivel: 'medio',
        tecnologia: 'Angular + Spring Boot',
        arquivo: `${FRONT}equipe-N.ts`,
        passos: [
          'Depois da chave } que fecha o carregarRecados (fora dele), digite a ação cadastrarRecado. No SSM, quem cria se chama cadastrar.',
          'Ela manda o recado ao back-end (um POST, que grava no banco) e depois busca a lista de novo.',
        ],
        codigo: `cadastrarRecado() {\n  const novo = { autor: this.feira.meuNome(), texto: this.recado() };\n  this.api.salvar('equipe-N', novo).subscribe(() => {\n    this.recado.set('');\n    this.carregarRecados();\n  });\n}`,
        confere: 'O painel do front-end continua "rodando", sem erro.',
        pesquisa: 'angular httpclient post',
        noSsm: 'No SSM, cadastrar é sempre um POST que o service da tela manda para a API, como no cadastro de marcas.',
      },
      {
        id: 'c3-formulario',
        titulo: 'O formulário',
        pontos: 15,
        nivel: 'medio',
        tecnologia: 'Angular',
        arquivo: `${FRONT}equipe-N.html`,
        passos: [
          'Dentro da section do recado, depois do convite, acrescente o campo e o botão.',
          '[(ngModel)] liga o campo à caixinha recado; [disabled] apaga o botão enquanto o campo está vazio.',
        ],
        codigo: `<input class="campo" [(ngModel)]="recado" placeholder="Escreva aqui" />\n<button class="botao" (click)="cadastrarRecado()" [disabled]="!recado()">Enviar</button>`,
        confere: 'Aparece um campo e um botão Enviar, que só acende quando há texto.',
        pesquisa: 'angular ngModel disabled',
        noSsm: 'Os formulários do SSM usam formGroup com Validators.required. Aqui o [disabled] faz esse papel de um jeito mais simples.',
      },
      {
        id: 'c3-lista',
        titulo: 'Os recados na tela',
        pontos: 10,
        nivel: 'facil',
        tecnologia: 'Angular',
        arquivo: `${FRONT}equipe-N.html`,
        passos: ['Depois do botão, acrescente a lista dos recados. É o mesmo @for do ciclo 2.'],
        codigo: `<ul>\n  @for (item of recados(); track item.id) {\n    <li><strong>{{ item.autor }}</strong>: {{ item.texto }}</li>\n  }\n</ul>`,
        confere: 'O repórter escreve um recado, clica em Enviar e ele aparece na lista com o nome dele.',
      },
      {
        id: 'c3-aviso',
        titulo: 'A mensagem de sucesso',
        pontos: 10,
        nivel: 'facil',
        tecnologia: 'Angular',
        arquivo: `${FRONT}equipe-N.ts e equipe-N.html`,
        passos: [
          'No equipe-N.ts, abaixo de recados, crie a caixinha aviso (primeira linha abaixo).',
          'Dentro do subscribe do cadastrarRecado, acrescente a linha que preenche o aviso.',
          'No equipe-N.html, depois do botão Enviar, mostre o aviso quando ele existir.',
        ],
        codigo: `// equipe-N.ts\naviso = signal('');\n\n// dentro do subscribe do cadastrarRecado\nthis.aviso.set('Recado cadastrado com sucesso!');\n\n<!-- equipe-N.html -->\n@if (aviso()) {\n  <p class="aviso">{{ aviso() }}</p>\n}`,
        confere: 'Depois de enviar, aparece "Recado cadastrado com sucesso!" numa caixinha.',
        noSsm: 'No SSM, toda ação mostra uma mensagem assim (o toastr): "Marca cadastrada com sucesso!".',
      },
      {
        id: 'c3-pescar-java',
        titulo: 'A pescaria no back-end',
        pontos: 10,
        nivel: 'medio',
        tecnologia: 'Spring Boot',
        arquivo: JAVA,
        passos: [
          'No topo do EquipeNController.java, junto dos outros import, acrescente import java.util.Random;',
          'Abaixo do comentário // CICLO 3, digite o sorteador e o método pescar.',
          'nextInt sorteia um número de zero até o tamanho da lista.',
        ],
        codigo: `import java.util.Random;\n\nprivate final Random sorte = new Random();\n\n@GetMapping("/pescar")\npublic Item pescar() {\n    List<Item> premios = itens();\n    return premios.get(sorte.nextInt(premios.size()));\n}`,
        confere: 'O endereço /api/barracas/equipe-N/pescar mostra um item diferente a cada vez que recarrega.',
        pesquisa: 'java Random nextInt',
      },
      {
        id: 'c3-pescar-tela',
        titulo: 'O botão de pescar',
        pontos: 15,
        nivel: 'desafio',
        tecnologia: 'Angular + Spring Boot',
        arquivo: `${FRONT}equipe-N.ts e equipe-N.html`,
        passos: [
          'No equipe-N.ts, depois da chave } que fecha o cadastrarRecado (fora dele), crie a caixinha do prêmio e a ação pescar.',
          'No equipe-N.html, logo antes do </section> que fecha a section do recado (o último do arquivo), acrescente o botão e o resultado.',
          '@if só mostra o prêmio depois que ele chegar.',
        ],
        codigo: `// equipe-N.ts\npremio = signal<Item | null>(null);\n\npescar() {\n  this.api.buscar<Item>('equipe-N', 'pescar').subscribe((item) => this.premio.set(item));\n}\n\n<!-- equipe-N.html -->\n<button class="botao" (click)="pescar()">🎣 Pescar</button>\n@if (premio(); as item) {\n  <p>{{ item.emoji }} Você pescou: <strong>{{ item.nome }}</strong>!</p>\n}`,
        confere: 'Um botão Pescar sorteia um dos itens da lista e mostra "Você pescou: ...".',
        pesquisa: 'angular @if as',
      },
    ],
  },
];

/** Troca o "N" dos textos do manual pelo número da equipe. */
export function paraEquipe(texto: string, equipe: string): string {
  const n = equipe.replace('equipe-', '');
  return texto
    .replaceAll('equipe-N', `equipe-${n}`)
    .replaceAll('EquipeN', `Equipe${n}`)
    .replaceAll('equipeN', `equipe${n}`);
}

export function cicloDoManual(numero: number): CicloDoManual | undefined {
  return MANUAL.find((ciclo) => ciclo.numero === numero);
}

export function pontosPossiveis(ciclo: CicloDoManual): number {
  return ciclo.itens.reduce((soma, item) => soma + item.pontos, 0);
}
