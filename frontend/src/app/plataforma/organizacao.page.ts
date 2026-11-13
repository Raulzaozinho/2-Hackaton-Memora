import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BARRACAS } from '../barracas/registro';
import { mensagemDeErro } from './barraca-api';
import { FeiraService, formatarRelogio } from './feira.service';
import { EstadoDaFeira, Placar } from './tipos';

const CHAVE_PIN = 'feira.pin';

/** O painel de quem conduz o dia: etapas, relógio, equipes e a revelação do resultado. */
@Component({
  selector: 'app-organizacao-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './organizacao.page.html',
  styleUrl: './organizacao.page.css',
})
export class OrganizacaoPage {
  protected feira = inject(FeiraService);
  private http = inject(HttpClient);
  protected barracas = BARRACAS;

  protected pin = signal(lerPin());
  protected dentro = signal(false);
  protected aviso = signal('');
  protected placar = signal<Placar[]>([]);
  protected relogio = computed(() => formatarRelogio(this.feira.segundosRestantes()));

  constructor() {
    // O estado chega a cada três segundos. A distribuição também pode mudar
    // sem alterar o total de fichas, por isso consultamos a cada atualização.
    effect(() => {
      const estado = this.feira.estado();
      if (this.dentro() && estado) this.carregarPlacar();
    });
    if (this.pin()) {
      this.entrar();
    }
  }

  protected entrar() {
    this.http.get('/api/organizacao/conferir', { headers: this.cabecalho() }).subscribe({
      next: () => {
        this.dentro.set(true);
        this.aviso.set('');
        try {
          sessionStorage.setItem(CHAVE_PIN, this.pin());
        } catch {
          // Sem armazenamento, o PIN é pedido de novo ao recarregar.
        }
        this.carregarPlacar();
      },
      error: (erro) => {
        this.dentro.set(false);
        this.aviso.set(mensagemDeErro(erro));
      },
    });
  }

  protected etapa(acao: 'proxima' | 'anterior' | 'mais-um-minuto' | 'reiniciar-relogio') {
    this.chamar('POST', `etapa/${acao}`);
  }

  protected sortear() {
    if (confirm('Sortear as equipes de novo? A divisão atual será trocada.')) {
      this.chamar('POST', 'equipes/sortear');
    }
  }

  protected definirEquipe(slug: string, equipe: string) {
    this.chamar('PUT', `participantes/${slug}/equipe`, { equipe: equipe || null });
  }

  protected revelar(revelado: boolean) {
    this.chamar('POST', 'resultado', { revelado });
  }

  protected recomecar() {
    if (confirm('Recomeçar o dia? Volta para a abertura e apaga todas as fichas já dadas.')) {
      this.chamar('POST', 'recomecar');
    }
  }

  protected nomeDaBarraca(id: string): string {
    const barraca = BARRACAS.find((b) => b.id === id);
    return barraca ? `${barraca.emoji} ${barraca.nome}` : id;
  }

  private chamar(metodo: 'POST' | 'PUT', caminho: string, corpo: unknown = {}) {
    this.http
      .request<EstadoDaFeira>(metodo, `/api/organizacao/${caminho}`, { body: corpo, headers: this.cabecalho() })
      .subscribe({
        next: (estado) => {
          this.feira.estado.set(estado);
          this.feira.atualizar();
          this.aviso.set('');
          this.carregarPlacar();
        },
        error: (erro) => this.aviso.set(mensagemDeErro(erro)),
      });
  }

  private carregarPlacar() {
    this.http.get<Placar[]>('/api/organizacao/resultado', { headers: this.cabecalho() }).subscribe({
      next: (placar) => this.placar.set(placar),
      error: () => undefined,
    });
  }

  private cabecalho() {
    return { 'X-Pin': this.pin() };
  }
}

function lerPin(): string {
  try {
    return sessionStorage.getItem(CHAVE_PIN) ?? '';
  } catch {
    return '';
  }
}
