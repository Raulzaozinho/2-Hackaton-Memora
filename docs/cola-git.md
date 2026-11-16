# Cola de Git

No dia, a equipe trabalha num ramo próprio (`equipe-1`, `equipe-2` ou `equipe-3`). Troque o `N` pelo número da sua equipe.

## Uma vez só, no começo do dia (todos da equipe)

Troque o `N` pelo número da sua equipe. A página da feira mostra o comando certo.

```bash
git fetch
git switch equipe-N
```

## No começo de cada missão (quem vai pilotar)

Pega o que a equipe fez no ciclo anterior:

```bash
git pull
```

## Durante a missão: entregar (cedo e várias vezes)

```bash
git add .
git commit -m "ciclo 1: nome e cores da barraca"
git push
```

A mensagem do commit aparece no telão, com o seu nome. Escreva o que mudou, em uma frase curta.

Em até um minuto o telão responde:

- **✅ Entrou na feira:** a barraca nova já está no ar.
- **⛔ Não entrou:** o telão mostra o motivo. Corrija, faça um commit novo e dê `git push` de novo. Enquanto isso a feira continua mostrando a última versão que funcionou.

## Os quatro motivos para não entrar

| Motivo no telão | O que significa | Como resolver |
|---|---|---|
| mexeu fora da pasta da equipe | Algum arquivo de outra pasta foi alterado | `git restore CAMINHO_DO_ARQUIVO`, depois commit e push |
| não compilou | Tem erro no código | O telão diz o arquivo e a linha. O erro completo está no terminal do `npm start` ou do back-end |
| compilou, mas não iniciou | O back-end não conseguiu subir | O mais comum: dois métodos com o mesmo endereço no `@GetMapping`. Troque o endereço de um deles |
| não juntou com o resto | Conflito de merge | Chame o organizador |

## Para olhar sem medo

```bash
git status        # o que mudou desde o último commit
git diff          # as linhas que mudaram
git log --oneline # os commits já feitos
```

## Errei, e agora?

| Situação | Comando |
|---|---|
| Quero desfazer as mudanças de um arquivo que ainda não commitei | `git restore CAMINHO_DO_ARQUIVO` |
| O `git pull` reclamou de mudanças locais | Faça commit das suas mudanças primeiro, depois `git pull` |
| O `git push` foi recusado | Alguém da equipe enviou antes: `git pull`, depois `git push` |
