/**
 * A carta "Caça ao bug": enquanto ela está ativa, o próprio telão fica com um defeito visível
 * (um nome com letras trocadas, um emoji de cabeça para baixo, uma cor errada...). Quem achar
 * primeiro mostra para a organização, que dá os pontos. O painel da organização diz onde está.
 */

export type TipoDeBug = 'emoji' | 'nomeBarraca' | 'pessoa' | 'papel' | 'slogan' | 'cor' | 'titulo' | 'marca';

export interface BugVisual {
  tipo: TipoDeBug;
  /** A posição da barraca no telão (0, 1 ou 2), nos defeitos que ficam numa barraca. */
  equipe: number;
}

const TIPOS: TipoDeBug[] = ['emoji', 'nomeBarraca', 'pessoa', 'papel', 'slogan', 'cor', 'titulo', 'marca'];

/**
 * O defeito da carta que está no telão. Todas as telas escolhem o mesmo, porque a escolha vem do
 * horário em que a carta termina (igual para todo mundo). Cada carta nova sorteia outro.
 */
export function bugVisualDaCarta(terminaEm: string | null | undefined): BugVisual | null {
  if (!terminaEm) return null;
  const segundos = Math.floor(Date.parse(terminaEm) / 1000);
  if (Number.isNaN(segundos)) return null;
  return { tipo: TIPOS[segundos % TIPOS.length], equipe: Math.floor(segundos / TIPOS.length) % 3 };
}

/** Troca duas letras do meio da primeira palavra com 4 letras ou mais: "Bruno" vira "Burno". */
export function trocarLetras(texto: string): string {
  const palavras = texto.split(' ');
  const i = palavras.findIndex((palavra) => [...palavra].length >= 4);
  if (i < 0) return texto;
  const letras = [...palavras[i]];
  const a = letras[1] !== letras[2] ? 1 : 2;
  [letras[a], letras[a + 1]] = [letras[a + 1], letras[a]];
  palavras[i] = letras.join('');
  return palavras.join(' ');
}

/** O que a organização procura no telão, para conferir quem acertou. */
export function descreverBug(bug: BugVisual, nomeDaBarraca: string, primeiraPessoa: string, tituloDaEtapa: string): string {
  switch (bug.tipo) {
    case 'emoji':
      return `O emoji da ${nomeDaBarraca} está de cabeça para baixo.`;
    case 'nomeBarraca':
      return `O nome da barraca está com letras trocadas: "${trocarLetras(nomeDaBarraca)}".`;
    case 'pessoa':
      return `Na ${nomeDaBarraca}, o nome de ${primeiraPessoa} está com letras trocadas: "${trocarLetras(primeiraPessoa)}".`;
    case 'papel':
      return `Na ${nomeDaBarraca}, o piloto aparece como "só o manual" (o certo é "só o código").`;
    case 'slogan':
      return `O slogan da ${nomeDaBarraca} está espelhado (de trás para frente).`;
    case 'cor':
      return `A ${nomeDaBarraca} está com a cor de outra barraca.`;
    case 'titulo':
      return `O título da etapa está com letras trocadas: "${trocarLetras(tituloDaEtapa)}".`;
    case 'marca':
      return `No alto do telão, "Feira Dev" está escrito "Fiera Dev".`;
  }
}
