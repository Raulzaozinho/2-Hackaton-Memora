import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BARRACAS, BARRACA_MODELO } from '../barracas/registro';
import { FeiraService, corDoTexto, formatarRelogio } from './feira.service';
import { classificarResultado } from './resultado';

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

  /** O resultado com o nome e o emoji de cada barraca, depois que a organização revela. */
  protected resultado = computed(() =>
    classificarResultado(this.feira.estado()?.resultado ?? []).map((linha) => ({
      ...linha,
      barraca: BARRACAS.find((barraca) => barraca.id === linha.barraca),
    })),
  );

  protected equipeDe(barracaId: string): string {
    const equipe = this.feira.estado()?.equipes.find((e) => e.id === barracaId);
    return (equipe?.membros ?? []).map((membro) => `${membro.emoji} ${membro.nome}`).join(' · ');
  }

  protected fichasQueDei(barracaId: string): number {
    return this.feira.fichas()?.porBarraca[barracaId] ?? 0;
  }
}
