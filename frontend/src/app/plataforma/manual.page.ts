import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BARRACAS } from '../barracas/registro';
import { FeiraService, corDoTexto, formatarRelogio } from './feira.service';
import { MANUAL, NIVEIS, ItemDoManual, cicloDoManual, paraEquipe, pontosPossiveis } from './manual';

const NOMES_DOS_PAPEIS: Record<string, string> = {
  piloto: 'piloto: fique só no editor de código',
  reporter: 'repórter: fique só no painel do repórter',
  apoio: 'apoio',
};

/**
 * O manual do copiloto. Só o copiloto do ciclo (e a organização) consegue abrir.
 * Mostra as missões do ciclo atual, com os pontos de cada item e o código para ditar ao piloto.
 */
@Component({
  selector: 'app-manual-page',
  imports: [RouterLink],
  templateUrl: './manual.page.html',
  styleUrl: './manual.page.css',
})
export class ManualPage {
  protected feira = inject(FeiraService);
  protected niveis = NIVEIS;
  protected manual = MANUAL;
  protected barracas = BARRACAS;
  protected corDoTexto = corDoTexto;

  protected relogio = computed(() => formatarRelogio(this.feira.segundosRestantes()));
  protected etapa = computed(() => this.feira.estado()?.etapa ?? null);

  /** A organização escolhe qual equipe e qual ciclo quer ver. */
  protected equipeEscolhida = signal('equipe-1');
  protected cicloEscolhido = signal<number | null>(null);

  protected ehOrganizacao = computed(() => !!this.feira.organizador());

  protected minhaEquipe = computed(() => {
    if (this.ehOrganizacao()) return this.equipeEscolhida();
    return this.feira.eu()?.equipe ?? null;
  });

  protected meuPapel = computed(() => {
    const eu = this.feira.eu();
    const equipe = this.feira.estado()?.equipes.find((e) => e.id === eu?.equipe);
    return equipe?.membros.find((m) => m.slug === eu?.slug)?.papel ?? null;
  });

  protected numeroDoCiclo = computed(() => this.cicloEscolhido() ?? this.etapa()?.rodada ?? 0);
  protected ciclo = computed(() => cicloDoManual(this.numeroDoCiclo()));

  /** Quem pode ler: o copiloto do ciclo atual ou a organização. */
  protected podeLer = computed(() => this.ehOrganizacao() || (this.meuPapel() === 'copiloto' && !!this.ciclo()));

  protected motivoDoBloqueio = computed(() => {
    if (!this.feira.eu()) return 'Entre com o seu e-mail na página da feira para abrir o manual.';
    if (!this.feira.eu()?.equipe) return 'Você ainda não está numa equipe. A organização monta as equipes na abertura.';
    if (!this.ciclo()) return 'O manual abre na aula de cada ciclo. Agora não há missão em andamento.';
    const papel = this.meuPapel();
    return papel ? `Este manual é do copiloto. Neste ciclo você é ${NOMES_DOS_PAPEIS[papel] ?? papel}.` : 'Este manual é do copiloto.';
  });

  protected barraca = computed(() => BARRACAS.find((b) => b.id === this.minhaEquipe()) ?? null);
  protected pontosDaEquipe = computed(
    () => this.feira.estado()?.equipes.find((e) => e.id === this.minhaEquipe())?.pontosDoManual ?? 0,
  );
  protected possiveis = computed(() => (this.ciclo() ? pontosPossiveis(this.ciclo()!) : 0));

  /** O copiloto vai marcando o que o piloto já fez. Fica só neste computador; quem dá os pontos é a organização. */
  protected marcados = signal<Set<string>>(new Set());
  protected pontosMarcados = computed(() =>
    (this.ciclo()?.itens ?? []).filter((i) => this.marcado(i)).reduce((s, i) => s + i.pontos, 0),
  );

  constructor() {
    this.marcados.set(lerMarcados());
  }

  protected texto(valor: string): string {
    return paraEquipe(valor, this.minhaEquipe() ?? 'equipe-N');
  }

  protected numero(indice: number): string {
    return String(indice + 1).padStart(2, '0');
  }

  protected alternar(item: ItemDoManual) {
    const chave = `${this.minhaEquipe()}:${item.id}`;
    const novos = new Set(this.marcados());
    if (novos.has(chave)) novos.delete(chave);
    else novos.add(chave);
    this.marcados.set(novos);
    try {
      localStorage.setItem('feira.manual', JSON.stringify([...novos]));
    } catch {
      // Sem armazenamento, as marcações valem até recarregar a página.
    }
  }

  protected marcado(item: ItemDoManual): boolean {
    return this.marcados().has(`${this.minhaEquipe()}:${item.id}`);
  }
}

function lerMarcados(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem('feira.manual') ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}
