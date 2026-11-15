import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarracaApi, mensagemDeErro } from '../../plataforma/barraca-api';
import { FeiraService } from '../../plataforma/feira.service';
import { Item, Registro } from '../../plataforma/tipos';

/**
 * BARRACA MODELO — a Barraca do Pastel. Está completa e serve de consulta: copie daqui à vontade.
 *
 * Um componente tem três arquivos: este (.ts) guarda os dados e as ações,
 * o .html diz o que aparece na tela e o .css diz como aparece.
 */
@Component({
  selector: 'app-modelo',
  imports: [FormsModule],
  templateUrl: './modelo.html',
  styleUrl: './modelo.css',
})
export class Modelo {
  // Ferramentas prontas da plataforma.
  private api = inject(BarracaApi); // conversa com o back-end
  private feira = inject(FeiraService); // sabe quem está usando a tela

  // CICLO 2 — a lista de sabores. Um signal é uma caixinha com um valor:
  // lê-se com sabores() e troca-se com sabores.set(novoValor). Quando o valor muda, a tela se atualiza.
  sabores = signal<Item[]>([]);

  // CICLO 3 — o que a pessoa escolheu no formulário e os pedidos já gravados no banco.
  saborEscolhido = signal('');
  observacao = signal('');
  pedidos = signal<Registro[]>([]);
  aviso = signal('');

  // CICLO 3 · DESAFIO — o sabor sorteado pela atração da barraca.
  surpresa = signal<Item | null>(null);

  // O constructor roda uma vez, quando a barraca aparece na tela.
  constructor() {
    // CICLO 2 — pede os sabores ao back-end e, quando a resposta chegar, guarda na caixinha.
    this.api.itens('modelo').subscribe((lista) => this.sabores.set(lista));
    this.carregarPedidos();
  }

  // CICLO 3 — busca no back-end os pedidos já gravados.
  carregarPedidos() {
    this.api.registros('modelo').subscribe((lista) => this.pedidos.set(lista));
  }

  // CICLO 3 — roda quando a pessoa clica em "Pedir".
  pedir() {
    const pedido = {
      autor: this.feira.meuNome(),
      texto: this.saborEscolhido(),
      detalhe: this.observacao(),
    };
    this.api.salvar('modelo', pedido).subscribe({
      // Deu certo: limpa o formulário e busca a lista de novo, agora com o pedido novo.
      next: () => {
        this.saborEscolhido.set('');
        this.observacao.set('');
        this.aviso.set('');
        this.carregarPedidos();
      },
      // Deu errado: mostra o motivo na tela.
      error: (erro) => this.aviso.set(mensagemDeErro(erro)),
    });
  }

  // CICLO 3 · DESAFIO — chama o endpoint que a barraca inventou: GET /api/barracas/modelo/surpresa
  sortear() {
    this.api.buscar<Item>('modelo', 'surpresa').subscribe((sabor) => this.surpresa.set(sabor));
  }
}
