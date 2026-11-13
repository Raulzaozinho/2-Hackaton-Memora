import { Placar } from './tipos';

/** Pontuações iguais dividem a posição; a ordem das equipes não desempata a votação. */
export function classificarResultado(placar: Placar[]) {
  const ordenado = [...placar].sort((a, b) => b.fichas - a.fichas);
  return ordenado.map((linha) => ({
    ...linha,
    posicao: ordenado.findIndex((outra) => outra.fichas === linha.fichas) + 1,
    empate: ordenado.filter((outra) => outra.fichas === linha.fichas).length > 1,
  }));
}
