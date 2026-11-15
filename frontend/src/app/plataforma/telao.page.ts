import { Component, computed, inject } from '@angular/core';
import { BARRACAS } from '../barracas/registro';
import { FeiraService, corDoTexto, formatarRelogio } from './feira.service';
import { Membro } from './tipos';
import { classificarResultado } from './resultado';

/** Rodadas 1 a 3: modo cego, cada papel enxerga só uma parte (docs/papeis.md). */
const PAPEIS_NO_MODO_CEGO: Record<string, string> = {
  piloto: '⌨️ Piloto · só o código',
  copiloto: '🧭 Copiloto · só o cartão',
  reporter: '📣 Repórter · só o resultado',
  apoio: '🤝 Apoio',
};

/** Rodada 4: os três veem tudo. */
const PAPEIS_LIVRES: Record<string, string> = {
  piloto: '⌨️ Piloto · digita',
  copiloto: '🧭 Copiloto · orienta',
  reporter: '📣 Repórter · apresenta',
  apoio: '🤝 Apoio',
};

const ULTIMA_RODADA_DO_MODO_CEGO = 3;

/** A tela grande da sala: etapa, relógio, quem faz o quê em cada equipe e a última entrega de cada uma. */
@Component({
  selector: 'app-telao-page',
  templateUrl: './telao.page.html',
  styleUrl: './telao.page.css',
})
export class TelaoPage {
  protected feira = inject(FeiraService);
  protected corDoTexto = corDoTexto;

  protected relogio = computed(() => formatarRelogio(this.feira.segundosRestantes()));
  /** No último minuto o relógio muda de cor; no zero, pisca. */
  protected acabando = computed(() => {
    const segundos = this.feira.segundosRestantes();
    return segundos !== null && segundos <= 60;
  });
  protected esgotado = computed(() => this.feira.segundosRestantes() === 0);

  /** Cada barraca junto com a equipe dela e a última entrega recebida. */
  protected equipes = computed(() => {
    const estado = this.feira.estado();
    return BARRACAS.map((barraca) => {
      const equipe = estado?.equipes.find((e) => e.id === barraca.id);
      return { barraca, membros: equipe?.membros ?? [], entrega: equipe?.ultimaEntrega ?? null, entregas: equipe?.entregas ?? 0 };
    });
  });

  protected resultado = computed(() =>
    classificarResultado(this.feira.estado()?.resultado ?? []).map((linha) => ({
      ...linha,
      barraca: BARRACAS.find((barraca) => barraca.id === linha.barraca),
    })),
  );

  protected porcentagemDeFichas = computed(() => {
    const estado = this.feira.estado();
    return estado && estado.fichasTotal > 0 ? Math.round((estado.fichasGastas / estado.fichasTotal) * 100) : 0;
  });

  protected papel(membro: Membro): string {
    if (!membro.papel) {
      return '';
    }
    const rodada = this.feira.estado()?.etapa.rodada ?? 0;
    const papeis = rodada <= ULTIMA_RODADA_DO_MODO_CEGO ? PAPEIS_NO_MODO_CEGO : PAPEIS_LIVRES;
    return papeis[membro.papel];
  }

  protected haQuanto(quando: string): string {
    const minutos = Math.floor((this.feira.agora() - Date.parse(quando)) / 60000);
    if (minutos < 1) {
      return 'agora há pouco';
    }
    return minutos < 60 ? `há ${minutos} min` : `há ${Math.floor(minutos / 60)} h`;
  }
}
