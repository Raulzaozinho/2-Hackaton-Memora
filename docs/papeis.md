# Os papéis — o modo cego

Nas rodadas 1, 2 e 3, cada pessoa da equipe enxerga só **uma parte** do trabalho. Ninguém consegue fazer a barraca sozinho: a equipe só entrega se conversar.

O telão mostra o papel de cada pessoa. A cada rodada os papéis giram, então todo mundo passa pelos três.

| Papel | Enxerga | Não enxerga | Faz |
|---|---|---|---|
| ⌨️ **Piloto** | O editor de código | O cartão e o navegador | Digita o que o copiloto pede e conta o que está vendo no código |
| 🧭 **Copiloto** | O cartão da rodada | A tela do piloto e o navegador | Lê o cartão e explica ao piloto o que fazer, passo a passo |
| 📣 **Repórter** | O resultado: a barraca rodando, os erros e o telão | O cartão e o código | Conta o que apareceu (ou o erro), confere a entrega e apresenta na vitrine |

Na **rodada 4** não tem modo cego: os três veem tudo e criam a atração juntos.

## Como sentar

```
          [ notebook do piloto ]
                 piloto
   copiloto  ←  de costas para a tela, com o cartão na mão
   repórter  ←  com o próprio notebook ou celular, sem ver a tela do piloto
```

## No começo de cada rodada (2 minutos)

1. **Piloto:** no próprio notebook, pega o que a equipe já fez e liga o projeto:

   ```bash
   git pull
   ```

   Terminal 1: `cd backend` e `.\mvnw.cmd spring-boot:run` (Mac e Linux: `./mvnw spring-boot:run`).

   Terminal 2: `cd frontend` e `npm run start:rede`.

2. **Piloto:** lê em voz alta o endereço que aparece na linha `Network`, por exemplo `http://192.168.0.25:4200`.
3. **Repórter:** abre esse endereço no próprio notebook ou celular. É por ali que ele vê a barraca.
4. **Copiloto:** pega o cartão da rodada.

Se o endereço não abrir no aparelho do repórter (algumas redes bloqueiam), use o plano B: o repórter senta ao lado do piloto e, quando pedir "deixa eu ver", o piloto vira o notebook para ele e olha para o outro lado.

## Como cada um fala

**Copiloto, ditando código.** Fale o que é, onde fica e depois os detalhes:

> "Abre o arquivo barraca.config.ts. Na linha do nome, apaga o que está entre as aspas simples e escreve Barraca do Churros."

Para os símbolos: **aspas simples** `'`, **chaves** `{ }`, **colchetes** `[ ]`, **parênteses** `( )`, **ponto e vírgula** `;`, **sinal de menor** `<` e **maior** `>`.

**Piloto, contando o que vê.** Diga em que arquivo e em que linha está, e leia em voz alta o que acabou de digitar. Se o editor sublinhar alguma coisa em vermelho, avise.

**Repórter, contando o resultado.** Descreva o que mudou ("o título agora está roxo") ou leia o erro inteiro, com o arquivo e a linha. Uma caixa preta com texto vermelho no navegador é um erro de compilação: leia o que está escrito nela.

## Espiadas

Cada equipe tem **2 espiadas por rodada**. Numa espiada, o copiloto ou o repórter olha a tela do notebook do piloto por 30 segundos: o código e a barraca rodando. Usem quando a conversa empacar.

## Entregar

Quando o repórter disser que está funcionando, o copiloto dita e o piloto digita:

```bash
git add .
git commit -m "rodada 1: nome e cores da barraca"
git push
```

O repórter olha o telão e avisa se entrou ou qual foi o motivo da recusa.

## Travou?

Copo vermelho na mesa e o organizador vem até vocês.
