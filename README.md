# 🎪 Feira Dev

O hackathon dos estagiários da Memora. Todas as equipes trabalham no mesmo aplicativo: uma feira que aparece ao vivo no telão. Cada equipe monta a sua **barraca**, uma página pequena dentro da feira, que ganha uma capacidade nova a cada rodada. No fim, a feira abre e todo mundo visita as barracas pelo celular.

São 3 horas, 3 equipes de 3 pessoas e 4 rodadas curtas.

## Por onde começar

| Você é… | Leia |
|---|---|
| Participante, antes do dia | [Missão Zero](docs/missao-zero.md) |
| Participante, no dia | [Os papéis](docs/papeis.md) · [Rodada 1](docs/rodadas/rodada-1.md) · [Rodada 2](docs/rodadas/rodada-2.md) · [Rodada 3](docs/rodadas/rodada-3.md) · [Rodada 4](docs/rodadas/rodada-4.md) · [Cola de Git](docs/cola-git.md) |
| Organização | [Preparação](docs/organizacao/preparacao.md) · [Roteiro do dia](docs/organizacao/roteiro-do-dia.md) |

## O que você precisa instalar

- **Git**
- **Node.js 24** (LTS)
- **Java (JDK) 21** ou mais novo
- Um editor: VS Code ou IntelliJ

## Como rodar na sua máquina

São dois programas, cada um no seu terminal.

**Terminal 1, o back-end** (Java + Spring Boot, porta 8080):

```bash
cd backend
./mvnw spring-boot:run
```

No PowerShell do Windows, use `.\mvnw.cmd spring-boot:run`. Está pronto quando aparecer `Started FeiraApplication`.

**Terminal 2, o front-end** (Angular, porta 4200):

```bash
cd frontend
npm install
npm start
```

Abra <http://localhost:4200>. O `npm install` só é necessário na primeira vez.

Na sua máquina o banco de dados é um arquivo em `backend/dados`, criado sozinho. Você não precisa instalar nem configurar banco nenhum.

## Ensaiar a feira completa

Depois de instalar Node.js e Java, rode na raiz deste projeto:

```bash
cd frontend
npm ci
cd ..
node scripts/telao.mjs --demo
```

Abra [a feira](http://localhost:8080), [o telão](http://localhost:8080/#/telao) e
[o painel da organização](http://localhost:8080/#/organizacao). O PIN padrão é `feira`.
O modo demo usa nove pessoas fictícias e um banco separado. As três barracas em montagem
são os exercícios dos participantes; a barraca modelo já funciona por completo.

Se a porta 8080 estiver ocupada, encerre o outro servidor ou defina `FEIRA_PORT` antes de iniciar
(PowerShell: `$env:FEIRA_PORT = '8081'`). O terminal informa os novos endereços.

## Como o projeto está organizado

```
frontend/src/app/
  barracas/
    modelo/        a Barraca do Pastel, completa, para consultar
    equipe-1/      a barraca da equipe 1   ← cada equipe só mexe na própria pasta
    equipe-2/
    equipe-3/
  plataforma/      a feira, o telão e o painel da organização (não precisa mexer)

backend/src/main/java/br/com/memora/feira/
  barracas/
    modelo/        o back-end da barraca modelo
    equipe1/       o back-end da barraca da equipe 1
    equipe2/
    equipe3/
  plataforma/      etapas, relógio, fichas e registros (não precisa mexer)

backend/src/main/resources/crachas/   um arquivo .json por participante
docs/                                 os cartões das rodadas e o guia da organização
scripts/telao.mjs                     sobe a feira oficial na máquina da organização
```

O caminho de um dado, do clique até o banco:

```
Navegador (Angular)  →  pedido HTTP  →  Back-end (Spring Boot)  →  Banco (Supabase)
     a barraca            /api/...          um Controller            uma tabela
```

No desenvolvimento e no ensaio, o banco é H2 local. O Supabase é usado no evento com `--supabase`.

## As páginas

| Endereço | O que é |
|---|---|
| `/#/` | O mapa da feira, com as barracas |
| `/#/barraca/equipe-1` | A barraca de uma equipe |
| `/#/barraca/modelo` | A barraca modelo |
| `/#/crachas` | O mural de crachás |
| `/#/telao` | A tela grande da sala |
| `/#/organizacao` | O painel de quem conduz o dia (pede um PIN) |

## Conferências

```bash
cd backend && ./mvnw test        # as regras da feira
cd frontend && npx ng test --watch=false   # a configuração das barracas
```

Na raiz, `node --test scripts/telao.test.mjs` confere a aceitação e a recusa de entregas.
Para gerar os artefatos, use `npm run build` no front-end e `./mvnw verify` no back-end
(`.\mvnw.cmd verify` no Windows).

Veja [a revisão e os testes realizados](docs/REVISAO-2026-11-13.md).
