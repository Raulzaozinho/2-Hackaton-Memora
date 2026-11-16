import { Component, computed, inject } from '@angular/core';
import { BARRACAS } from '../barracas/registro';
import { FeiraService, corDoTexto, formatarRelogio } from './feira.service';
import { Membro } from './tipos';
import { classificarResultado } from './resultado';
import { perguntaDoCiclo } from './perguntas';

/** Nos 3 ciclos vale o modo cego: cada papel enxerga só uma parte (docs/papeis.md). */
const PAPEIS: Record<string, string> = {
  piloto: '⌨️ Piloto · só o código',
  copiloto: '🧭 Copiloto · só o manual',
  reporter: '📣 Repórter · só o resultado',
  apoio: '🤝 Apoio',
};

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

  /** O relógio da carta de evento, que tem a própria duração. */
  protected relogioDaCarta = computed(() => {
    const termina = this.feira.estado()?.carta?.terminaEm;
    if (!termina) return '';
    return formatarRelogio(Math.max(0, Math.round((Date.parse(termina) - this.feira.agora()) / 1000)));
  });

  protected pergunta = computed(() => {
    const estado = this.feira.estado();
    return estado ? perguntaDoCiclo(estado.etapa.rodada, estado.pergunta) : null;
  });

  /** Cada barraca junto com a equipe dela e a última entrega recebida. */
  protected equipes = computed(() => {
    const estado = this.feira.estado();
    return BARRACAS.map((barraca) => {
      const equipe = estado?.equipes.find((e) => e.id === barraca.id);
      return {
        barraca,
        membros: equipe?.membros ?? [],
        entrega: equipe?.ultimaEntrega ?? null,
        entregas: equipe?.entregas ?? 0,
        pontos: (equipe?.pontosDoManual ?? 0) + (equipe?.pontosExtras ?? 0),
        sequencia: equipe?.sequencia ?? 0,
      };
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
    return membro.papel ? PAPEIS[membro.papel] : '';
  }

  protected haQuanto(quando: string): string {
    const minutos = Math.floor((this.feira.agora() - Date.parse(quando)) / 60000);
    if (minutos < 1) {
      return 'agora há pouco';
    }
    return minutos < 60 ? `há ${minutos} min` : `há ${Math.floor(minutos / 60)} h`;
  }
}
