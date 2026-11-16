import { Component, computed, effect, inject, signal } from '@angular/core';
import { BARRACAS } from '../barracas/registro';
import { FeiraService, corDoTexto, formatarRelogio } from './feira.service';
import { Membro } from './tipos';
import { REVELACAO, classificarResultado, duracaoDaRevelacao, momentoDaPosicao } from './resultado';
import { LETRAS, perguntaDoCiclo } from './perguntas';
import { BugVisual, TipoDeBug, bugVisualDaCarta, trocarLetras } from './bugs';

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

  protected letras = LETRAS;
  // ---------------------------------------------------------------- a carta "Caça ao bug"
  protected trocarLetras = trocarLetras;

  /** O defeito escondido no telão enquanto a carta "Caça ao bug" está ativa. */
  protected bug = computed<BugVisual | null>(() => {
    const carta = this.feira.estado()?.carta;
    return carta?.codigo === 'CACA_BUG' ? bugVisualDaCarta(carta.terminaEm) : null;
  });

  protected temBug(tipo: TipoDeBug, equipe: number): boolean {
    const bug = this.bug();
    return bug?.tipo === tipo && bug.equipe === equipe;
  }

  /** A cor da barraca, ou a da barraca vizinha quando o defeito é a cor. */
  protected corDaBarraca(i: number): string {
    const lista = this.equipes();
    return lista[this.temBug('cor', i) ? (i + 1) % lista.length : i].barraca.cor;
  }

  protected pergunta = computed(() => {
    const estado = this.feira.estado();
    return estado ? perguntaDoCiclo(estado.etapa.rodada || 1, estado.pergunta) : null;
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
        dobro: estado?.pontosEmDobro?.includes(barraca.id) ?? false,
      };
    });
  });

  protected resultado = computed(() =>
    classificarResultado(this.feira.estado()?.resultado ?? []).map((linha) => ({
      ...linha,
      barraca: BARRACAS.find((barraca) => barraca.id === linha.barraca),
    })),
  );

  // ---------------------------------------------------------------- a revelação do vencedor
  /**
   * Quando a organização clica em "Revelar no telão", o telão mostra o 3º lugar, depois o 2º, um
   * tambor com contagem e só então a campeã, com confete. Se a página abrir com o resultado já
   * revelado (recarregou, por exemplo), mostra tudo de uma vez.
   */
  private reveladoEm = signal<number | null>(null);
  private reveladoAntes: boolean | undefined;

  private acompanharRevelacao = effect(() => {
    const revelado = this.feira.estado()?.resultadoRevelado;
    if (revelado === undefined) return;
    if (this.reveladoAntes === undefined) {
      this.reveladoEm.set(revelado ? 0 : null);
    } else if (revelado && !this.reveladoAntes) {
      this.reveladoEm.set(this.feira.agora());
    } else if (!revelado) {
      this.reveladoEm.set(null);
    }
    this.reveladoAntes = revelado;
  });

  /** Segundos desde o clique em "Revelar"; infinito quando a página abriu já revelada. */
  private segundosDaRevelacao = computed(() => {
    const inicio = this.reveladoEm();
    if (inicio === null) return 0;
    return inicio === 0 ? Number.POSITIVE_INFINITY : (this.feira.agora() - inicio) / 1000;
  });

  private duracao = computed(() => duracaoDaRevelacao(this.resultado()));

  protected fase = computed<'intro' | 'subindo' | 'tambor' | 'final'>(() => {
    const segundos = this.segundosDaRevelacao();
    const duracao = this.duracao();
    if (segundos >= duracao) return 'final';
    if (segundos < REVELACAO.intro) return 'intro';
    if (segundos >= duracao - REVELACAO.tambor) return 'tambor';
    return 'subindo';
  });

  /** 3, 2, 1 no tambor antes da campeã. */
  protected contagem = computed(() => Math.max(1, Math.ceil(this.duracao() - this.segundosDaRevelacao())));

  protected visivel(linha: { posicao: number }): boolean {
    return this.segundosDaRevelacao() >= momentoDaPosicao(linha.posicao, this.resultado());
  }

  /** Os pedacinhos de confete que caem quando a campeã aparece. */
  protected confete = Array.from({ length: 48 }, (_, i) => ({
    esquerda: (i * 37) % 100,
    atraso: (i % 12) * 0.25,
    duracao: 3 + (i % 5) * 0.6,
    emoji: ['🎉', '🎊', '✨', '⭐', '🏆', '🎈'][i % 6],
  }));

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
