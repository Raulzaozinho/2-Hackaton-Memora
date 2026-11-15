# Os papéis — o modo cego

O dia tem **3 ciclos**. Em cada um, cada pessoa da equipe enxerga só **uma parte** do trabalho, cada uma no **próprio computador**. Ninguém consegue fazer a barraca sozinho: a equipe só pontua se conversar.

O telão e a página da feira mostram o papel de cada pessoa. A cada ciclo os papéis giram, então todo mundo passa pelos três, e a equipe continua o código de onde o ciclo anterior parou.

| Papel | No computador dele | Faz |
|---|---|---|
| ⌨️ **Piloto** | Só o editor de código. Nada de navegador, pesquisa ou IA. | Executa o que o copiloto pede e conta o que está vendo no código |
| 🧭 **Copiloto** | O **manual**, que abre na página da feira, e pesquisa à vontade | Lê cada item do manual e explica ao piloto o que fazer |
| 📣 **Repórter** | O **painel do repórter** (a barraca rodando e os erros) e pesquisa à vontade | Conta o que apareceu ou lê o erro e confere no telão se a entrega entrou |

## Como cada ciclo funciona

1. **Aula (5 min):** a organização explica o assunto no quadro. As palavras da aula são as do manual.
2. **Missão (30 min):** o piloto executa, o copiloto guia pelo manual, o repórter conta o que aparece.
3. **Avaliação (5 min):** a organização confere na feira cada item do manual. Só pontua o que **entrou no telão**.
4. **Votação (5 min):** cada pessoa visita as barracas das outras equipes e dá 2 fichas. Cada ficha vale 5 pontos.

## No começo de cada missão (2 minutos)

Todos entram na feira com o próprio e-mail. A página da feira diz o papel de cada um.

**Piloto**, no computador dele:

```bash
git pull
node scripts/piloto.mjs
```

O comando liga o back-end e o front-end e escreve um endereço como `http://192.168.0.25:4201/painel`. Leia esse endereço em voz alta e minimize a janela: dali em diante você só usa o editor. Quando você salva um arquivo Java, o back-end reinicia sozinho.

Na primeira vez, o Windows pode perguntar se o Node pode usar a rede: clique em **Permitir**.

**Repórter**, no computador dela: abra no navegador o endereço que o piloto leu. O painel mostra a barraca à esquerda e, à direita, os erros do front-end e do back-end, com o arquivo e a linha. A barraca se atualiza sozinha a cada vez que o piloto salva.

**Copiloto**, no computador dele: na página da feira, clique em **📖 Abrir o manual**. O manual mostra a missão do ciclo, cada item com os pontos que vale, o arquivo, os passos, o código para ditar e o que o repórter deve ver.

## Como cada um fala

**Copiloto, ditando código.** Fale o que é, onde fica e depois os detalhes:

> "Abre o arquivo barraca.config.ts. Na linha do nome, apaga o que está entre as aspas simples e escreve Barraca do Churros."

O manual tem um dicionário com o nome de cada símbolo.

**Piloto, contando o que vê.** Diga em que arquivo e em que linha está, e leia em voz alta o que acabou de digitar. Se o editor sublinhar alguma coisa em vermelho, avise.

**Repórter, contando o resultado.** Descreva o que mudou ("o título agora está roxo") ou leia o erro do painel inteiro: o arquivo, a linha e a mensagem.

## Pesquisa e IA

**O piloto nunca usa IA nem pesquisa**: nada de ChatGPT, Copilot, Google ou documentação no computador dele. O copiloto e o repórter podem pesquisar à vontade, inclusive com IA, e explicar ao piloto com as próprias palavras. Os itens difíceis do manual trazem o que pesquisar.

Se o editor do piloto tiver um assistente de IA (como o Copilot do VS Code), ele fica desligado durante o dia.

## Espiadas

Cada equipe tem **2 espiadas por ciclo**. Numa espiada, o copiloto ou o repórter olha a tela do computador do piloto por 30 segundos. Usem quando a conversa empacar.

## Entregar

Entreguem cedo e entreguem de novo a cada item feito: só pontua o que estiver no telão quando o relógio da missão zerar. O copiloto dita e o piloto digita, num terminal novo:

```bash
git add .
git commit -m "ciclo 1: nome e cores da barraca"
git push
```

O repórter olha o telão e avisa se entrou ou qual foi o motivo da recusa.

## Se o painel não abrir no computador do repórter

Algumas redes bloqueiam um computador de abrir o outro. Plano B: o repórter senta ao lado do piloto e, quando pede "deixa eu ver", o piloto abre `http://localhost:4201/painel`, vira o notebook para ele e olha para o outro lado.

## Travou?

Copo vermelho na mesa e o organizador vem até vocês.
