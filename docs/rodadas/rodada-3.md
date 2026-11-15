# Rodada 3 — Atender o visitante

**Entrega:** um formulário que grava no banco, e o que foi gravado aparece na lista.
**Tempo:** 20 minutos. **IA liberada a partir desta rodada,** com uma condição: na vitrine, uma pessoa sorteada da equipe explica o código.

Troque o `N` pelo número da sua equipe. Tudo acontece em `frontend/src/app/barracas/equipe-N/`.
O back-end desta rodada já está pronto: a plataforma sabe guardar e listar **registros** de qualquer barraca.

Quem pilota começa com `git pull`.

## Antes: o que o visitante vai deixar na barraca?

Decidam em 2 minutos. Um pedido? Um recado? Um palpite? O exemplo abaixo usa "recado"; troquem os nomes para combinar com a barraca.

## Mínimo — todo mundo chega aqui

**1. Abram `equipe-N.ts`** e, abaixo do comentário da RODADA 3, criem duas caixinhas e duas ações:

```ts
  // RODADA 3 — o que o visitante digita e a lista do que já foi gravado entram aqui.
  recado = signal('');
  recados = signal<Registro[]>([]);

  carregarRecados() {
    this.api.registros('equipe-N').subscribe((lista) => this.recados.set(lista));
  }

  enviar() {
    const novo = { autor: this.feira.meuNome(), texto: this.recado() };
    this.api.salvar('equipe-N', novo).subscribe(() => {
      this.recado.set('');
      this.carregarRecados();
    });
  }
```

**2. Dentro do `constructor`** que vocês fizeram na rodada 2, acrescentem uma linha para a lista já vir carregada:

```ts
  constructor() {
    this.api.itens('equipe-N').subscribe((lista) => this.itens.set(lista));
    this.carregarRecados();
  }
```

**3. Abram `equipe-N.html`** e, abaixo do comentário da RODADA 3, coloquem o formulário e a lista:

```html
<section>
  <h3>Deixe seu recado</h3>
  <input class="campo" [(ngModel)]="recado" placeholder="Escreva aqui" />
  <button class="botao" (click)="enviar()" [disabled]="!recado()">Enviar</button>

  <ul>
    @for (item of recados(); track item.id) {
      <li><strong>{{ item.autor }}</strong>: {{ item.texto }}</li>
    }
  </ul>
</section>
```

Três peças novas:

- `[(ngModel)]="recado"` liga o campo à caixinha: o que a pessoa digita vai para `recado`.
- `(click)="enviar()"` diz qual ação roda no clique.
- `[disabled]="!recado()"` desliga o botão enquanto o campo está vazio.

**4. Testem** em <http://localhost:4200>: escrevam, enviem, e o recado aparece na lista. Recarreguem a página: ele continua lá, porque está no banco.

**5. Entreguem:**

```bash
git add .
git commit -m "rodada 3: formulário de recados"
git push
```

## Bom — se sobrar tempo

- Um registro tem mais dois campos livres: `detalhe` (texto) e `numero`. Usem um segundo campo no formulário, como a barraca modelo faz com a observação do pedido.
- Mostrem um aviso quando der erro. A barraca modelo tem o exemplo: procurem `aviso` em `modelo.ts` e `modelo.html`.

## Extra — para quem quer mais

- Mostrem só os 5 recados mais recentes: `recados().slice(0, 5)`.
- Mostrem o total: `{{ recados().length }} recados até agora`.

## Na vitrine

Uma pessoa sorteada da equipe grava um registro ao vivo e explica o caminho dele: do clique até o banco.

## Travou?

| Sintoma | Causa provável |
|---|---|
| Clico em Enviar e nada acontece | O campo não está ligado: confiram o `[(ngModel)]="recado"` |
| Erro "Can't bind to 'ngModel'" | Apagaram sem querer o `imports: [FormsModule]` do `.ts` |
| Grava, mas a lista não atualiza | Faltou chamar `this.carregarRecados()` depois de salvar |

Copo vermelho na mesa e o organizador vem até vocês. Enquanto ele não chega, comparem com a barraca modelo, que faz a mesma coisa, ou perguntem a outra equipe: ajudar não tira ponto de ninguém.
