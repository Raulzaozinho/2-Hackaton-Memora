import { Placar } from './tipos';

/** Ordena pelo total (manual + fichas). Totais iguais dividem a posição; a ordem das equipes não desempata. */
export function classificarResultado(placar: Placar[]) {
  const ordenado = [...placar].sort((a, b) => b.total - a.total);
  return ordenado.map((linha) => ({
    ...linha,
    posicao: ordenado.findIndex((outra) => outra.total === linha.total) + 1,
    empate: ordenado.filter((outra) => outra.total === linha.total).length > 1,
  }));
}

/**
 * A revelação no telão, em segundos desde o clique em "Revelar no telão": uma introdução, depois
 * uma posição a cada 4 segundos, de baixo para cima, e um tambor de 3 segundos antes da campeã.
 */
export const REVELACAO = { intro: 3, entre: 4, tambor: 3 };

/** As posições que existem (empates dividem a mesma), da melhor para a pior. */
export function posicoesDistintas(linhas: { posicao: number }[]): number[] {
  return [...new Set(linhas.map((linha) => linha.posicao))].sort((a, b) => a - b);
}

/** Em que segundo da revelação uma posição aparece. A primeira posição é a última a aparecer. */
export function momentoDaPosicao(posicao: number, linhas: { posicao: number }[]): number {
  const posicoes = posicoesDistintas(linhas);
  const quantas = posicoes.length;
  if (posicao === posicoes[0]) return REVELACAO.intro + REVELACAO.entre * (quantas - 1) + REVELACAO.tambor;
  const daPiorParaCima = quantas - 1 - posicoes.indexOf(posicao);
  return REVELACAO.intro + REVELACAO.entre * daPiorParaCima;
}

/** Quanto dura a revelação inteira, até a campeã aparecer. */
export function duracaoDaRevelacao(linhas: { posicao: number }[]): number {
  return linhas.length ? momentoDaPosicao(posicoesDistintas(linhas)[0], linhas) : 0;
}
