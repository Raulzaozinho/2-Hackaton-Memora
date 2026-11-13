import { NgComponentOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BARRACAS, acharBarraca } from '../barracas/registro';
import { mensagemDeErro } from './barraca-api';
import { FeiraService, corDoTexto } from './feira.service';

/**
 * A moldura em volta de cada barraca: a fachada em cima, a página da equipe no meio
 * e o balcão de fichas embaixo. As equipes não precisam mexer aqui.
 */
@Component({
  selector: 'app-barraca-page',
  imports: [NgComponentOutlet, RouterLink],
  templateUrl: './barraca.page.html',
  styleUrl: './barraca.page.css',
})
export class BarracaPage {
  protected feira = inject(FeiraService);
  private parametros = toSignal(inject(ActivatedRoute).paramMap);
  protected corDoTexto = corDoTexto;

  protected barraca = computed(() => acharBarraca(this.parametros()?.get('id') ?? null));
  protected recebeFichas = computed(() => BARRACAS.some((barraca) => barraca.id === this.barraca()?.id));
  protected ehDaMinhaEquipe = computed(() => !!this.barraca() && this.feira.eu()?.equipe === this.barraca()?.id);
  protected fichasQueDei = computed(() => this.feira.fichas()?.porBarraca[this.barraca()?.id ?? ''] ?? 0);
  protected aviso = signal('');

  protected dar() {
    this.feira.darFicha(this.barraca()!.id).subscribe({
      next: () => this.aviso.set(''),
      error: (erro) => this.aviso.set(mensagemDeErro(erro)),
    });
  }

  protected devolver() {
    this.feira.devolverFicha(this.barraca()!.id).subscribe({
      next: () => this.aviso.set(''),
      error: (erro) => this.aviso.set(mensagemDeErro(erro)),
    });
  }
}
