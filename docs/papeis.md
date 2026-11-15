# Os papéis — o modo cego

Nas rodadas 1, 2 e 3, cada pessoa da equipe enxerga só **uma parte** do trabalho, cada uma no **próprio computador**. Ninguém consegue fazer a barraca sozinho: a equipe só entrega se conversar.

O telão mostra o papel de cada pessoa. A cada rodada os papéis giram, então todo mundo passa pelos três.

| Papel | No computador dele | Faz |
|---|---|---|
| ⌨️ **Piloto** | Só o editor de código. Nada de navegador. | Digita o que o copiloto pede e conta o que está vendo no código |
| 🧭 **Copiloto** | Só o cartão da rodada, aberto no GitHub | Lê o cartão e explica ao piloto o que fazer, passo a passo |
| 📣 **Repórter** | Só o **painel do repórter**: a barraca rodando e as mensagens de erro | Conta o que apareceu ou lê o erro, confere a entrega no telão e apresenta na vitrine |

Na **rodada 4** não tem modo cego: os três veem tudo e criam a atração juntos.

## No começo de cada rodada (2 minutos)

**Piloto**, no computador dele:

```bash
git pull
node scripts/piloto.mjs
```

O comando liga o back-end e o front-end e escreve um endereço como `http://192.168.0.25:4201/painel`. Leia esse endereço em voz alta e minimize a janela: dali em diante você só usa o editor. Quando você salva um arquivo Java, o back-end reinicia sozinho.

Na primeira vez, o Windows pode perguntar se o Node pode usar a rede: clique em **Permitir**.

**Repórter**, no computador dela: abra no navegador o endereço que o piloto leu. O painel mostra a barraca à esquerda e, à direita, os erros do front-end e do back-end, com o arquivo e a linha. A barraca se atualiza sozinha a cada vez que o piloto salva.

**Copiloto**, no computador dele: abra o cartão da rodada no GitHub.

- [Rodada 1](https://github.com/Raulzaozinho/2-Hackaton-Memora/blob/main/docs/rodadas/rodada-1.md)
- [Rodada 2](https://github.com/Raulzaozinho/2-Hackaton-Memora/blob/main/docs/rodadas/rodada-2.md)
- [Rodada 3](https://github.com/Raulzaozinho/2-Hackaton-Memora/blob/main/docs/rodadas/rodada-3.md)
- [Rodada 4](https://github.com/Raulzaozinho/2-Hackaton-Memora/blob/main/docs/rodadas/rodada-4.md)

## Como cada um fala

**Copiloto, ditando código.** Fale o que é, onde fica e depois os detalhes:

> "Abre o arquivo barraca.config.ts. Na linha do nome, apaga o que está entre as aspas simples e escreve Barraca do Churros."

Para os símbolos: **aspas simples** `'`, **chaves** `{ }`, **colchetes** `[ ]`, **parênteses** `( )`, **ponto e vírgula** `;`, **sinal de menor** `<` e **maior** `>`.

**Piloto, contando o que vê.** Diga em que arquivo e em que linha está, e leia em voz alta o que acabou de digitar. Se o editor sublinhar alguma coisa em vermelho, avise.

**Repórter, contando o resultado.** Descreva o que mudou ("o título agora está roxo") ou leia o erro do painel inteiro: o arquivo, a linha e a mensagem.

## Espiadas

Cada equipe tem **2 espiadas por rodada**. Numa espiada, o copiloto ou o repórter olha a tela do computador do piloto por 30 segundos. Usem quando a conversa empacar.

## Entregar

Quando o repórter disser que está funcionando, o copiloto dita e o piloto digita, num terminal novo:

```bash
git add .
git commit -m "rodada 1: nome e cores da barraca"
git push
```

O repórter olha o telão e avisa se entrou ou qual foi o motivo da recusa.

## Se o painel não abrir no computador do repórter

Algumas redes bloqueiam um computador de abrir o outro. Plano B: o repórter senta ao lado do piloto e, quando pede "deixa eu ver", o piloto abre `http://localhost:4201/painel`, vira o notebook para ele e olha para o outro lado.

## Travou?

Copo vermelho na mesa e o organizador vem até vocês.
