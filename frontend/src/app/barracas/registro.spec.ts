import { BARRACAS, BARRACA_MODELO } from './registro';

// Confere que a configuração de cada barraca está preenchida do jeito que a feira e o telão esperam.
describe('configuração das barracas', () => {
  for (const barraca of [...BARRACAS, BARRACA_MODELO]) {
    it(`${barraca.id} tem nome, slogan, emoji e cor válidos`, () => {
      expect(barraca.nome.trim().length, 'o nome não pode ficar vazio').toBeGreaterThan(0);
      expect(barraca.nome.length, 'o nome tem no máximo 30 letras').toBeLessThanOrEqual(30);
      expect(barraca.slogan.length, 'o slogan tem no máximo 80 letras').toBeLessThanOrEqual(80);
      expect(barraca.emoji.trim().length, 'escolha um emoji').toBeGreaterThan(0);
      expect(barraca.cor, 'a cor precisa ser hexadecimal, como #e4572e').toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  }
});
