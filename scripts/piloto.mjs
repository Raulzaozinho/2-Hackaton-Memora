#!/usr/bin/env node
// O PILOTO — liga o projeto no computador de quem pilota e abre o painel do repórter.
//
//   node scripts/piloto.mjs
//
// Sobe o back-end e o front-end, reinicia o back-end sozinho quando um arquivo Java muda e
// serve, na porta 4201, o PAINEL DO REPÓRTER: a barraca rodando e as mensagens de erro do
// front e do back-end. O repórter abre esse painel no computador dele; o piloto não precisa
// olhar para nada além do editor.

import { spawn, spawnSync } from 'node:child_process';
import { watch } from 'node:fs';
import { createServer, request as httpRequest } from 'node:http';
import { connect } from 'node:net';
import { networkInterfaces } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { motivoDaFalhaAoSubir } from './telao.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const FRONT = join(RAIZ, 'frontend');
const BACK = join(RAIZ, 'backend');
const WINDOWS = process.platform === 'win32';
const PORTA_DO_PAINEL = 4201;
const PORTA_DO_FRONT = 4200;
const LINHAS_GUARDADAS = 300;

// ------------------------------------------------------------------ leitura das mensagens

const semCores = (texto) => texto.replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');

/** Encurta "C:\...\barracas\equipe1\Equipe1Controller.java:[26,13] ';' expected" para algo legível. */
export function errosDoBack(linhas) {
  const texto = linhas.join('\n');
  const compilacao = [...texto.matchAll(/\[ERROR\][^\n]*?([\w-]+\.java):\[(\d+),\d+\]\s*(.+)/g)]
    .map(([, arquivo, linha, mensagem]) => `${arquivo}, linha ${linha}: ${mensagem.trim()}`);
  if (compilacao.length) {
    return [...new Set(compilacao)];
  }
  if (/APPLICATION FAILED TO START|Application run failed|BUILD FAILURE/.test(texto)) {
    const motivo = motivoDaFalhaAoSubir(texto);
    return [motivo ? `O back-end não conseguiu subir: ${motivo}` : 'O back-end não conseguiu subir. Veja o registro completo abaixo.'];
  }
  return [];
}

/** O Angular escreve "✘ [ERROR] mensagem" e, logo abaixo, "src/app/...:linha:coluna". */
export function errosDoFront(linhas) {
  // O mesmo erro costuma vir duas vezes (do Angular e do TypeScript): fica o primeiro de cada linha.
  const porLugar = new Map();
  for (let i = 0; i < linhas.length; i++) {
    const erro = /\[ERROR\]\s*(.+)/.exec(linhas[i]);
    if (!erro) continue;
    const mensagem = erro[1].replace(/\s*\[plugin [^\]]+\]/, '').trim();
    const onde = linhas.slice(i + 1, i + 6).map((l) => /(src\/[^\s:]+):(\d+):\d+/.exec(l)).find(Boolean);
    const lugar = onde ? `${onde[1]}, linha ${onde[2]}` : mensagem;
    if (!porLugar.has(lugar)) porLugar.set(lugar, onde ? `${lugar}: ${mensagem}` : mensagem);
  }
  return [...porLugar.values()];
}

// ------------------------------------------------------------------ os dois programas

function criarProcesso(nome) {
  return { nome, situacao: 'parado', linhas: [], erros: [], filho: null, resto: '' };
}

const back = criarProcesso('back-end');
const front = criarProcesso('front-end');

/** A saída chega em pedaços que podem cortar uma linha no meio: só linhas completas são guardadas. */
function guardar(processo, pedaco) {
  const partes = (processo.resto + semCores(pedaco.toString())).split(/\r?\n/);
  processo.resto = partes.pop() ?? '';
  const novas = partes.filter((l) => l.trim() !== '');
  processo.linhas.push(...novas);
  processo.linhas.splice(0, Math.max(0, processo.linhas.length - LINHAS_GUARDADAS));
  return novas;
}

function iniciar(processo, comando, pasta, aoLer) {
  processo.filho = spawn(comando, { cwd: pasta, shell: true, detached: !WINDOWS });
  processo.filho.stdout.on('data', (pedaco) => aoLer(guardar(processo, pedaco)));
  processo.filho.stderr.on('data', (pedaco) => aoLer(guardar(processo, pedaco)));
  const filho = processo.filho;
  filho.on('exit', (codigo) => {
    if (processo.filho !== filho) return; // foi reiniciado de propósito
    processo.filho = null;
    if (processo.situacao !== 'erro') {
      processo.situacao = 'erro';
      processo.erros = processo.erros.length ? processo.erros : [`O ${processo.nome} parou (código ${codigo}).`];
    }
  });
}

function encerrar(processo) {
  const filho = processo.filho;
  processo.filho = null;
  if (!filho || filho.exitCode !== null) return;
  if (WINDOWS) {
    spawnSync('taskkill', ['/pid', String(filho.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    try { process.kill(-filho.pid, 'SIGTERM'); } catch { /* já tinha parado */ }
  }
}

function ligarBack() {
  encerrar(back);
  back.linhas = [];
  back.erros = [];
  back.situacao = 'compilando';
  iniciar(back, WINDOWS ? '.\\mvnw.cmd spring-boot:run' : './mvnw spring-boot:run', BACK, () => {
    if (back.linhas.some((l) => /Started FeiraApplication/.test(l))) {
      back.situacao = 'rodando';
      back.erros = [];
      return;
    }
    const erros = errosDoBack(back.linhas);
    if (erros.length) {
      back.situacao = 'erro';
      back.erros = erros;
    }
  });
}

function ligarFront() {
  front.situacao = 'compilando';
  let bloco = [];
  iniciar(front, `npx ng serve --port ${PORTA_DO_FRONT}`, FRONT, (novas) => {
    for (const linha of novas) {
      bloco.push(linha);
      if (/generation failed/i.test(linha)) {
        front.situacao = 'erro';
        bloco = [linha];
      } else if (/generation complete/i.test(linha)) {
        front.situacao = 'rodando';
        front.erros = [];
        bloco = [];
      }
    }
    if (front.situacao === 'erro') {
      const erros = errosDoFront(bloco);
      if (erros.length) front.erros = erros;
    }
  });
}

/** Quando um arquivo do back-end muda, espera o piloto parar de salvar e reinicia o servidor. */
function acompanharJava() {
  let espera = null;
  watch(join(BACK, 'src', 'main'), { recursive: true }, (_evento, arquivo) => {
    if (!arquivo || !/\.(java|json|properties)$/.test(arquivo)) return;
    clearTimeout(espera);
    espera = setTimeout(() => {
      console.log(`Mudou ${arquivo}: reiniciando o back-end…`);
      ligarBack();
    }, 1500);
  });
}

// ------------------------------------------------------------------ o painel do repórter

function enderecosDaRede() {
  return Object.values(networkInterfaces()).flat()
    .filter((rede) => rede && rede.family === 'IPv4' && !rede.internal)
    .map((rede) => rede.address);
}

const PAINEL = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Painel do repórter</title>
<style>
  :root { --papel: #fff8ec; --tinta: #2b2118; --suave: #6b5b4d; --linha: #ead9bd; --ok: #1f7a45; --erro: #b3261e; --aviso: #9a6400; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; background: var(--papel); color: var(--tinta); }
  header { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; padding: 12px 16px; border-bottom: 2px solid var(--linha); }
  h1 { font-size: 1.2rem; margin: 0 12px 0 0; }
  .situacao { padding: 4px 12px; border-radius: 999px; font-weight: 700; background: #fff; border: 2px solid var(--linha); }
  .rodando { color: var(--ok); border-color: var(--ok); }
  .compilando { color: var(--aviso); border-color: var(--aviso); }
  .erro { color: #fff; background: var(--erro); border-color: var(--erro); }
  main { display: grid; grid-template-columns: minmax(0, 3fr) minmax(320px, 2fr); height: calc(100vh - 60px); }
  iframe { width: 100%; height: 100%; border: 0; border-right: 2px solid var(--linha); background: #fff; }
  aside { overflow: auto; padding: 16px; display: grid; gap: 16px; align-content: start; }
  .erros { border: 3px solid var(--erro); border-radius: 12px; padding: 12px 16px; background: #fff; }
  .erros h2 { margin: 0 0 8px; color: var(--erro); font-size: 1.1rem; }
  .erros li { font-family: ui-monospace, monospace; margin: 6px 0; font-size: 1rem; }
  .tudo-certo { color: var(--ok); font-weight: 700; }
  details pre { white-space: pre-wrap; font-size: .75rem; max-height: 320px; overflow: auto; background: #fff; padding: 8px; border-radius: 8px; }
  .dica { color: var(--suave); margin: 0; }
  @media (max-width: 800px) { main { grid-template-columns: 1fr; height: auto; } iframe { height: 70vh; } }
</style>
</head>
<body>
<header>
  <h1>📣 Painel do repórter</h1>
  <span>Back-end: <span id="back" class="situacao">…</span></span>
  <span>Front-end: <span id="front" class="situacao">…</span></span>
</header>
<main>
  <iframe id="barraca" title="A barraca rodando"></iframe>
  <aside>
    <div id="erros"></div>
    <p class="dica">Leia os erros em voz alta para a equipe: o arquivo, a linha e a mensagem.
      Quando o piloto salva um arquivo Java, o back-end reinicia sozinho (leva uns 20 segundos).</p>
    <details><summary>Registro completo do back-end</summary><pre id="registro-back"></pre></details>
    <details><summary>Registro completo do front-end</summary><pre id="registro-front"></pre></details>
  </aside>
</main>
<script>
  const NOMES = { rodando: 'rodando', compilando: 'compilando…', erro: 'com erro', parado: 'parado' };
  document.getElementById('barraca').src = '/';
  function escrever(id, situacao) {
    const el = document.getElementById(id);
    el.textContent = NOMES[situacao] || situacao;
    el.className = 'situacao ' + situacao;
  }
  async function atualizar() {
    try {
      const estado = await (await fetch('/painel/estado')).json();
      escrever('back', estado.back.situacao);
      escrever('front', estado.front.situacao);
      const erros = [...estado.front.erros.map((e) => 'Front: ' + e), ...estado.back.erros.map((e) => 'Back: ' + e)];
      const caixa = document.getElementById('erros');
      caixa.replaceChildren();
      if (erros.length) {
        caixa.className = 'erros';
        const titulo = document.createElement('h2');
        titulo.textContent = 'Erros para avisar a equipe';
        const lista = document.createElement('ul');
        for (const erro of erros) {
          const item = document.createElement('li');
          item.textContent = erro;
          lista.append(item);
        }
        caixa.append(titulo, lista);
      } else {
        caixa.className = 'tudo-certo';
        caixa.textContent = '✅ Nenhum erro agora.';
      }
      document.getElementById('registro-back').textContent = estado.back.linhas.join('\\n');
      document.getElementById('registro-front').textContent = estado.front.linhas.join('\\n');
    } catch {
      escrever('back', 'parado');
      escrever('front', 'parado');
    }
  }
  atualizar();
  setInterval(atualizar, 1500);
</script>
</body>
</html>`;

/**
 * Uma porta só para o repórter: /painel é o painel; todo o resto é repassado ao front-end do piloto.
 * Assim a barraca aparece no painel como parte da mesma página, em qualquer navegador.
 */
function abrirPainel() {
  const resumo = (p) => ({ situacao: p.situacao, erros: p.erros, linhas: p.linhas.slice(-120) });
  const servidor = createServer((pedido, resposta) => {
    if (pedido.url === '/painel/estado') {
      resposta.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      resposta.end(JSON.stringify({ back: resumo(back), front: resumo(front) }));
      return;
    }
    if (pedido.url === '/painel' || pedido.url === '/painel/') {
      resposta.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      resposta.end(PAINEL);
      return;
    }
    const repasse = httpRequest(
      { host: 'localhost', port: PORTA_DO_FRONT, path: pedido.url, method: pedido.method,
        headers: { ...pedido.headers, host: `localhost:${PORTA_DO_FRONT}` } },
      (respostaDoFront) => {
        resposta.writeHead(respostaDoFront.statusCode ?? 502, respostaDoFront.headers);
        respostaDoFront.pipe(resposta);
      },
    );
    repasse.on('error', () => {
      resposta.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
      resposta.end('<p style="font-family:sans-serif">O front-end do piloto ainda está subindo… Esta página tenta de novo sozinha.</p>'
        + '<script>setTimeout(() => location.reload(), 3000)</script>');
    });
    pedido.pipe(repasse);
  });
  // A atualização automática do Angular usa WebSocket: repassa a conexão inteira.
  servidor.on('upgrade', (pedido, socket, inicio) => {
    const destino = connect({ port: PORTA_DO_FRONT, host: 'localhost', autoSelectFamily: true }, () => {
      const cabecalhos = Object.entries({ ...pedido.headers, host: `localhost:${PORTA_DO_FRONT}` })
        .map(([nome, valor]) => `${nome}: ${valor}`).join('\r\n');
      destino.write(`${pedido.method} ${pedido.url} HTTP/1.1\r\n${cabecalhos}\r\n\r\n`);
      if (inicio?.length) destino.write(inicio);
      destino.pipe(socket);
      socket.pipe(destino);
    });
    destino.on('error', () => socket.destroy());
    socket.on('error', () => destino.destroy());
  });
  servidor.listen(PORTA_DO_PAINEL, '0.0.0.0');
}

function main() {
  ligarBack();
  ligarFront();
  acompanharJava();
  abrirPainel();
  const enderecos = enderecosDaRede();
  console.log('');
  console.log('==============================================================');
  console.log(' REPÓRTER, abra no SEU computador:');
  for (const ip of enderecos) console.log(`   http://${ip}:${PORTA_DO_PAINEL}/painel`);
  if (!enderecos.length) console.log(`   http://localhost:${PORTA_DO_PAINEL}/painel  (sem rede: só neste computador)`);
  console.log(' Piloto: pode minimizar esta janela e ficar só no editor.');
  console.log(' Para encerrar: Ctrl+C.');
  console.log('==============================================================');
  console.log('');
  const sair = () => {
    encerrar(back);
    encerrar(front);
    process.exit(0);
  };
  process.on('SIGINT', sair);
  process.on('SIGTERM', sair);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
