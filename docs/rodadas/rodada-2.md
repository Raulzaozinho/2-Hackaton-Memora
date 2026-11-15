# Rodada 2 — Abastecer a barraca

**Entrega:** a barraca mostra uma lista que vem do back-end.
**Tempo:** 20 minutos. **Sem IA nesta rodada.**

Troque o `N` pelo número da sua equipe. Nesta rodada vocês mexem em dois lugares:

- **Back-end:** `backend/src/main/java/br/com/memora/feira/barracas/equipeN/EquipeNController.java`
- **Front-end:** `frontend/src/app/barracas/equipe-N/`

**Modo cego:** este cartão é só do copiloto, no computador dele. O piloto começa com `git pull` e `node scripts/piloto.mjs`, e lê em voz alta o endereço do painel; o repórter abre esse endereço no computador dela. Regras em [papeis.md](../papeis.md).

## Mínimo — todo mundo chega aqui

**1. No back-end, abram `EquipeNController.java`** e troquem o item de exemplo por pelo menos três itens da barraca de vocês:

```java
@GetMapping("/itens")
public List<Item> itens() {
    return List.of(
            new Item("🍫", "Doce de leite", "O mais pedido"),
            new Item("🍓", "Morango", "Com pedaços de fruta"),
            new Item("🥜", "Paçoca", "Só para os fortes"));
}
```

Cada `Item` tem três textos: emoji, nome e descrição. Os itens são separados por vírgula, e depois do último vem `);`.

**2. Esperem o back-end reiniciar:** ao salvar o arquivo Java, ele reinicia sozinho. O painel do repórter mostra "compilando…" e depois "rodando" (uns 20 segundos).

**3. Repórter, confira a resposta pura:** numa aba nova, abra o endereço do painel trocando `/painel` por `/api/barracas/equipe-N/itens`. Exemplo:
`http://192.168.0.25:4201/api/barracas/equipe-N/itens`

Esse texto entre colchetes é o que o back-end responde. O nome disso é JSON.

**4. No front, abram `equipe-N.ts`** e, logo abaixo do comentário da RODADA 2, criem a caixinha da lista e peçam os itens:

```ts
  // RODADA 2 — a lista de itens que vem do back-end entra aqui.
  itens = signal<Item[]>([]);

  constructor() {
    this.api.itens('equipe-N').subscribe((lista) => this.itens.set(lista));
  }
```

Lendo em português: "peça os itens da equipe-N e, quando a resposta chegar, guarde a lista na caixinha `itens`".

**5. Abram `equipe-N.html`** e, abaixo do comentário da RODADA 2, mostrem a lista:

```html
<section>
  <h3>O que temos hoje</h3>
  <ul>
    @for (item of itens(); track item.nome) {
      <li>{{ item.emoji }} <strong>{{ item.nome }}</strong> — {{ item.descricao }}</li>
    }
  </ul>
</section>
```

O `@for` repete o `<li>` uma vez para cada item. As chaves duplas `{{ }}` mostram um valor na tela.

**6. Repórter, confira** a lista na barraca e, se estiver certa, **entreguem:**

```bash
git add .
git commit -m "rodada 2: lista de recheios"
git push
```

## Bom — se sobrar tempo

- Deixem cada item com cara de cartão. A barraca modelo tem um exemplo pronto: copiem a parte `.sabores` de `modelo.css` e a estrutura de `modelo.html`.
- Mostrem quantos itens existem: `<p>{{ itens().length }} opções</p>`.

## Extra — para quem quer mais

- Uma mensagem para quando a lista estiver vazia, com `@empty`:

```html
@for (item of itens(); track item.nome) {
  <li>{{ item.nome }}</li>
} @empty {
  <li>Acabou tudo! Voltem amanhã.</li>
}
```

## Na vitrine

Quem está de repórter mostra a lista na tela e conta de onde ela vem.

## Travou?

| Sintoma | Causa provável |
|---|---|
| A lista não aparece e não há erro | O back-end não foi reiniciado, ou o `'equipe-N'` está com o número errado |
| O back-end não sobe depois da mudança | Faltou vírgula entre os itens, ou sobrou vírgula depois do último |
| Erro vermelho no terminal do front | Leiam a primeira linha: ela diz o arquivo e a linha do erro |

Copo vermelho na mesa e o organizador vem até vocês. Enquanto ele não chega, comparem com a barraca modelo, que faz a mesma coisa, ou perguntem a outra equipe: ajudar não tira ponto de ninguém.
