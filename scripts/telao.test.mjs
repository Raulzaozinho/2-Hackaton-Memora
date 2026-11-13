import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { receber, publicarFront, verificarPortaLivre, motivoDaFalhaAoSubir } from './telao.mjs';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';

function repositorio(t) {
  const pasta = mkdtempSync(join(tmpdir(), 'feira-teste-'));
  t.after(() => rmSync(pasta, { recursive: true, force: true }));
  const git = (...args) => {
    const r = spawnSync('git', args, { cwd: pasta, encoding: 'utf8' });
    return { ok: r.status === 0, saida: (r.stdout ?? '') + (r.stderr ?? '') };
  };
  function gravar(arquivo, texto) {
    mkdirSync(join(pasta, arquivo, '..'), { recursive: true });
    writeFileSync(join(pasta, arquivo), texto);
  }
  function commit() {
    assert.ok(git('add', '.').ok);
    assert.ok(git('commit', '-qm', 'entrega de teste').ok);
  }
  assert.ok(git('init', '-b', 'main').ok);
  git('config', 'user.name', 'Teste local');
  git('config', 'user.email', 'teste@example.invalid');
  gravar('frontend/src/app/barracas/equipe-1/pagina.txt', 'original');
  gravar('backend/src/main/java/br/com/memora/feira/barracas/equipe1/controlador.txt', 'original');
  gravar('README.md', 'plataforma');
  commit();
  git('checkout', '-b', 'equipe-1');
  function enviar() {
    commit();
    git('update-ref', 'refs/remotes/origin/equipe-1', 'HEAD');
    git('checkout', 'main');
  }
  return { pasta, git, gravar, commit, enviar };
}

const ok = () => ({ ok: true, saida: '' });
const pagina = 'frontend/src/app/barracas/equipe-1/pagina.txt';

test('aceita a pasta da equipe e só então permite publicar o front', (t) => {
  const repo = repositorio(t);
  repo.gravar(pagina, 'novo');
  repo.enviar();
  let compilacoes = 0;
  const r = receber('equipe-1', repo.git, () => { compilacoes++; return ok(); }, ok);
  assert.equal(r.aceito, true);
  assert.equal(r.mudouFront, true);
  assert.equal(r.mudouBack, false);
  assert.equal(compilacoes, 1);
  assert.equal(readFileSync(join(repo.pasta, pagina), 'utf8'), 'novo');
});

test('recusa alterações fora da pasta antes de compilar', (t) => {
  const repo = repositorio(t);
  repo.gravar('README.md', 'alterado pela equipe');
  repo.enviar();
  const r = receber('equipe-1', repo.git, () => assert.fail('não deve compilar'), ok);
  assert.equal(r.aceito, false);
  assert.match(r.motivo, /fora da pasta/);
  assert.equal(readFileSync(join(repo.pasta, 'README.md'), 'utf8'), 'plataforma');
});

test('recusa renomear um arquivo da plataforma para a pasta da equipe', (t) => {
  const repo = repositorio(t);
  repo.git('mv', 'README.md', 'frontend/src/app/barracas/equipe-1/README.md');
  repo.enviar();
  assert.equal(receber('equipe-1', repo.git, ok, ok).aceito, false);
});

test('restaura o código se o back falhar depois de o front compilar', (t) => {
  const repo = repositorio(t);
  repo.gravar(pagina, 'front candidato');
  repo.gravar('backend/src/main/java/br/com/memora/feira/barracas/equipe1/controlador.txt', 'java inválido');
  repo.enviar();
  const antes = repo.git('rev-parse', 'HEAD').saida;
  const r = receber('equipe-1', repo.git, ok,
    () => ({ ok: false, saida: '[ERROR] Equipe1Controller.java:[23,17] erro de compilação' }));
  assert.equal(r.aceito, false);
  assert.match(r.motivo, /linha 23/);
  assert.equal(repo.git('rev-parse', 'HEAD').saida, antes);
  assert.equal(readFileSync(join(repo.pasta, pagina), 'utf8'), 'original');
});

test('aborta conflito sem deixar merge pendente', (t) => {
  const repo = repositorio(t);
  repo.gravar(pagina, 'entrega');
  repo.enviar();
  repo.gravar(pagina, 'outra alteração');
  repo.commit();
  const r = receber('equipe-1', repo.git, ok, ok);
  assert.equal(r.aceito, false);
  assert.match(r.motivo, /conflito/);
  assert.equal(repo.git('status', '--porcelain').saida, '');
});

test('erro ao comparar o Git nunca é tratado como entrega aceita', () => {
  const r = receber('equipe-1', () => ({ ok: false, saida: 'fatal: revisão desconhecida' }), ok, ok);
  assert.equal(r.aceito, false);
});

test('publicação mantém bundles antigos e rejeita candidato incompleto', (t) => {
  const pasta = mkdtempSync(join(tmpdir(), 'feira-publicacao-'));
  t.after(() => rmSync(pasta, { recursive: true, force: true }));
  const origem = join(pasta, 'candidato');
  const destino = join(pasta, 'no-ar');
  mkdirSync(origem);
  mkdirSync(destino);
  writeFileSync(join(destino, 'index.html'), 'anterior');
  writeFileSync(join(destino, 'main-antigo.js'), 'antigo');
  assert.throws(() => publicarFront(origem, destino), /index.html/);
  assert.equal(readFileSync(join(destino, 'index.html'), 'utf8'), 'anterior');
  writeFileSync(join(origem, 'index.html'), 'novo');
  writeFileSync(join(origem, 'main-novo.js'), 'novo');
  publicarFront(origem, destino);
  assert.equal(readFileSync(join(destino, 'index.html'), 'utf8'), 'novo');
  assert.equal(readFileSync(join(destino, 'main-antigo.js'), 'utf8'), 'antigo');
  assert.equal(readFileSync(join(destino, 'main-novo.js'), 'utf8'), 'novo');
});

test('não confunde outro servidor na mesma porta com a feira recém-iniciada', async (t) => {
  const servidor = createServer();
  await new Promise(resolve => servidor.listen(0, resolve));
  t.after(() => new Promise(resolve => servidor.close(resolve)));
  await assert.rejects(verificarPortaLivre(servidor.address().port), /ocupada/);
});

test('explica por que um back-end que compilou não conseguiu subir', () => {
  const doisMetodos = `
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'requestMappingHandlerMapping'
Caused by: java.lang.IllegalStateException: Ambiguous mapping. Cannot map 'equipe2Controller' method
br.com.memora.feira.barracas.equipe2.Equipe2Controller#itensDeNovo()
to {GET [/api/barracas/equipe-2/itens]}: There is already 'equipe2Controller' bean method`;
  assert.match(motivoDaFalhaAoSubir(doisMetodos), /dois métodos respondem em GET \/api\/barracas\/equipe-2\/itens/);
  assert.match(motivoDaFalhaAoSubir('Web server failed to start. Port 8080 was already in use.'), /porta/);
  assert.equal(
    motivoDaFalhaAoSubir('Caused by: java.lang.Erro: primeiro\nCaused by: java.lang.NullPointerException: lista vazia'),
    'lista vazia',
  );
  assert.equal(motivoDaFalhaAoSubir('nada reconhecível'), '');
});

test('não permite usar dados de demonstração no banco oficial', () => {
  const r = spawnSync(process.execPath, [fileURLToPath(new URL('./telao.mjs', import.meta.url)), '--demo', '--supabase'],
    { encoding: 'utf8' });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /Não combine os bancos/);
});
