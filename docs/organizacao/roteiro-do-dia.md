# Roteiro do dia — para a organização

Três horas, do início ao fim. O painel da organização já traz as etapas nesta ordem: a cada mudança, clique em **Próxima etapa** e o relógio do telão começa sozinho.

| Tempo | Etapa | Duração |
|---|---|---|
| 0:00 | Abertura | 10 min |
| 0:10 | Rodada 1 — Levantar a barraca | 30 min |
| 0:40 | Rodada 2 — Abastecer a barraca | 30 min |
| 1:10 | Intervalo | 10 min |
| 1:20 | Rodada 3 — Atender o visitante | 30 min |
| 1:50 | Rodada 4 — A atração | 30 min |
| 2:20 | Feira aberta | 25 min |
| 2:45 | Premiação | 10 min |

Sobram 5 minutos de folga. Se uma etapa apertar, use **+1 minuto**; evite passar de 3 minutos extras por rodada.

## As regras, para dizer na abertura

1. **Cada equipe monta uma barraca** dentro da mesma feira. A cada rodada ela ganha uma coisa nova.
2. **Modo cego e rodízio:** nas rodadas 1 a 3, o **piloto** só vê o código, o **copiloto** só vê o cartão e o **repórter** só vê o resultado (a barraca rodando, os erros e o telão). Só dá certo se os três conversarem. Cada equipe tem 2 espiadas de 30 segundos por rodada. A cada rodada os papéis giram, e o telão mostra quem é quem. Na rodada 4 os três veem tudo. As regras completas estão em [papeis.md](../papeis.md).
3. **Três níveis** em cada cartão: o mínimo todo mundo alcança; o bom e o extra são para quem tiver tempo.
4. **Copo vermelho** na mesa quer dizer "travamos". Ninguém fica parado em silêncio.
5. **Entregar é dar push.** A mensagem do commit aparece no telão, com o nome de quem enviou.
6. **IA:** não nas rodadas 1 e 2; liberada nas rodadas 3 e 4, e uma pessoa sorteada da equipe explica o código.
7. **No fim a feira abre:** cada pessoa tem 5 fichas para dar às barracas das outras equipes.

## Como é uma rodada guiada (1, 2 e 3)

| Minutos | O quê |
|---|---|
| 0 a 5 | Aula no quadro (roteiros abaixo) |
| 5 a 25 | Mão na massa, com o cartão da rodada |
| 25 a 30 | Vitrine: todos olham o telão; o repórter de cada equipe fala 30 segundos |

Aos 20 minutos, avise: "faltam 5 para entregar". O que vale é o que entrou no telão.

A aula de 5 minutos é o que dá à equipe um vocabulário em comum. No modo cego o piloto não lê o cartão: ele só entende "abre o .ts e cria um signal" se ouviu na aula o que é um `.ts` e o que é um signal. Por isso cada aula termina com as palavras que eles vão usar na rodada.

Na rodada 1, antes da aula, gaste 2 minutos mostrando a arrumação: o piloto de frente para o notebook, o copiloto de costas com o cartão, o repórter com o próprio aparelho. Mostre também como o repórter abre o endereço `Network` do piloto.

Durante a mão na massa, circule. Olhe primeiro para as mesas sem copo vermelho que estão quietas demais.

---

## Abertura (10 min)

- Telão na etapa **Abertura**. Mostre a feira com as três barracas ainda "em montagem".
- Abra a **barraca modelo** (Barraca do Pastel) e use-a por 1 minuto: faça um pedido, sorteie um sabor. "No fim do dia a barraca de vocês faz coisas assim."
- Diga as sete regras.
- Mostre as equipes no telão. Cada equipe confere o ramo: `git fetch` e `git switch equipe-N`.

## Rodada 1 — aula: como uma página é montada

**Ideia central:** uma página é feita de caixas dentro de caixas, e cada caixa é um componente.

**Desenhe:** um retângulo grande, "a feira". Dentro, um retângulo "moldura da barraca" (o toldo colorido e o balcão de fichas). Dentro dele, um retângulo destacado: "a página da equipe". Pinte só esse: "esta caixa é de vocês".

Ao lado, três fichas empilhadas:

```
equipe-N.html   → o que aparece
equipe-N.css    → como aparece
equipe-N.ts     → os dados e as ações
```

E uma quarta, separada: `barraca.config.ts → nome, slogan, emoji, cor`.

**Mostre ao vivo:** mude o emoji da barraca modelo, salve, e a página se atualiza sozinha.

**Pergunta para a turma:** "se eu quero mudar a cor do título, em qual dos três arquivos eu mexo?"

## Rodada 2 — aula: pedido e resposta

**Ideia central:** o navegador não sabe nada sozinho; ele pede e o back-end responde.

**Desenhe:** três caixas em linha.

```
[ Navegador ]  ──── pedido ───▶  [ Back-end ]  ────▶  [ Banco ]
   Angular     ◀─── resposta ──   Spring Boot          Supabase
```

Em cima da seta de ida, escreva: `GET /api/barracas/modelo/itens`. Em cima da seta de volta, uma lista entre colchetes: `[ {nome: "Queijo"}, {nome: "Carne"} ]`.

**Mostre ao vivo:** abra `http://localhost:8080/api/barracas/modelo/itens` no navegador. "Isto é a resposta pura, em JSON." Depois abra `ModeloController.java` e aponte: o `@GetMapping("/itens")` é a porta; o método é quem responde.

**Duas palavras novas, uma frase cada:**

- **signal:** uma caixinha com um valor. Lê com `itens()`, troca com `itens.set(...)`. Quando o valor muda, a tela muda.
- **subscribe:** "quando a resposta chegar, faça isto".

**Pergunta para a turma:** "se eu mudar a lista no Java e não reiniciar o back-end, o que aparece na tela?"

## Intervalo (10 min)

Bom momento para destravar no particular quem ficou para trás na rodada 2.

## Rodada 3 — aula: clique, estado e salvar

**Ideia central:** um formulário é um círculo: digitar, clicar, gravar, buscar de novo.

**Desenhe o círculo**, com quatro paradas:

```
1. a pessoa digita        →  o texto vai para a caixinha  (ngModel)
2. a pessoa clica         →  roda a função enviar()        (click)
3. o front manda um POST  →  o back-end grava no banco
4. o front pede a lista   →  a tela mostra o registro novo
```

Embaixo, desenhe a tabela `registro` com três linhas de exemplo e as colunas `id`, `barraca`, `autor`, `texto`. "Todas as barracas gravam na mesma tabela; a coluna `barraca` diz de quem é cada linha."

**Mostre ao vivo:** na barraca modelo, faça um pedido, recarregue a página e mostre que ele continua lá. "Continua porque está no banco, não na tela."

**Pergunta para a turma:** "por que a gente busca a lista de novo depois de salvar?"

## Rodada 4 — A atração (30 min, sem aula)

- Em 1 minuto: "vocês têm lista, formulário e, se quiserem, um endpoint novo. Combinem como quiserem. Sem ideia, sorteiem uma carta do cartão."
- Aos 15 minutos: "quem ainda não deu push de nenhuma versão, dê agora".
- Aos 25 minutos: "últimos 5 minutos; o que não entrar no telão não vai para a feira".
- Não há vitrine nesta rodada: a vitrine é a própria feira.

## Feira aberta (25 min)

1. Clique em **Próxima etapa** para abrir a feira. O telão mostra o endereço para o celular.
2. **Pregão (5 min):** em cada equipe, quem falou menos nas vitrines tem 1 minuto para convencer a turma a visitar a barraca.
3. Cada pessoa abre a feira, escolhe **quem é** e visita as barracas das outras equipes. São 5 fichas por pessoa, e não dá para dar ficha à própria equipe.
4. O telão mostra quantas fichas já foram gastas, sem dizer para quem.
5. Faltando 3 minutos: "quem ainda tem ficha, gaste".

## Premiação (10 min)

1. **Próxima etapa.** O telão mostra "Resultado trancado".
2. Antes de revelar, uma rodada rápida: cada pessoa diz **uma frase** com o que aprendeu hoje.
3. Entregue os dois prêmios da organização: **ideia mais criativa** e **melhor trabalho em equipe**.
4. Clique em **Revelar no telão** para a barraca campeã, a que recebeu mais fichas.

Se duas ou três barracas tiverem a mesma pontuação, o telão mostra o empate e divide a posição.
A ordem das equipes não é usada como desempate.

Com três prêmios e três equipes, dá para cada equipe sair com um, se fizer sentido.

## Depois

Pergunte à turma o que foi mais difícil e o que foi mais divertido, e anote. É o material para a próxima edição.
