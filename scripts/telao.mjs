#!/usr/bin/env node
// O TELÃO — a feira oficial, rodando na máquina da organização.
//
//   node scripts/telao.mjs               sobe a feira com o código desta pasta
//   node scripts/telao.mjs --demo        idem, com nove participantes inventados (para ensaiar)
//   node scripts/telao.mjs --supabase    usa o banco do Supabase (precisa do backend/.env)
//   node scripts/telao.mjs --acompanhar  além de subir, recebe os pushes das equipes (dia do evento)
//
// Com --acompanhar, a cada 15 segundos o script busca os ramos main, equipe-1, equipe-2 e equipe-3
// no GitHub. Quando uma equipe faz push, ele confere três coisas antes de aceitar:
//   1. a equipe só mexeu na própria pasta;
//   2. o código junta com o resto sem conflito;
//   3. o front e o back-end compilam.
// Se passar, a barraca nova entra na feira e o telão mostra a mensagem do commit.
// Se não passar, nada muda na feira e o telão mostra o motivo para a equipe corrigir.

import { spawn, spawnSync } from 'node:child_process';
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:net';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const FRONT = join(RAIZ, 'frontend');
const BACK = join(RAIZ, 'backend');
const WINDOWS = process.platform === 'win32';
const OPCOES = new Set(process.argv.slice(2));
const ACOMPANHAR = OPCOES.has('--acompanhar');
const EQUIPES = ['equipe-1', 'equipe-2', 'equipe-3'];
const INTERVALO_MS = 15_000;
const PORTA = Number(process.env.FEIRA_PORT ?? 8080);
const URL_LOCAL = `http://localhost:${PORTA}`;
// O servidor roda de uma cópia do jar. Assim uma compilação nova (ou que falhou) nunca mexe no que está no ar.
const JAR_COMPILADO = join(BACK, 'target', 'feira.jar');
const JAR_NO_AR = join(BACK, 'dados', 'telao', 'feira.jar');
const JAR_ANTERIOR = join(BACK, 'dados', 'telao', 'feira-anterior.jar');
const FRONT_COMPILADO = join(FRONT, 'dist', 'candidato', 'browser');
const FRONT_NO_AR = join(BACK, 'dados', 'telao', 'frontend');

let servidor = null;
/** Por que a última tentativa de subir o servidor falhou, quando deu para descobrir. */
let ultimaFalhaAoSubir = '';
const ultimoVisto = new Map();

// ------------------------------------------------------------------ utilidades

function avisar(texto) {
  console.log(`[${new Date().toLocaleTimeString('pt-BR')}] ${texto}`);
}

function rodar(comando, argumentos, pasta) {
  // No Windows, os comandos .cmd (npm, mvnw) só rodam por meio do shell.
  const viaShell = WINDOWS && /\.cmd$/.test(comando);
  const linha = viaShell ? [comando, ...argumentos].join(' ') : comando;
  const resultado = spawnSync(linha, viaShell ? [] : argumentos, { cwd: pasta, encoding: 'utf8', shell: viaShell });
  return {
    ok: resultado.status === 0,
    saida: `${resultado.stdout ?? ''}${resultado.stderr ?? ''}${resultado.error ? resultado.error.message : ''}`,
  };
}

function git(...argumentos) {
  return rodar('git', argumentos, RAIZ);
}

function pin() {
  if (process.env.FEIRA_PIN) {
    return process.env.FEIRA_PIN;
  }
  const env = join(BACK, '.env');
  if (existsSync(env)) {
    const linha = readFileSync(env, 'utf8').split(/\r?\n/).find((l) => l.startsWith('FEIRA_PIN='));
    const valor = linha?.slice('FEIRA_PIN='.length).trim();
    if (valor) {
      return valor;
    }
  }
  return 'feira';
}

/** Uma frase curta com o erro de compilação, para caber no telão: em que arquivo e linha, e o que foi. */
function resumirErro(saida) {
  const linhas = saida.split(/\r?\n/).map((linha) => linha.replace(/\u001b\[[0-9;]*m/g, '').trim());

  // Java (Maven):  [ERROR] /C:/.../Equipe1Controller.java:[23,17] ';' expected
  for (const linha of linhas) {
    const java = /([\w.-]+\.java):\[(\d+),\d+\]\s*(.*)$/.exec(linha);
    if (java) {
      return `${java[1]}, linha ${java[2]}: ${java[3]}`.slice(0, 300);
    }
  }

  // Angular:  X [ERROR] mensagem [plugin angular-compiler]   e, logo abaixo,   src/app/.../arquivo.html:8:21:
  const indice = linhas.findIndex((linha) => /\[ERROR\]\s*\S/.test(linha));
  if (indice >= 0) {
    const mensagem = linhas[indice].replace(/^.*\[ERROR\]\s*/, '').replace(/\s*\[plugin [^\]]*\]\s*$/, '');
    const onde = linhas
      .slice(indice + 1, indice + 8)
      .map((linha) => /([\w.-]+\.(?:ts|html|css)):(\d+):\d+:/.exec(linha))
      .find(Boolean);
    return (onde ? `${onde[1]}, linha ${onde[2]}: ${mensagem}` : mensagem).slice(0, 300);
  }
  return 'veja o erro no terminal da equipe';
}

// ------------------------------------------------------------------ compilar e servir

function compilarFront() {
  avisar('Compilando o front-end…');
  return rodar(WINDOWS ? 'npm.cmd' : 'npm', ['run', 'build', '--', '--output-path', 'dist/candidato'], FRONT);
}

/** Só publica depois de todas as compilações passarem. O index muda por último.
 * Os bundles anteriores ficam disponíveis para os navegadores que ainda não recarregaram. */
export function publicarFront(origem = FRONT_COMPILADO, destino = FRONT_NO_AR) {
  if (!existsSync(join(origem, 'index.html'))) throw new Error('A compilação não produziu index.html.');
  mkdirSync(destino, { recursive: true });
  for (const arquivo of readdirSync(origem)) {
    if (arquivo !== 'index.html') cpSync(join(origem, arquivo), join(destino, arquivo), { recursive: true });
  }
  copyFileSync(join(origem, 'index.html'), join(destino, 'index.novo.html'));
  renameSync(join(destino, 'index.novo.html'), join(destino, 'index.html'));
}

function compilarBack() {
  avisar('Compilando o back-end…');
  return rodar(WINDOWS ? '.\\mvnw.cmd' : './mvnw', ['-q', '-B', '-DskipTests', 'package'], BACK);
}

async function subirServidor(jar = JAR_COMPILADO) {
  await derrubarServidor();
  mkdirSync(dirname(JAR_NO_AR), { recursive: true });
  copyFileSync(jar, JAR_NO_AR);

  const perfis = ['telao', ...(OPCOES.has('--demo') ? ['demo'] : []), ...(OPCOES.has('--supabase') ? ['supabase'] : [])];
  const java = process.env.JAVA_HOME ? join(process.env.JAVA_HOME, 'bin', 'java') : 'java';
  servidor = spawn(java, ['-jar', JAR_NO_AR, `--spring.profiles.active=${perfis.join(',')}`, `--server.port=${PORTA}`], {
    cwd: BACK,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  // Enquanto o servidor sobe, o que ele escreve fica guardado: só aparece se a subida falhar.
  // Depois de pronto, tudo vai direto para o terminal (é onde aparecem os erros durante o dia).
  let pronto = false;
  let registroDaSubida = '';
  for (const [saida, destino] of [[servidor.stdout, process.stdout], [servidor.stderr, process.stderr]]) {
    saida.setEncoding('utf8');
    saida.on('data', (texto) => {
      if (pronto) {
        destino.write(texto);
      } else {
        registroDaSubida = (registroDaSubida + texto).slice(-200_000);
      }
    });
  }
  let falhou = false;
  servidor.on('error', (erro) => {
    falhou = true;
    avisar(`Não consegui iniciar o Java: ${erro.message}`);
  });
  ultimaFalhaAoSubir = '';

  for (let tentativa = 0; tentativa < 90; tentativa++) {
    await esperar(1000);
    if (falhou || servidor.exitCode !== null) {
      process.stderr.write(registroDaSubida);
      ultimaFalhaAoSubir = motivoDaFalhaAoSubir(registroDaSubida);
      avisar('O Java encerrou antes de a feira ficar pronta.');
      return false;
    }
    try {
      const resposta = await fetch(`${URL_LOCAL}/api/feira/estado`);
      if (resposta.ok) {
        pronto = true;
        const estado = await resposta.json();
        avisar(`Feira no ar. Telão: ${URL_LOCAL}/#/telao`);
        avisar(`Organização: ${URL_LOCAL}/#/organizacao`);
        if (estado.endereco) {
          avisar(`Celulares (mesma rede): ${estado.endereco}`);
        }
        return true;
      }
    } catch {
      // Ainda subindo.
    }
  }
  process.stderr.write(registroDaSubida);
  avisar('O back-end não respondeu em 90 segundos. Veja as mensagens acima.');
  return false;
}

/**
 * Lê o que o Spring escreveu ao falhar na subida e devolve uma frase curta para o telão.
 * O caso mais comum com iniciantes é copiar um método e esquecer de trocar o endereço dele.
 */
export function motivoDaFalhaAoSubir(registro) {
  const texto = registro.replace(/\u001b\[[0-9;]*m/g, '');
  if (/Ambiguous mapping/.test(texto)) {
    const endereco = /to \{(\w+) \[([^\]]+)\]/.exec(texto);
    return endereco
      ? `dois métodos respondem em ${endereco[1]} ${endereco[2]}: cada endereço só pode ter um`
      : 'dois métodos respondem no mesmo endereço: cada endereço só pode ter um';
  }
  if (/already in use/i.test(texto)) {
    return 'a porta do servidor está ocupada';
  }
  const causas = [...texto.matchAll(/Caused by: [\w.$]+: (.+)/g)];
  return causas.length ? causas[causas.length - 1][1].trim().slice(0, 200) : '';
}

function derrubarServidor() {
  return new Promise((resolver) => {
    if (!servidor || !servidor.pid || servidor.exitCode !== null) {
      servidor = null;
      resolver();
      return;
    }
    servidor.once('exit', () => {
      servidor = null;
      resolver();
    });
    servidor.kill();
  });
}

function esperar(ms) {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

async function registrarEntrega(equipe, ok, mensagem, autor) {
  try {
    const resposta = await fetch(`${URL_LOCAL}/api/organizacao/entregas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Pin': pin() },
      body: JSON.stringify({ equipe, ok, mensagem, autor }),
    });
    if (!resposta.ok) avisar(`O telão recusou o registro da entrega (HTTP ${resposta.status}). Confira FEIRA_PIN.`);
  } catch {
    avisar('Não consegui avisar o telão sobre a entrega (o back-end está fora do ar?).');
  }
}

// ------------------------------------------------------------------ receber os pushes

function pastasDaEquipe(equipe) {
  const numero = equipe.split('-')[1];
  return [
    `frontend/src/app/barracas/equipe-${numero}/`,
    `backend/src/main/java/br/com/memora/feira/barracas/equipe${numero}/`,
  ];
}

/** Tenta juntar o push novo de um ramo. Devolve se foi aceito e, se não, o motivo. */
export function receber(ramo, executarGit = git, front = compilarFront, back = compilarBack) {
  const git = executarGit;
  const head = git('rev-parse', 'HEAD');
  const diff = git('diff', '--name-only', '--no-renames', `HEAD...origin/${ramo}`);
  if (!head.ok || !diff.ok) return { aceito: false, motivo: 'não foi possível comparar o ramo com a feira' };
  const antes = head.saida.trim();
  const arquivos = diff.saida.split(/\r?\n/).filter(Boolean);
  if (arquivos.length === 0) {
    return { aceito: true, semMudanca: true };
  }

  if (EQUIPES.includes(ramo)) {
    const permitidas = pastasDaEquipe(ramo);
    const deFora = arquivos.find((arquivo) => !permitidas.some((pasta) => arquivo.startsWith(pasta)));
    if (deFora) {
      return { aceito: false, motivo: `mexeu fora da pasta da equipe: ${deFora}` };
    }
  }

  if (!git('merge', '--no-edit', `origin/${ramo}`).ok) {
    git('merge', '--abort');
    return { aceito: false, motivo: 'o código não juntou com o resto (conflito de merge)' };
  }

  const mudouFront = arquivos.some((arquivo) => arquivo.startsWith('frontend/'));
  const mudouBack = arquivos.some((arquivo) => arquivo.startsWith('backend/'));
  const etapas = [
    [mudouFront, front, 'front-end'],
    [mudouBack, back, 'back-end'],
  ];
  for (const [mudou, compilar, nome] of etapas) {
    if (!mudou) {
      continue;
    }
    const resultado = compilar();
    if (!resultado.ok) {
      if (!git('reset', '--hard', antes).ok) throw new Error('Não consegui restaurar o código após a compilação recusada.');
      return { aceito: false, motivo: `o ${nome} não compilou (${resumirErro(resultado.saida)})` };
    }
  }
  return { aceito: true, mudouFront, mudouBack, antes };
}

async function conferirRamos() {
  if (!git('fetch', '--quiet', 'origin').ok) {
    avisar('Sem acesso ao GitHub agora; tento de novo em instantes.');
    return;
  }
  for (const ramo of ['main', ...EQUIPES]) {
    const remoto = git('rev-parse', '--verify', '--quiet', `origin/${ramo}`).saida.trim();
    if (!remoto || ultimoVisto.get(ramo) === remoto) {
      continue;
    }
    ultimoVisto.set(ramo, remoto);
    const [mensagem, autor] = git('log', '-1', '--format=%s%x09%an', `origin/${ramo}`).saida.trim().split('\t');
    const resultado = receber(ramo);
    if (resultado.semMudanca) {
      continue;
    }
    if (resultado.aceito) {
      if (resultado.mudouBack) {
        copyFileSync(JAR_NO_AR, JAR_ANTERIOR);
        if (!(await subirServidor())) {
          const motivo = `o back-end compilou, mas não iniciou${ultimaFalhaAoSubir ? ` (${ultimaFalhaAoSubir})` : ''}`;
          if (!git('reset', '--hard', resultado.antes).ok) throw new Error('Não consegui restaurar o código anterior.');
          if (!(await subirServidor(JAR_ANTERIOR))) throw new Error('O servidor anterior também não iniciou. Veja as mensagens acima.');
          avisar(`✖ ${ramo}: ${motivo}; a versão anterior foi restaurada.`);
          if (EQUIPES.includes(ramo)) await registrarEntrega(ramo, false, motivo, autor);
          continue;
        }
      }
      if (resultado.mudouFront) publicarFront();
      avisar(`✔ ${ramo}: "${mensagem}" (${autor}) entrou na feira.`);
      if (EQUIPES.includes(ramo)) {
        await registrarEntrega(ramo, true, mensagem, autor);
      }
    } else {
      avisar(`✖ ${ramo}: ${resultado.motivo}`);
      if (EQUIPES.includes(ramo)) {
        await registrarEntrega(ramo, false, resultado.motivo, autor);
      }
    }
  }
}

// ------------------------------------------------------------------ início

export function verificarPortaLivre(porta) {
  return new Promise((resolver, rejeitar) => {
    const teste = createServer();
    teste.once('error', () => rejeitar(new Error(`A porta ${porta} está ocupada ou indisponível. Encerre o outro servidor ou defina FEIRA_PORT.`)));
    teste.listen(porta, () => teste.close(resolver));
  });
}

async function iniciar() {
  if (!Number.isInteger(PORTA) || PORTA < 1 || PORTA > 65535) throw new Error('FEIRA_PORT deve ser um número entre 1 e 65535.');
  if (OPCOES.has('--demo') && OPCOES.has('--supabase')) {
    throw new Error('Use --demo para ensaiar OU --supabase para o evento. Não combine os bancos.');
  }
  for (const opcao of OPCOES) {
    if (!['--demo', '--supabase', '--acompanhar'].includes(opcao)) throw new Error(`Opção desconhecida: ${opcao}`);
  }
  await verificarPortaLivre(PORTA);
  if (!existsSync(join(FRONT, 'node_modules', '@angular', 'cli'))) {
    throw new Error('Instale as dependências primeiro: cd frontend e npm ci.');
  }
  if (ACOMPANHAR) {
    const status = git('status', '--porcelain');
    if (!status.ok) throw new Error('Para acompanhar entregas, use um clone Git com o remoto origin.');
    if (status.saida.trim() !== '') {
      console.error('Esta pasta tem alterações não commitadas. Use um clone limpo só para o telão.');
      process.exit(1);
    }
    if (!git('fetch', '--quiet', 'origin').ok) {
      console.error('Não consegui buscar o repositório no GitHub (git fetch origin falhou).');
      process.exit(1);
    }
    // O telão trabalha num ramo próprio, que começa igual ao main e vai juntando as equipes.
    if (!git('checkout', '-B', 'telao', 'origin/main').ok) throw new Error('Não consegui preparar o ramo telao.');
    ultimoVisto.set('main', git('rev-parse', 'origin/main').saida.trim());
  }

  const front = compilarFront();
  if (!front.ok) {
    console.error(front.saida);
    process.exit(1);
  }
  const back = compilarBack();
  if (!back.ok) {
    console.error(back.saida);
    process.exit(1);
  }
  publicarFront();
  if (!(await subirServidor())) {
    throw new Error('Não foi possível iniciar o servidor.');
  }

  if (ACOMPANHAR) {
    avisar('Acompanhando os ramos main, equipe-1, equipe-2 e equipe-3. Ctrl+C para encerrar.');
    for (;;) {
      await conferirRamos();
      await esperar(INTERVALO_MS);
    }
  } else {
    avisar('Ctrl+C para encerrar.');
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const sinal of ['SIGINT', 'SIGTERM']) {
    process.on(sinal, async () => {
      await derrubarServidor();
      process.exit(0);
    });
  }
  iniciar().catch(async (erro) => {
    console.error(erro.message);
    await derrubarServidor();
    process.exitCode = 1;
  });
}
