/**
 * O MANUAL DO COPILOTO — as missões dos 3 ciclos.
 *
 * Só o copiloto lê o manual. Cada item vale pontos; no fim da missão a organização confere na feira
 * (o que entrou no telão) quais itens a equipe cumpriu. Nos textos, "N" vira o número da equipe.
 */

export type Nivel = 'essencial' | 'bonus' | 'desafio';

export interface ItemDoManual {
  id: string;
  titulo: string;
  pontos: number;
  nivel: Nivel;
  /** Onde o piloto mexe. */
  arquivo: string;
  /** O que o copiloto explica ao piloto, passo a passo. */
  passos: string[];
  /** O código que o piloto precisa digitar. */
  codigo?: string;
  /** O que o repórter deve ver quando estiver certo. A organização confere a mesma coisa. */
  confere: string;
}

export interface CicloDoManual {
  numero: number;
  titulo: string;
  missao: string;
  itens: ItemDoManual[];
}

export const NIVEIS: Record<Nivel, string> = {
  essencial: 'Essencial',
  bonus: 'Bônus',
  desafio: 'Desafio',
};

const PASTA_FRONT = 'frontend/src/app/barracas/equipe-N/';

export const MANUAL: CicloDoManual[] = [
  {
    numero: 1,
    titulo: 'Levantar a barraca',
    missao: 'Dar nome, cor e vitrine à barraca. Tudo acontece no front-end.',
    itens: [
      {
        id: 'c1-nome',
        titulo: 'O nome da barraca',
        pontos: 10,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}barraca.config.ts`,
        passos: [
          'Abra o arquivo barraca.config.ts.',
          'Na linha que começa com nome, apague o texto que está entre as aspas simples.',
          'Escreva o nome que a equipe escolheu, ainda entre as aspas simples.',
        ],
        codigo: `nome: 'Barraca do Churros',`,
        confere: 'O cartão da barraca, no mapa da feira, mostra o nome novo.',
      },
      {
        id: 'c1-slogan',
        titulo: 'O slogan',
        pontos: 10,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}barraca.config.ts`,
        passos: ['No mesmo arquivo, troque o texto da linha slogan por uma frase curta da barraca.'],
        codigo: `slogan: 'Recheio até a ponta',`,
        confere: 'O slogan aparece embaixo do nome, no mapa e no topo da barraca.',
      },
      {
        id: 'c1-emoji',
        titulo: 'O emoji',
        pontos: 10,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}barraca.config.ts`,
        passos: [
          'Troque o emoji da linha emoji.',
          'No Windows, a tecla do Windows + ponto final abre o painel de emojis.',
        ],
        codigo: `emoji: '🥖',`,
        confere: 'A barraca tem um emoji novo, no lugar da barraca de camping.',
      },
      {
        id: 'c1-cor',
        titulo: 'A cor',
        pontos: 10,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}barraca.config.ts`,
        passos: [
          'Troque o código da linha cor. É um código com # e seis letras ou números.',
          'Algumas opções: #8e44ad (roxo), #16a085 (verde-água), #d35400 (laranja), #2c3e50 (azul-escuro), #c0392b (vermelho).',
        ],
        codigo: `cor: '#8e44ad',`,
        confere: 'O cartão no mapa e o topo da barraca mudaram de cor.',
      },
      {
        id: 'c1-titulo',
        titulo: 'O título da vitrine',
        pontos: 10,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}equipe-N.html`,
        passos: [
          'Abra o arquivo equipe-N.html.',
          'Dentro da section com class="vitrine", troque o texto entre <h2> e </h2>.',
        ],
        codigo: `<h2>O melhor churros da feira</h2>`,
        confere: 'Dentro da barraca, o título da caixa tracejada mudou.',
      },
      {
        id: 'c1-texto',
        titulo: 'O texto da vitrine',
        pontos: 10,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}equipe-N.html`,
        passos: ['Logo abaixo, troque o texto entre <p> e </p>.'],
        codigo: `<p>Escolha o recheio e a gente faz na hora.</p>`,
        confere: 'O texto embaixo do título mudou.',
      },
      {
        id: 'c1-visual',
        titulo: 'O visual da vitrine',
        pontos: 15,
        nivel: 'bonus',
        arquivo: `${PASTA_FRONT}equipe-N.css`,
        passos: [
          'Abra o arquivo equipe-N.css e encontre o bloco .vitrine { ... }.',
          'Troque a linha background por uma cor de fundo clara.',
          'Antes da chave que fecha o bloco, acrescente uma linha para aumentar a letra.',
        ],
        codigo: `.vitrine {\n  text-align: center;\n  padding: 20px;\n  border-radius: 16px;\n  border: 3px dashed var(--cor-da-barraca);\n  background: #fdf2ff;\n  font-size: 1.2rem;\n}`,
        confere: 'A caixa da vitrine tem fundo colorido e letra maior.',
      },
      {
        id: 'c1-equipe',
        titulo: 'Quem atende aqui',
        pontos: 15,
        nivel: 'bonus',
        arquivo: `${PASTA_FRONT}equipe-N.html`,
        passos: [
          'No equipe-N.html, logo depois do </section> da vitrine, acrescente uma section nova.',
          'Coloque o nome das três pessoas da equipe.',
        ],
        codigo: `<section>\n  <h3>Quem atende aqui</h3>\n  <p>Ana, Bruno e Carla</p>\n</section>`,
        confere: 'Abaixo da vitrine aparece "Quem atende aqui" com os três nomes.',
      },
      {
        id: 'c1-motivos',
        titulo: 'Três motivos para visitar',
        pontos: 10,
        nivel: 'desafio',
        arquivo: `${PASTA_FRONT}equipe-N.html`,
        passos: [
          'Dentro da section de "Quem atende aqui", depois do <p>, acrescente uma lista.',
          '<ul> abre a lista, cada <li> é um item e </ul> fecha.',
        ],
        codigo: `<ul>\n  <li>Massa feita na hora</li>\n  <li>Recheio até a ponta</li>\n  <li>Preço de feira</li>\n</ul>`,
        confere: 'Aparece uma lista com três motivos, cada um com uma bolinha.',
      },
    ],
  },
  {
    numero: 2,
    titulo: 'Abastecer a barraca',
    missao: 'Fazer a barraca mostrar uma lista que vem do back-end (Java).',
    itens: [
      {
        id: 'c2-itens',
        titulo: 'Os itens no back-end',
        pontos: 20,
        nivel: 'essencial',
        arquivo: 'backend/src/main/java/br/com/memora/feira/barracas/equipeN/EquipeNController.java',
        passos: [
          'Abra o arquivo EquipeNController.java.',
          'No método itens(), troque o item de exemplo por três itens da barraca.',
          'Cada item tem três textos entre aspas duplas: emoji, nome e descrição.',
          'Os itens são separados por vírgula. Depois do último vem parêntese e ponto e vírgula.',
          'Ao salvar, o back-end reinicia sozinho. O repórter vê "compilando…" e depois "rodando".',
        ],
        codigo: `return List.of(\n        new Item("🍫", "Doce de leite", "O mais pedido"),\n        new Item("🍓", "Morango", "Com pedaços de fruta"),\n        new Item("🥜", "Paçoca", "Só para os fortes"));`,
        confere: 'No painel, o back-end volta a ficar "rodando", sem erro.',
      },
      {
        id: 'c2-json',
        titulo: 'A resposta pura',
        pontos: 10,
        nivel: 'essencial',
        arquivo: 'Nenhum: quem faz é o repórter',
        passos: [
          'Peça ao repórter para abrir uma aba nova com o endereço do painel, trocando /painel por /api/barracas/equipe-N/itens.',
          'Ele deve ler em voz alta o que aparece: os três itens entre colchetes. Isso se chama JSON.',
        ],
        confere: 'O endereço /api/barracas/equipe-N/itens mostra os três itens da equipe.',
      },
      {
        id: 'c2-signal',
        titulo: 'A caixinha da lista',
        pontos: 20,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}equipe-N.ts`,
        passos: [
          'Abra o arquivo equipe-N.ts.',
          'Logo abaixo do comentário que começa com // CICLO 2, digite as linhas abaixo.',
          'Em português: "peça os itens da equipe-N e, quando a resposta chegar, guarde na caixinha itens".',
        ],
        codigo: `itens = signal<Item[]>([]);\n\nconstructor() {\n  this.api.itens('equipe-N').subscribe((lista) => this.itens.set(lista));\n}`,
        confere: 'O painel do front-end continua "rodando", sem erro.',
      },
      {
        id: 'c2-lista',
        titulo: 'A lista na tela',
        pontos: 20,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}equipe-N.html`,
        passos: [
          'Abra o equipe-N.html.',
          'Abaixo do comentário <!-- CICLO 2 ... -->, digite a section abaixo.',
          'O @for repete o <li> uma vez para cada item. As chaves duplas mostram um valor na tela.',
        ],
        codigo: `<section>\n  <h3>O que temos hoje</h3>\n  <ul>\n    @for (item of itens(); track item.nome) {\n      <li>{{ item.emoji }} <strong>{{ item.nome }}</strong> — {{ item.descricao }}</li>\n    }\n  </ul>\n</section>`,
        confere: 'A barraca mostra "O que temos hoje" com os três itens do Java.',
      },
      {
        id: 'c2-contador',
        titulo: 'Quantas opções',
        pontos: 10,
        nivel: 'bonus',
        arquivo: `${PASTA_FRONT}equipe-N.html`,
        passos: ['Logo depois do <h3>O que temos hoje</h3>, acrescente a linha abaixo.'],
        codigo: `<p>{{ itens().length }} opções</p>`,
        confere: 'Aparece "3 opções" logo abaixo do título da lista.',
      },
      {
        id: 'c2-vazio',
        titulo: 'Quando a lista estiver vazia',
        pontos: 10,
        nivel: 'bonus',
        arquivo: `${PASTA_FRONT}equipe-N.html`,
        passos: [
          'No @for, depois da chave que fecha o bloco, acrescente um @empty.',
          'Ele só aparece quando não há nenhum item.',
        ],
        codigo: `@for (item of itens(); track item.nome) {\n  <li>{{ item.emoji }} <strong>{{ item.nome }}</strong> — {{ item.descricao }}</li>\n} @empty {\n  <li>Acabou tudo! Voltem amanhã.</li>\n}`,
        confere: 'A lista continua igual (o aviso só aparece sem itens). A organização confere no código entregue.',
      },
      {
        id: 'c2-cartoes',
        titulo: 'Itens com cara de cartão',
        pontos: 10,
        nivel: 'desafio',
        arquivo: `${PASTA_FRONT}equipe-N.css`,
        passos: ['No fim do equipe-N.css, acrescente um bloco para os itens da lista.'],
        codigo: `li {\n  list-style: none;\n  margin: 8px 0;\n  padding: 12px;\n  border-radius: 12px;\n  background: #fff;\n  border: 2px solid var(--cor-da-barraca);\n}`,
        confere: 'Cada item da lista aparece numa caixinha com borda colorida, sem bolinha.',
      },
    ],
  },
  {
    numero: 3,
    titulo: 'Atender o visitante',
    missao: 'Um formulário que grava no banco, e o que foi gravado aparece na lista.',
    itens: [
      {
        id: 'c3-caixinhas',
        titulo: 'As caixinhas do recado',
        pontos: 20,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}equipe-N.ts`,
        passos: [
          'Abra o equipe-N.ts.',
          'Abaixo do comentário que começa com // CICLO 3, digite as linhas abaixo.',
          'recado guarda o que o visitante digita; recados guarda a lista que vem do banco.',
        ],
        codigo: `recado = signal('');\nrecados = signal<Registro[]>([]);\n\ncarregarRecados() {\n  this.api.registros('equipe-N').subscribe((lista) => this.recados.set(lista));\n}`,
        confere: 'O painel do front-end continua "rodando", sem erro.',
      },
      {
        id: 'c3-enviar',
        titulo: 'A ação de enviar',
        pontos: 15,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}equipe-N.ts`,
        passos: [
          'Logo abaixo do carregarRecados, digite a ação enviar.',
          'Ela grava o recado com o nome de quem está na tela e depois busca a lista de novo.',
        ],
        codigo: `enviar() {\n  const novo = { autor: this.feira.meuNome(), texto: this.recado() };\n  this.api.salvar('equipe-N', novo).subscribe(() => {\n    this.recado.set('');\n    this.carregarRecados();\n  });\n}`,
        confere: 'O painel do front-end continua "rodando", sem erro.',
      },
      {
        id: 'c3-construtor',
        titulo: 'A lista já vem carregada',
        pontos: 10,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}equipe-N.ts`,
        passos: ['Dentro do constructor() que a equipe fez no ciclo 2, acrescente uma linha no fim.'],
        codigo: `constructor() {\n  this.api.itens('equipe-N').subscribe((lista) => this.itens.set(lista));\n  this.carregarRecados();\n}`,
        confere: 'Ao abrir a barraca, os recados já gravados aparecem sem precisar clicar.',
      },
      {
        id: 'c3-formulario',
        titulo: 'O formulário',
        pontos: 15,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}equipe-N.html`,
        passos: [
          'Abra o equipe-N.html.',
          'Abaixo do comentário <!-- CICLO 3 ... -->, digite a section abaixo.',
          '[(ngModel)] liga o campo à caixinha recado; (click) diz qual ação roda no clique.',
        ],
        codigo: `<section>\n  <h3>Deixe seu recado</h3>\n  <input class="campo" [(ngModel)]="recado" placeholder="Escreva aqui" />\n  <button class="botao" (click)="enviar()" [disabled]="!recado()">Enviar</button>\n</section>`,
        confere: 'Aparece um campo e um botão Enviar, que só acende quando há texto.',
      },
      {
        id: 'c3-lista',
        titulo: 'Os recados na tela',
        pontos: 10,
        nivel: 'essencial',
        arquivo: `${PASTA_FRONT}equipe-N.html`,
        passos: ['Dentro da mesma section, depois do botão, acrescente a lista dos recados.'],
        codigo: `<ul>\n  @for (item of recados(); track item.id) {\n    <li><strong>{{ item.autor }}</strong>: {{ item.texto }}</li>\n  }\n</ul>`,
        confere: 'O repórter escreve um recado, clica em Enviar e ele aparece na lista com o nome dele.',
      },
      {
        id: 'c3-total',
        titulo: 'Quantos recados',
        pontos: 10,
        nivel: 'bonus',
        arquivo: `${PASTA_FRONT}equipe-N.html`,
        passos: ['Logo depois do <h3>Deixe seu recado</h3>, acrescente a linha abaixo.'],
        codigo: `<p>{{ recados().length }} recados até agora</p>`,
        confere: 'Aparece quantos recados já foram gravados, e o número sobe a cada envio.',
      },
      {
        id: 'c3-pescar',
        titulo: 'A pescaria',
        pontos: 20,
        nivel: 'desafio',
        arquivo: 'EquipeNController.java, equipe-N.ts e equipe-N.html',
        passos: [
          'No EquipeNController.java: junto dos outros import do topo, acrescente import java.util.Random;',
          'Ainda no Java, abaixo do comentário do CICLO 3 · DESAFIO, digite o método pescar (primeiro bloco abaixo).',
          'No equipe-N.ts, abaixo do comentário // CICLO 3 · DESAFIO, digite o segundo bloco.',
          'No equipe-N.html, abaixo do comentário <!-- CICLO 3 · DESAFIO ... -->, digite o terceiro bloco.',
        ],
        codigo: `// Java\nprivate final Random sorte = new Random();\n\n@GetMapping("/pescar")\npublic Item pescar() {\n    List<Item> premios = itens();\n    return premios.get(sorte.nextInt(premios.size()));\n}\n\n// equipe-N.ts\npremio = signal<Item | null>(null);\n\npescar() {\n  this.api.buscar<Item>('equipe-N', 'pescar').subscribe((item) => this.premio.set(item));\n}\n\n<!-- equipe-N.html -->\n<button class="botao" (click)="pescar()">🎣 Pescar</button>\n@if (premio(); as item) {\n  <p>{{ item.emoji }} Você pescou: <strong>{{ item.nome }}</strong>!</p>\n}`,
        confere: 'Um botão Pescar sorteia um dos itens da lista e mostra "Você pescou: ...".',
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
