import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Cracha, EstadoDaFeira, MinhasFichas } from './tipos';

const CHAVE_QUEM_SOU = 'feira.quem-sou';

/** O estado do dia (etapa, relógio, equipes), quem está usando esta tela e as fichas dessa pessoa. */
@Injectable({ providedIn: 'root' })
export class FeiraService {
  private http = inject(HttpClient);

  readonly estado = signal<EstadoDaFeira | null>(null);
  readonly participantes = signal<Cracha[]>([]);
  readonly fichas = signal<MinhasFichas | null>(null);
  readonly semConexao = signal(false);

  /** O crachá de quem está usando esta tela, escolhido na página da feira. */
  readonly euSlug = signal<string | null>(lerGuardado());
  readonly eu = computed(() => this.participantes().find((p) => p.slug === this.euSlug()) ?? null);
  /** O nome de quem está usando a tela, ou "Visitante" se a pessoa ainda não escolheu o crachá. */
  readonly meuNome = computed(() => this.eu()?.nome ?? 'Visitante');

  /** A hora atual, acertada pela hora do servidor para todos os relógios baterem. */
  readonly agora = signal(Date.now());
  private diferencaParaOServidor = 0;
  private versaoDoFront: number | null | undefined;

  readonly segundosRestantes = computed(() => {
    const terminaEm = this.estado()?.terminaEm;
    if (!terminaEm) {
      return null;
    }
    return Math.max(0, Math.round((Date.parse(terminaEm) - this.agora()) / 1000));
  });

  constructor() {
    this.atualizar();
    const consulta = setInterval(() => this.atualizar(), 3000);
    const relogio = setInterval(() => this.agora.set(Date.now() + this.diferencaParaOServidor), 500);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(consulta);
      clearInterval(relogio);
    });
  }

  atualizar() {
    this.http.get<EstadoDaFeira>('/api/feira/estado').subscribe({
      next: (estado) => {
        this.recarregarSeHouverFrontNovo(estado.versaoDoFront);
        this.diferencaParaOServidor = Date.parse(estado.agora) - Date.now();
        this.estado.set(estado);
        this.semConexao.set(false);
      },
      error: () => this.semConexao.set(true),
    });
    this.http.get<Cracha[]>('/api/participantes').subscribe({
      next: (lista) => this.participantes.set(lista),
      error: () => undefined,
    });
    this.atualizarFichas();
  }

  escolherQuemSou(slug: string | null) {
    this.fichas.set(null);
    this.euSlug.set(slug || null);
    try {
      if (slug) {
        localStorage.setItem(CHAVE_QUEM_SOU, slug);
      } else {
        localStorage.removeItem(CHAVE_QUEM_SOU);
      }
    } catch {
      // Sem armazenamento local a escolha vale só até recarregar a página.
    }
    this.atualizarFichas();
  }

  darFicha(barraca: string) {
    const participante = this.euSlug();
    return this.http
      .post<MinhasFichas>('/api/fichas', { participante, barraca })
      .pipe(tap((fichas) => {
        if (this.euSlug() === participante) this.fichas.set(fichas);
      }));
  }

  devolverFicha(barraca: string) {
    const participante = this.euSlug();
    return this.http
      .delete<MinhasFichas>('/api/fichas', { params: { participante: participante ?? '', barraca } })
      .pipe(tap((fichas) => {
        if (this.euSlug() === participante) this.fichas.set(fichas);
      }));
  }

  /** Quando o telão aceita a entrega de uma equipe, o front muda: as telas abertas se recarregam sozinhas. */
  private recarregarSeHouverFrontNovo(versao: number | null) {
    if (this.versaoDoFront === undefined) {
      this.versaoDoFront = versao;
    } else if (versao !== null && versao !== this.versaoDoFront) {
      location.reload();
    }
  }

  private atualizarFichas() {
    const eu = this.euSlug();
    if (!eu) {
      this.fichas.set(null);
      return;
    }
    this.http.get<MinhasFichas>('/api/fichas', { params: { participante: eu } }).subscribe({
      next: (fichas) => {
        // Uma consulta do crachá anterior pode chegar depois da troca de pessoa.
        if (this.euSlug() === eu) this.fichas.set(fichas);
      },
      error: () => undefined,
    });
  }
}

function lerGuardado(): string | null {
  try {
    return localStorage.getItem(CHAVE_QUEM_SOU);
  } catch {
    return null;
  }
}

/** 125 segundos viram "02:05". */
export function formatarRelogio(segundos: number | null): string {
  if (segundos === null) {
    return '--:--';
  }
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  return `${String(minutos).padStart(2, '0')}:${String(resto).padStart(2, '0')}`;
}

/** Escolhe texto claro ou escuro para ficar legível em cima de uma cor de fundo como "#e4572e". */
export function corDoTexto(corDeFundo: string): string {
  const hex = /^#?([0-9a-f]{6})$/i.exec(corDeFundo.trim())?.[1];
  if (!hex) {
    return '#2b2118';
  }
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const luminosidade = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminosidade > 0.6 ? '#2b2118' : '#ffffff';
}
