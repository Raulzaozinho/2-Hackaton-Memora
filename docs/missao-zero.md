# Missão Zero — antes do dia

**Objetivo:** chegar no dia com o projeto rodando na sua máquina e com o seu crachá na feira.
Leva uns 20 minutos. Se travar em qualquer passo, chame alguém da organização: é para isso que a Missão Zero existe.

## 1. Instale

- Git
- Node.js 24 (LTS)
- Java (JDK) 21 ou mais novo
- VS Code ou IntelliJ

Para conferir, abra um terminal e rode os três comandos. Cada um deve responder com um número de versão:

```bash
git --version
node --version
java --version
```

## 2. Baixe o projeto

```bash
git clone https://github.com/Raulzaozinho/2-Hackaton-Memora.git feira-dev
cd feira-dev
```

Para enviar o seu crachá (passo 6) você precisa ser colaborador do repositório. A organização manda o convite para o seu usuário do GitHub; aceite pelo e-mail ou em <https://github.com/Raulzaozinho/2-Hackaton-Memora/invitations>.

## 3. Rode o back-end

```bash
cd backend
./mvnw spring-boot:run
```

No PowerShell do Windows: `.\mvnw.cmd spring-boot:run`.

A primeira vez demora, porque ele baixa as dependências. Está pronto quando aparecer `Started FeiraApplication`. Deixe esse terminal aberto.

## 4. Rode o front-end

Abra **outro** terminal, na pasta do projeto:

```bash
cd frontend
npm install
npm start
```

Abra <http://localhost:4200>. Você deve ver a feira com três barracas.

## 5. Ajuste o seu crachá

O seu crachá já existe e só tem o seu nome. Agora você escreve como quer aparecer no telão no dia.

1. Vá até a pasta `backend/src/main/resources/crachas` e abra o arquivo com o seu nome. Exemplo: `bruno.json`.
2. Troque o nome pelo jeito que você quer ser chamado: um apelido, ou o nome com a inicial do sobrenome.

```json
{
  "nome": "Bruno S."
}
```

3. **Não mude o nome do arquivo.** É por ele que a feira sabe quem é você.
4. Pare o back-end (Ctrl+C no terminal dele) e rode de novo.
5. Abra <http://localhost:4200/#/crachas>. O seu crachá deve aparecer com o nome novo.

Se não mudou, olhe o terminal do back-end: ele avisa quando um crachá tem erro. O mais comum é faltar uma vírgula ou uma aspa.

Não achou um arquivo com o seu nome? Avise a organização.

## 6. Envie o seu crachá

Troque `bruno` pelo nome do seu arquivo:

```bash
git switch -c cracha/bruno
git add backend/src/main/resources/crachas/bruno.json
git commit -m "ajusta o crachá do Bruno"
git push -u origin cracha/bruno
```

Depois abra o repositório no GitHub e clique em **Compare & pull request**. Esse é o seu primeiro PR (pedido para juntar o seu código ao principal). A organização aprova.

## Pronto

Missão cumprida quando o seu PR estiver aberto. No dia você só precisa chegar com o notebook.

## Se der problema

| O que aparece | O que fazer |
|---|---|
| `Port 8080 was already in use` | O back-end já está rodando em outro terminal. Feche o outro. |
| A feira abre, mas avisa "Sem resposta do back-end" | O terminal do back-end fechou ou ainda está subindo. |
| `npm` ou `java` "não é reconhecido" | A instalação não terminou ou o terminal é antigo. Feche e abra o terminal de novo. |
| `Permission denied` no `./mvnw` (Mac ou Linux) | Rode `chmod +x mvnw` uma vez. |
