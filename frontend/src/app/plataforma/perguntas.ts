/**
 * As perguntas relâmpago: aparecem no telão durante a avaliação, sobre a aula do ciclo.
 * Quem responder primeiro em voz alta ganha +5 para a equipe (a organização marca no painel).
 */

export interface PerguntaRelampago {
  pergunta: string;
  resposta: string;
}

export const PERGUNTAS: Record<number, PerguntaRelampago[]> = {
  1: [
    { pergunta: 'Para mostrar o valor de uma caixinha na tela, usamos chaves duplas ou parênteses?', resposta: 'Chaves duplas: {{ curtidas() }}' },
    { pergunta: 'Qual arquivo diz COMO a barraca aparece: o .html, o .css ou o .ts?', resposta: 'O .css' },
    { pergunta: 'Na comparação da aula, o Spring Boot é a vitrine ou a cozinha?', resposta: 'A cozinha' },
    { pergunta: 'O que o @GetMapping("/destaque") define?', resposta: 'O endereço do endpoint: /api/barracas/equipe-N/destaque' },
    { pergunta: 'Como se chama o formato de texto que o Java devolve para o navegador?', resposta: 'JSON' },
  ],
  2: [
    { pergunta: 'Na lista do Java, qual é a posição do primeiro item: 0 ou 1?', resposta: 'Zero' },
    { pergunta: 'O que o @for faz no HTML?', resposta: 'Repete o bloco uma vez para cada item da lista' },
    { pergunta: 'Em /itens/{posicao}, qual anotação entrega a posição para o método?', resposta: '@PathVariable' },
    { pergunta: 'O que quer dizer "subscribe" em português?', resposta: '"Quando a resposta chegar, faça isto"' },
    { pergunta: 'Como saber quantos itens tem a lista no HTML?', resposta: 'itens().length' },
    { pergunta: 'No SSM, o controller faz o trabalho sozinho ou chama alguém?', resposta: 'Chama o service (XxxController → XxxService)' },
  ],
  3: [
    { pergunta: 'O que o [(ngModel)] faz no campo do formulário?', resposta: 'Liga o campo à caixinha: o que a pessoa digita vai para ela' },
    { pergunta: 'Para gravar algo no back-end, o front manda um GET ou um POST?', resposta: 'Um POST' },
    { pergunta: 'Por que a gente busca a lista de novo depois de enviar?', resposta: 'Para o recado novo aparecer no mural' },
    { pergunta: 'O que o [disabled]="!recado()" faz no botão?', resposta: 'Apaga o botão enquanto o campo está vazio' },
    { pergunta: 'Qual classe do Java sorteia números?', resposta: 'Random (com nextInt)' },
    { pergunta: 'No SSM, como se chama o método que cria um registro novo?', resposta: 'cadastrar (ou incluir)' },
  ],
};

export function perguntaDoCiclo(ciclo: number, posicao: number | null | undefined): PerguntaRelampago | null {
  const lista = PERGUNTAS[ciclo];
  if (!lista?.length || posicao === null || posicao === undefined) return null;
  return lista[posicao % lista.length];
}
