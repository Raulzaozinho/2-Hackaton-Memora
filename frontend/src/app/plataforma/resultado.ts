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
