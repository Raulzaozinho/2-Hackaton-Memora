# Rodada 1 — Levantar a barraca

**Entrega:** o nome, as cores e o texto da barraca de vocês aparecem na feira.
**Tempo:** 20 minutos. **Sem IA nesta rodada:** a ideia é entender cada linha.

Troque o `N` pelo número da sua equipe. Todos os arquivos desta rodada estão em
`frontend/src/app/barracas/equipe-N/`.

## Antes de começar

**Modo cego:** este cartão é só do copiloto, no computador dele. O piloto só vê o código e o repórter só vê o painel do repórter. As regras estão em [papeis.md](../papeis.md).

Na primeira rodada, o piloto entra no ramo da equipe e liga o projeto:

```bash
git fetch
git switch equipe-N
node scripts/piloto.mjs
```

O piloto lê em voz alta o endereço que aparece (termina em `/painel`), e o repórter abre esse endereço no computador dela.

## Mínimo — todo mundo chega aqui

**1. Decidam juntos, em 3 minutos:** que barraca é a de vocês? De comida, de jogo, de recados? Não precisa ser definitivo.

**2. Abram `barraca.config.ts`** e troquem os quatro valores:

```ts
export const EQUIPE_N: ConfigDaBarraca = {
  nome: 'Barraca do Churros',
  slogan: 'Recheio até a ponta',
  emoji: '🥖',
  cor: '#8e44ad',
};
```

A cor é um código hexadecimal. Procurem "seletor de cores" no navegador para escolher uma.

**3. Abram `equipe-N.html`** e troquem o título e o texto da vitrine:

```html
<section class="vitrine">
  <h2>O melhor churros da feira</h2>
  <p>Escolha o recheio e a gente faz na hora.</p>
</section>
```

**4. Repórter, confira** no painel: o cartão da barraca no mapa e a página dela. Conte para a equipe o que apareceu.

**5. Entreguem:**

```bash
git add .
git commit -m "rodada 1: nome e cores da barraca"
git push
```

Olhem o telão: em até um minuto aparece "✅ Entrou na feira".

## Bom — se sobrar tempo

- Abram `equipe-N.css` e mudem o visual da vitrine: fundo, borda, tamanho da letra.
- Acrescentem no `.html` uma segunda `<section>` com o nome de quem é da equipe.

```html
<section>
  <h3>Quem atende aqui</h3>
  <p>Ana, Bruno e Carla</p>
</section>
```

## Extra — para quem quer mais

- Uma lista `<ul>` com três motivos para visitar a barraca.
- Um efeito no CSS quando o mouse passa por cima da vitrine (`.vitrine:hover { ... }`).

## Na vitrine (5 minutos finais)

Quem está de repórter conta em 30 segundos: que barraca é, e uma coisa que a equipe aprendeu.

## Travou?

Copo vermelho na mesa e o organizador vem até vocês. Enquanto ele não chega, comparem com a barraca modelo, que faz a mesma coisa, ou perguntem a outra equipe: ajudar não tira ponto de ninguém.
