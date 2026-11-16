# Missão Zero — prepare o seu computador

No hackathon cada um vai programar **no próprio notebook**, com Angular e Spring Boot. Para não perder tempo no dia, deixe o computador pronto antes. Leva uns **15 minutos**, quase tudo esperando download.

## 1. Mande o seu usuário do GitHub para o Raul

É o que deixa você enviar código para o projeto. Não tem conta? Crie em <https://github.com/signup>.

Quando chegar o convite (no e-mail da conta), aceite. Ou abra direto: <https://github.com/Raulzaozinho/2-Hackaton-Memora/invitations>.

## 2. Baixe o projeto e rode o preparar

Abra o **PowerShell** e cole, uma linha de cada vez:

```powershell
cd $HOME
git clone -c core.longpaths=true https://github.com/Raulzaozinho/2-Hackaton-Memora.git feira-dev
cd feira-dev
.\preparar.cmd
```

O `preparar` pergunta duas coisas:

- **o seu usuário do GitHub**;
- **o seu nome como vai aparecer no telão** (por exemplo, `Bruno`).

Depois ele faz o resto sozinho:

- Se o seu Node ou o seu Java forem antigos para o projeto, ele baixa um **Node 24** e um **Java 21** numa pasta separada (`feira-ferramentas`). **Nada muda no SSM** nem nos outros projetos.
- Baixa as dependências do front-end e do back-end.
- Confere se você já consegue enviar código para o GitHub. Se abrir uma janela do GitHub, entre com a sua conta.

No fim aparece **"Tudo pronto!"** ou uma lista com o que falta e o que fazer. Se faltar algo, resolva e rode o `.\preparar.cmd` de novo.

## 3. Teste

Ainda na pasta `feira-dev`:

```powershell
.\piloto.cmd
```

Espere uns 30 segundos e abra <http://localhost:4201/painel>. Você deve ver a feira de um lado e o quadro de erros do outro. Se o Windows perguntar se o Node pode usar a rede, clique em **Permitir**.

Para fechar: **Ctrl+C** no PowerShell.

Pronto, missão cumprida. 🎉

## No dia

- Traga o notebook **carregado** e o **carregador**.
- Feche o que estiver usando a porta 8080 (por exemplo, o SSM rodando).
- Quem pilota não usa IA: se o seu editor tiver o GitHub Copilot ou outro assistente, deixe-o desligado.

## Se der problema

| O que aparece | O que fazer |
|---|---|
| `git` não é reconhecido | Instale o Git em <https://git-scm.com> e abra o PowerShell de novo |
| "ainda sem permissão para enviar código" | Confira se o Raul recebeu o seu usuário e se você aceitou o convite. Depois rode `.\preparar.cmd` de novo |
| "a porta 8080 está ocupada" | Outro projeto está rodando. Feche-o antes de rodar o `piloto.cmd` |
| O `npm ci` ou o Maven falharam | Quase sempre é a rede. Tente de novo; se continuar, mande um print para o Raul |
| Usa Mac ou Linux | Instale o Node 24 e o Java 21, depois rode `node scripts/preparar.mjs` e, para testar, `node scripts/piloto.mjs` |

Travou em qualquer passo? Mande um print para o Raul. É melhor resolver hoje do que no dia.
