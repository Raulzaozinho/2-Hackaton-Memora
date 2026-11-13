# Preparação — para a organização

O que fazer antes do dia, na ordem. O dia em si está no [roteiro](roteiro-do-dia.md).

## Uma semana antes

**1. Repositório.** O projeto está em <https://github.com/Raulzaozinho/2-Hackaton-Memora>, com o `main` e os ramos `equipe-1`, `equipe-2` e `equipe-3` já criados. Peça o usuário do GitHub de cada participante e adicione os nove como colaboradores em **Settings → Collaborators → Add people**. Sem o convite aceito, ninguém consegue enviar o crachá nem as entregas do dia.

**2. Missão Zero.** Envie aos participantes o endereço do repositório e o link de [docs/missao-zero.md](../missao-zero.md). Cada um abre um PR com o próprio crachá. Aprove e junte os nove PRs ao `main`.

Quem não conseguir abrir o PR sozinho é exatamente quem precisa de ajuda **antes** do dia: sente junto por 15 minutos.

**3. Banco no Supabase.** Crie um projeto gratuito no Supabase. Em **Connect**, escolha **Session pooler** e anote host, usuário e senha. Na máquina do telão, copie `backend/.env.example` para `backend/.env` e preencha:

```
SUPABASE_DB_URL=jdbc:postgresql://HOST_DO_POOLER:5432/postgres
SUPABASE_DB_USER=postgres.CODIGO_DO_PROJETO
SUPABASE_DB_PASSWORD=a senha do banco
FEIRA_PIN=um PIN só da organização
```

As tabelas são criadas sozinhas na primeira vez que o back-end sobe. O arquivo `.env` nunca vai para o Git.

Só a máquina do telão usa o Supabase. Os participantes rodam com um banco local em arquivo, sem configurar nada.

## Dois dias antes: ensaio

Na máquina que vai ligar no telão:

```bash
cd frontend
npm ci
cd ..
node scripts/telao.mjs --demo
```

O `--demo` cria nove participantes inventados, já em equipes. Abra:

- `http://localhost:8080/#/telao` na TV, em tela cheia (F11);
- `http://localhost:8080/#/organizacao` no seu notebook (PIN padrão: `feira`).

O modo demo ignora os crachás reais do projeto. Não combine `--demo` e `--supabase`:
o ensaio deve ficar separado do banco oficial.

Passe por todas as etapas com **Próxima etapa**, dê algumas fichas pelo celular e revele o resultado. No fim, clique em **Recomeçar o dia**.

**Teste o celular.** O telão mostra um endereço como `http://192.168.0.10:8080`. Abra-o num celular conectado ao mesmo Wi-Fi. Algumas redes de empresa bloqueiam um aparelho de falar com outro; se não abrir, o plano B é os participantes visitarem a feira pelo navegador do notebook, ou todos entrarem no roteador de um celular.

## Na véspera

**1. Ramos das equipes.** Os três ramos já existem, mas foram criados antes dos crachás. Com todos os crachás no `main`, atualize-os:

```bash
git switch main
git pull
git push origin main:equipe-1 main:equipe-2 main:equipe-3
```

**2. Clone do telão.** O telão precisa de uma pasta só dele, sem alterações locais:

```bash
git clone https://github.com/Raulzaozinho/2-Hackaton-Memora.git feira-telao
cd feira-telao/frontend
npm install
```

Copie o `backend/.env` para dentro desse clone.

**3. Imprima** os quatro cartões de rodada (um jogo por equipe) e a cola de Git. Separe três copos vermelhos.

## No dia, 20 minutos antes

No clone do telão:

```bash
node scripts/telao.mjs --supabase --acompanhar
```

Com `--acompanhar`, o script busca os ramos das equipes a cada 15 segundos. Quando uma equipe faz push, ele confere se ela só mexeu na própria pasta e se tudo compila. Se sim, a barraca nova entra na feira e o telão mostra a mensagem do commit; se não, a feira fica como estava e o telão mostra o motivo.

A compilação ocorre em uma pasta separada. O front só é publicado depois das conferências;
os arquivos da versão anterior continuam disponíveis para as páginas já abertas.
Se um back-end compilar mas falhar ao iniciar, o script tenta restaurar o jar anterior e registra a recusa.
Mudanças de back-end causam uma breve interrupção enquanto o Java reinicia.

No painel da organização:

1. **Equipes:** monte as três equipes pelo seletor de cada pessoa, ou use **Sortear equipes**. A ordem em que as pessoas entram na equipe define o rodízio.
2. Deixe na etapa **Abertura**, com o relógio parado.

## O que cada tela faz

| Tela | Para quê |
|---|---|
| Telão | Etapa, relógio, quem pilota em cada equipe e a última entrega de cada uma |
| Organização | Avançar etapas, +1 minuto, equipes, ver as fichas antes de todos, revelar o resultado |
| Feira (celular) | Cada pessoa escolhe quem é, visita as barracas e dá fichas |

## Se algo der errado no dia

| Problema | O que fazer |
|---|---|
| O telão mostra "⛔ Não entrou" para uma equipe | É o funcionamento normal: a equipe corrige e dá push de novo. A feira não quebrou. |
| O script do telão parou | Rode o mesmo comando de novo. Os dados estão no Supabase; nada se perde. |
| Uma equipe travou no Git | Um mentor senta com ela. Em último caso, o mentor copia os arquivos da pasta da equipe e faz o push. |
| A rede caiu | As equipes continuam programando: cada máquina roda sozinha. As entregas entram quando a rede voltar. |
| Os celulares não abrem a feira | Plano B do ensaio: notebook ou roteador de celular. |

## Depois do dia

Se quiser guardar as barracas no `main`, abra um PR de cada ramo de equipe. É também um bom fechamento: cada equipe vê o próprio trabalho virar parte do projeto.
