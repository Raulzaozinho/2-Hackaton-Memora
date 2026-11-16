#!/usr/bin/env node
// Deixa o computador pronto para pilotar na Feira Dev e confere tudo no fim.
//
//   Windows: preparar.cmd (na raiz do projeto), que também arruma o Node e o Java
//   Mac/Linux: node scripts/preparar.mjs (com Node 24 e Java 21 já instalados)
//
// 1. Pergunta o seu usuário do GitHub e o nome que aparece no telão, e grava só neste projeto
//    (o seu e-mail da empresa não vai para o repositório, que é público).
// 2. Baixa as dependências do front-end (npm ci) e do back-end (Maven).
// 3. Confere as portas que o piloto usa e se você já consegue enviar código para o GitHub.

import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const FRONT = join(RAIZ, 'frontend');
const BACK = join(RAIZ, 'backend');
const WINDOWS = process.platform === 'win32';

const verde = (t) => `\u001b[32m${t}\u001b[0m`;
const vermelho = (t) => `\u001b[31m${t}\u001b[0m`;
const amarelo = (t) => `\u001b[33m${t}\u001b[0m`;
const titulo = (t) => console.log(`\n\u001b[36m== ${t}\u001b[0m`);

const resultado = [];
const ok = (t) => { console.log(verde(`  ✔ ${t}`)); resultado.push([true, t]); };
const falha = (t, oQueFazer) => { console.log(vermelho(`  ✘ ${t}`)); if (oQueFazer) console.log(`    ${oQueFazer}`); resultado.push([false, t, oQueFazer]); };

function git(...args) {
  const r = spawnSync('git', args, { cwd: RAIZ, encoding: 'utf8' });
  return { ok: r.status === 0, saida: `${r.stdout ?? ''}${r.stderr ?? ''}`.trim() };
}

function rodar(comando, pasta) {
  // shell: true porque no Windows npm e mvnw são arquivos .cmd.
  return spawnSync(comando, { cwd: pasta, shell: true, stdio: 'inherit' }).status === 0;
}

function portaLivre(porta) {
  return new Promise((resolver) => {
    const teste = createServer();
    teste.once('error', () => resolver(false));
    teste.once('listening', () => teste.close(() => resolver(true)));
    teste.listen(porta);
  });
}

console.log(amarelo('Feira Dev — preparando este computador para pilotar'));

// ------------------------------------------------------------------ 1. quem é você
titulo('Quem é você no Git');
const emailAtual = git('config', '--local', 'user.email').saida;
let usuario = emailAtual.endsWith('@users.noreply.github.com') ? emailAtual.split('@')[0].replace(/^\d+\+/, '') : '';
if (usuario) {
  ok(`já configurado: ${git('config', '--local', 'user.name').saida} (GitHub: ${usuario})`);
} else {
  const leitor = createInterface({ input: process.stdin, output: process.stdout });
  while (!usuario) usuario = (await leitor.question('  Seu usuário do GitHub (ex.: brunofurtado): ')).trim().replace(/^@/, '');
  let nome = '';
  while (!nome) nome = (await leitor.question('  Seu nome como vai aparecer no telão (ex.: Bruno): ')).trim();
  leitor.close();
  git('config', '--local', 'user.name', nome);
  git('config', '--local', 'user.email', `${usuario}@users.noreply.github.com`);
  ok(`commits deste projeto saem como "${nome}" (GitHub: ${usuario}), sem o seu e-mail`);
}
git('config', '--local', 'core.longpaths', 'true');

// ------------------------------------------------------------------ 2. dependências
titulo('Dependências do front-end (npm ci, 1 a 3 minutos)');
const marca = join(FRONT, 'node_modules', '.package-lock.json');
const lock = join(FRONT, 'package-lock.json');
if (existsSync(marca) && statSync(marca).mtimeMs >= statSync(lock).mtimeMs) {
  ok('já estavam baixadas');
} else if (rodar('npm ci --no-audit --no-fund', FRONT)) {
  ok('front-end pronto');
} else {
  falha('o npm ci falhou', 'Leia a mensagem acima. Rede da empresa? Tente de novo em outra rede ou chame o Raul.');
}

titulo('Dependências do back-end (Maven, 1 a 5 minutos na primeira vez)');
if (rodar(WINDOWS ? '.\\mvnw.cmd -q -DskipTests package' : './mvnw -q -DskipTests package', BACK)) {
  ok('back-end compila');
} else {
  falha('o back-end não compilou', 'Leia a mensagem acima. "JAVA_HOME" errado? Rode o preparar de novo ou chame o Raul.');
}

// ------------------------------------------------------------------ 3. conferências
titulo('Portas que o piloto usa');
for (const [porta, uso] of [[8080, 'back-end'], [4200, 'front-end'], [4201, 'painel do repórter']]) {
  if (await portaLivre(porta)) ok(`porta ${porta} livre (${uso})`);
  else falha(`a porta ${porta} (${uso}) está ocupada agora`, 'Feche o programa que usa essa porta (talvez outro projeto rodando) antes de pilotar.');
}

titulo('Acesso ao repositório no GitHub');
console.log('  Se abrir uma janela do GitHub, entre com a sua conta.');
const acesso = git('push', '--dry-run', 'origin', `HEAD:refs/heads/teste-de-acesso-${usuario}`);
if (acesso.ok) {
  ok('você já consegue enviar código (o convite foi aceito)');
} else if (/403|denied|not found|Repository not found/i.test(acesso.saida)) {
  falha('ainda sem permissão para enviar código',
    `Mande o seu usuário do GitHub (${usuario}) para o Raul e aceite o convite em https://github.com/Raulzaozinho/2-Hackaton-Memora/invitations. Depois rode o preparar de novo.`);
} else {
  falha('não deu para falar com o GitHub', acesso.saida.split('\n').slice(-2).join(' '));
}

// ------------------------------------------------------------------ resumo
const problemas = resultado.filter(([certo]) => !certo);
console.log('');
if (problemas.length === 0) {
  console.log(verde('Tudo pronto! Para conferir de verdade, rode o piloto.cmd (Mac: node scripts/piloto.mjs)'));
  console.log(verde('e abra http://localhost:4201/painel. Ctrl+C para fechar. Até amanhã!'));
} else {
  console.log(vermelho(`Faltam ${problemas.length} coisa(s):`));
  for (const [, texto, oQueFazer] of problemas) console.log(vermelho(`  ✘ ${texto}`) + (oQueFazer ? `\n    ${oQueFazer}` : ''));
}
process.exitCode = problemas.length === 0 ? 0 : 1;
