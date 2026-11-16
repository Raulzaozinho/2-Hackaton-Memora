/**
 * As perguntas relâmpago: aparecem no centro do telão, sobre a aula do ciclo.
 * Quem responder primeiro em voz alta ganha +5 para a equipe (a organização marca no painel).
 *
 * Regra das perguntas: abertas, sem dar a resposta no enunciado. Quando houver alternativas,
 * são sempre 5 (A a E), e a resposta diz a letra.
 */

export interface PerguntaRelampago {
  pergunta: string;
  resposta: string;
  /** Só nas perguntas de múltipla escolha: sempre 5 alternativas, mostradas como A, B, C, D e E. */
  opcoes?: string[];
}

export const LETRAS = ['A', 'B', 'C', 'D', 'E'];

export const PERGUNTAS: Record<number, PerguntaRelampago[]> = {
  1: [
    { pergunta: 'Como se mostra na tela o valor de uma caixinha (signal) chamada curtidas?', resposta: 'Com chaves duplas: {{ curtidas() }}' },
    {
      pergunta: 'Qual arquivo diz COMO a barraca aparece: a cor, a borda e o tamanho da letra?',
      opcoes: ['equipe-N.html', 'equipe-N.ts', 'equipe-N.css', 'barraca.config.ts', 'EquipeNController.java'],
      resposta: 'C) equipe-N.css',
    },
    { pergunta: 'Na comparação da aula, o que o Spring Boot é na barraca?', resposta: 'A cozinha: prepara e manda para a vitrine' },
    { pergunta: 'Qual anotação do Java cria um endereço novo na cozinha?', resposta: '@GetMapping (por exemplo, @GetMapping("/destaque"))' },
    {
      pergunta: 'O que o (click) faz num botão?',
      opcoes: [
        'Mostra um valor na tela',
        'Faz alguma coisa quando alguém clica',
        'Muda a cor do botão',
        'Cria um endereço no Java',
        'Grava no banco de dados',
      ],
      resposta: 'B) Faz alguma coisa quando alguém clica',
    },
    { pergunta: 'Como se chama o formato de texto que a cozinha manda para a vitrine?', resposta: 'JSON' },
  ],
  2: [
    { pergunta: 'Na lista do Java, qual é a posição do primeiro item?', resposta: 'Zero: /itens/0 é o primeiro' },
    { pergunta: 'O que o @for faz no HTML?', resposta: 'Repete o bloco uma vez para cada item da lista' },
    {
      pergunta: 'Em /itens/{posicao}, qual anotação entrega a posição para o método do Java?',
      opcoes: ['@GetMapping', '@PathVariable', '@RestController', '@Service', '@RequestBody'],
      resposta: 'B) @PathVariable',
    },
    { pergunta: 'O que o .subscribe(...) quer dizer, em português?', resposta: '"Quando a resposta chegar, faça isto"' },
    { pergunta: 'Como se descobre, no HTML, quantos itens a lista tem?', resposta: 'itens().length' },
    {
      pergunta: 'No SSM, quem o controller chama para fazer o trabalho?',
      opcoes: ['O banco de dados direto', 'O service', 'O front-end', 'Outro controller', 'Ninguém: ele faz tudo sozinho'],
      resposta: 'B) O service, recebido pelo construtor',
    },
    { pergunta: 'O que o $first marca dentro do @for?', resposta: 'O primeiro item da lista (a primeira volta)' },
  ],
  3: [
    { pergunta: 'O que o [(ngModel)] faz no campo do formulário?', resposta: 'Liga o campo à caixinha: o que a pessoa digita vai para ela, e o contrário também' },
    {
      pergunta: 'Para cadastrar um recado novo no back-end, que tipo de pedido o front manda?',
      opcoes: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      resposta: 'B) POST',
    },
    { pergunta: 'Por que a gente busca a lista de novo depois de enviar um recado?', resposta: 'Para o recado novo aparecer no mural' },
    { pergunta: 'O que o [disabled]="!recado()" faz no botão?', resposta: 'Deixa o botão apagado enquanto o campo está vazio' },
    { pergunta: 'Qual classe do Java sorteia números?', resposta: 'Random (com o nextInt)' },
    {
      pergunta: 'No SSM, como costuma se chamar o método que cria um registro novo?',
      opcoes: ['listarTodos', 'consultarPorId', 'cadastrar', 'excluir', 'alterar'],
      resposta: 'C) cadastrar',
    },
  ],
};

export function perguntaDoCiclo(ciclo: number, posicao: number | null | undefined): PerguntaRelampago | null {
  const lista = PERGUNTAS[ciclo];
  if (!lista?.length || posicao === null || posicao === undefined) return null;
  return lista[posicao % lista.length];
}
