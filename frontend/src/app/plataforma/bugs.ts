/**
 * Os bugs da carta "Caça ao bug": o telão mostra um trecho de código com um erro, e o primeiro
 * repórter que disser qual é o erro e como corrigir ganha +10 para a equipe. São os erros que mais
 * aparecem nas missões. A organização vê a resposta no painel.
 */

export interface BugDoTelao {
  arquivo: string;
  codigo: string;
  resposta: string;
}

export const BUGS: BugDoTelao[] = [
  {
    arquivo: 'equipe-N.ts',
    codigo: `constructor() {\n  this.api.itens('equipe-N').subscribe((lista) => this.itens.set);\n}`,
    resposta: 'Falta entregar a lista para a caixinha: this.itens.set(lista)',
  },
  {
    arquivo: 'EquipeNController.java',
    codigo: `return List.of(\n        new Item("🍓", "Morango", "Bem docinho")\n        new Item("🍫", "Chocolate", "Cremoso"));`,
    resposta: 'Falta a vírgula entre um new Item(...) e o outro',
  },
  {
    arquivo: 'equipe-N.html',
    codigo: `<p>{{ curtidas }} curtidas</p>`,
    resposta: 'Para ler a caixinha precisa de parênteses: {{ curtidas() }}',
  },
  {
    arquivo: 'equipe-N.html',
    codigo: `<button [click]="curtidas.set(curtidas() + 1)">❤️ Curtir</button>`,
    resposta: 'Evento de clique usa parênteses, não colchetes: (click)',
  },
  {
    arquivo: 'equipe-N.html',
    codigo: `@for (item of itens()) {\n  <li>{{ item.nome }}</li>\n}`,
    resposta: 'Falta o track no @for: @for (item of itens(); track item.nome)',
  },
  {
    arquivo: 'EquipeNController.java',
    codigo: `@GetMapping("/itens/{posicao}")\npublic Item consultarPorPosicao(int posicao) {\n    return itens().get(posicao);\n}`,
    resposta: 'Falta o @PathVariable antes do int posicao',
  },
  {
    arquivo: 'EquipeNController.java',
    codigo: `@GetMapping("/destaque")\npublic Item consultarDestaque() {\n    return new Item('⭐', 'Churros', 'O destaque do dia');\n}`,
    resposta: 'Em Java, texto usa aspas duplas: new Item("⭐", "Churros", "O destaque do dia")',
  },
  {
    arquivo: 'equipe-N.html',
    codigo: `<input class="campo" [(ngModel)]="recado()" />`,
    resposta: 'No [(ngModel)] vai a caixinha sem parênteses: [(ngModel)]="recado"',
  },
  {
    arquivo: 'EquipeNController.java',
    codigo: `@GetMapping("/destaque")\npublic Item consultarDestaque() {\n    return new Item("⭐", "Churros", "O destaque do dia")\n}`,
    resposta: 'Falta o ponto e vírgula no fim do return',
  },
  {
    arquivo: 'equipe-N.html',
    codigo: `@for (item of itens(); track item.nome) {\n  <li>{{ item.nome }} @if (first) { ⭐ mais pedido }</li>\n}`,
    resposta: 'O primeiro da volta se chama $first, com cifrão: @if ($first)',
  },
];

/**
 * O bug da carta que está no telão. Todas as telas escolhem o mesmo, porque a escolha vem do
 * horário em que a carta termina (igual para todo mundo).
 */
export function bugDaCarta(terminaEm: string | null | undefined): BugDoTelao | null {
  if (!terminaEm) return null;
  const segundos = Math.floor(Date.parse(terminaEm) / 1000);
  return Number.isNaN(segundos) ? null : BUGS[segundos % BUGS.length];
}
