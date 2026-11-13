import { classificarResultado } from './resultado';

describe('resultado da votação', () => {
  it('divide o primeiro lugar quando há empate', () => {
    const resultado = classificarResultado([
      { barraca: 'equipe-1', fichas: 2 },
      { barraca: 'equipe-2', fichas: 5 },
      { barraca: 'equipe-3', fichas: 5 },
    ]);
    expect(resultado.map((r) => r.posicao)).toEqual([1, 1, 3]);
    expect(resultado.map((r) => r.empate)).toEqual([true, true, false]);
  });

  it('não inventa uma campeã quando ninguém votou', () => {
    const resultado = classificarResultado([
      { barraca: 'equipe-1', fichas: 0 }, { barraca: 'equipe-2', fichas: 0 }, { barraca: 'equipe-3', fichas: 0 },
    ]);
    expect(resultado.every((r) => r.posicao === 1 && r.empate)).toBe(true);
  });
});
