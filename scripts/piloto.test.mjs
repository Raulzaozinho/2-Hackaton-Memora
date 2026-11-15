import { test } from 'node:test';
import assert from 'node:assert/strict';
import { errosDoBack, errosDoFront } from './piloto.mjs';

test('mostra ao repórter o arquivo e a linha de um erro de compilação Java', () => {
  const linhas = [
    '[INFO] Compiling 20 source files',
    '[ERROR] COMPILATION ERROR :',
    "[ERROR] C:\\feira\\backend\\src\\main\\java\\br\\com\\memora\\feira\\barracas\\equipe1\\Equipe1Controller.java:[26,13] ';' expected",
    '[INFO] BUILD FAILURE',
  ];
  assert.deepEqual(errosDoBack(linhas), ["Equipe1Controller.java, linha 26: ';' expected"]);
});

test('explica quando o back-end compila mas não sobe', () => {
  const linhas = [
    'APPLICATION FAILED TO START',
    "Caused by: java.lang.IllegalStateException: Ambiguous mapping. Cannot map 'equipe1Controller' method",
    'to {GET [/api/barracas/equipe-1/itens]}: There is already a method',
  ];
  assert.match(errosDoBack(linhas)[0], /dois métodos respondem em GET \/api\/barracas\/equipe-1\/itens/);
});

test('back-end sem erro não mostra nada', () => {
  assert.deepEqual(errosDoBack(['Started FeiraApplication in 4.2 seconds']), []);
});

test('mostra ao repórter o arquivo e a linha de um erro do Angular', () => {
  const linhas = [
    'Application bundle generation failed. [1.2 seconds]',
    'X [ERROR] TS1002: Unterminated string literal. [plugin angular-compiler]',
    '',
    '    src/app/barracas/equipe-1/barraca.config.ts:7:10:',
    "      7 │   slogan: 'Recheio até a ponta,",
  ];
  assert.deepEqual(errosDoFront(linhas),
    ['src/app/barracas/equipe-1/barraca.config.ts, linha 7: TS1002: Unterminated string literal.']);
});

test('o mesmo erro do Angular e do TypeScript aparece uma vez só', () => {
  const linhas = [
    'X [ERROR] Unterminated string literal',
    '    src/app/barracas/equipe-1/barraca.config.ts:7:32:',
    'X [ERROR] TS1002: Unterminated string literal. [plugin angular-compiler]',
    '    C:/feira/frontend/src/app/barracas/equipe-1/barraca.config.ts:7:31:',
    "X [ERROR] TS1005: ',' expected. [plugin angular-compiler]",
    '    C:/feira/frontend/src/app/barracas/equipe-1/barraca.config.ts:8:2:',
  ];
  assert.deepEqual(errosDoFront(linhas), [
    'src/app/barracas/equipe-1/barraca.config.ts, linha 7: Unterminated string literal',
    "src/app/barracas/equipe-1/barraca.config.ts, linha 8: TS1005: ',' expected.",
  ]);
});
