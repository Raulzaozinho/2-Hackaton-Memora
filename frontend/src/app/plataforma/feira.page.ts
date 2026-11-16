import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BARRACAS, BARRACA_MODELO } from '../barracas/registro';
import { mensagemDeErro } from './barraca-api';
import { FeiraService, corDoTexto, formatarRelogio } from './feira.service';
import { classificarResultado, duracaoDaRevelacao } from './resultado';

/** A página inicial: o mapa da feira, com uma entrada para cada barraca. */
@Component({
  selector: 'app-feira-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './feira.page.html',
  styleUrl: './feira.page.css',
})
export class FeiraPage {
  protected feira = inject(FeiraService);
  protected barracas = BARRACAS;
  protected modelo = BARRACA_MODELO;
  protected corDoTexto = corDoTexto;

  protected relogio = computed(() => formatarRelogio(this.feira.segundosRestantes()));

  /** O papel de quem está na tela no ciclo atual (piloto, copiloto ou repórter). */
  protected meuPapel = computed(() => {
    const eu = this.feira.eu();
    const equipe = this.feira.estado()?.equipes.find((e) => e.id === eu?.equipe);
    return equipe?.membros.find((m) => m.slug === eu?.slug)?.papel ?? null;
  });

  /** A equipe de quem está na tela, para mostrar o ramo do Git certo. */
  protected minhaEquipe = computed(() => {
    const id = this.feira.eu()?.equipe;
    return id ? { id, numero: id.replace('equipe-', '') } : null;
  });

  protected email = signal('');
  protected entrando = signal(false);
  protected erroAoEntrar = signal('');

  protected entrar(evento: Event) {
    evento.preventDefault();
    this.entrando.set(true);
    this.erroAoEntrar.set('');
    this.feira.entrar(this.email()).subscribe({
      next: () => {
        this.entrando.set(false);
        this.email.set('');
      },
      error: (erro) => {
        this.entrando.set(false);
        this.erroAoEntrar.set(mensagemDeErro(erro));
      },
    });
  }

  /** O resultado com o nome e o emoji de cada barraca, depois que a organização revela. */
  protected resultado = computed(() =>
    classificarResultado(this.feira.estado()?.resultado ?? []).map((linha) => ({
      ...linha,
      barraca: BARRACAS.find((barraca) => barraca.id === linha.barraca),
    })),
  );

  /**
   * Enquanto o telão faz a revelação (3º, 2º, tambor, campeã), a feira de cada um não mostra o
   * resultado: assim ninguém descobre a campeã pelo notebook antes do telão.
   */
  private reveladoEm = signal<number | null>(null);
  private reveladoAntes: boolean | undefined;

  private acompanharRevelacao = effect(() => {
    const revelado = this.feira.estado()?.resultadoRevelado;
    if (revelado === undefined) return;
    if (this.reveladoAntes === undefined) {
      this.reveladoEm.set(null);
    } else if (revelado && !this.reveladoAntes) {
      this.reveladoEm.set(this.feira.agora());
    } else if (!revelado) {
      this.reveladoEm.set(null);
    }
    this.reveladoAntes = revelado;
  });

  /** Verdadeiro durante a revelação no telão (mais 3 segundos, porque o telão consulta a cada 3). */
  protected olhemParaOTelao = computed(() => {
    const inicio = this.reveladoEm();
    if (inicio === null) return false;
    return (this.feira.agora() - inicio) / 1000 < duracaoDaRevelacao(this.resultado()) + 3;
  });

  protected equipeDe(barracaId: string): string {
    const equipe = this.feira.estado()?.equipes.find((e) => e.id === barracaId);
    return (equipe?.membros ?? []).map((membro) => membro.nome).join(' · ');
  }

  protected fichasQueDei(barracaId: string): number {
    return this.feira.fichas()?.porBarraca[barracaId] ?? 0;
  }
}
