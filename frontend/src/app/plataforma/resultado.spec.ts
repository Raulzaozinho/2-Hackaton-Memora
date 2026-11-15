import { classificarResultado } from './resultado';

const linha = (barraca: string, total: number) => ({ barraca, pontosDoManual: total, fichas: 0, total });

describe('resultado final', () => {
  it('ordena pelo total e divide o primeiro lugar quando há empate', () => {
    const resultado = classificarResultado([linha('equipe-1', 120), linha('equipe-2', 190), linha('equipe-3', 190)]);
    expect(resultado.map((r) => r.barraca)).toEqual(['equipe-2', 'equipe-3', 'equipe-1']);
    expect(resultado.map((r) => r.posicao)).toEqual([1, 1, 3]);
    expect(resultado.map((r) => r.empate)).toEqual([true, true, false]);
  });

  it('não inventa uma campeã quando ninguém pontuou', () => {
    const resultado = classificarResultado([linha('equipe-1', 0), linha('equipe-2', 0), linha('equipe-3', 0)]);
    expect(resultado.every((r) => r.posicao === 1 && r.empate)).toBe(true);
  });

  it('soma o manual e as fichas no total que vem do back-end', () => {
    const resultado = classificarResultado([
      { barraca: 'equipe-1', pontosDoManual: 100, fichas: 2, total: 110 },
      { barraca: 'equipe-2', pontosDoManual: 90, fichas: 6, total: 120 },
    ]);
    expect(resultado[0].barraca).toBe('equipe-2');
  });
});
