import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BARRACAS } from '../barracas/registro';
import { mensagemDeErro } from './barraca-api';
import { FeiraService, formatarRelogio } from './feira.service';
import { MANUAL, cicloDoManual, ItemDoManual } from './manual';
import { perguntaDoCiclo } from './perguntas';
import { AjusteFeito, EstadoDaFeira, ItemAprovado, Placar } from './tipos';

const CHAVE_PIN = 'feira.pin';

/** As cartas de evento (as mesmas do back-end, em Carta.java). */
const CARTAS = [
  { codigo: 'MUDO', nome: '🤐 Copiloto mudo' },
  { codigo: 'TROCA', nome: '🔄 Troca relâmpago' },
  { codigo: 'BONUS', nome: '⚡ Bônus relâmpago' },
  { codigo: 'ECO', nome: '🦜 Modo papagaio' },
  { codigo: 'SIM_OU_NAO', nome: '🎯 Sim ou não' },
  { codigo: 'PRESENTE', nome: '🎁 Espiada de presente' },
  { codigo: 'TELEFONE', nome: '📞 Telefone sem fio' },
  { codigo: 'NARRADOR', nome: '🎙️ Narrador de futebol' },
  { codigo: 'CAMERA_LENTA', nome: '🐢 Câmera lenta' },
  { codigo: 'DETETIVE', nome: '🕵️ Detetive' },
  { codigo: 'VIZINHO', nome: '🤝 Ajuda do vizinho' },
  { codigo: 'PLANTAO', nome: '📢 Plantão de notícias' },
  { codigo: 'SORTE', nome: '🍀 Sorte de principiante' },
  { codigo: 'VISUAL', nome: '🎨 Visual relâmpago (+10)' },
  { codigo: 'ELOGIO', nome: '💬 Pausa para o elogio' },
];

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
  /** Verdadeiro enquanto uma ação da organização vai ao servidor (com o Supabase leva uns 2 segundos). */
  protected ocupado = signal(false);
  /** Quantas marcações da avaliação ainda estão indo ao servidor. */
  private marcacoesPendentes = 0;
  protected dentro = signal(false);
  protected aviso = signal('');
  protected placar = signal<Placar[]>([]);
  protected relogio = computed(() => formatarRelogio(this.feira.segundosRestantes()));

  // Avaliação: a organização confere na feira cada item do manual e marca o que a equipe cumpriu.
  protected manual = MANUAL;
  protected cicloEscolhido = signal<number | null>(null);
  protected cicloAvaliado = computed(() => this.cicloEscolhido() ?? (this.feira.estado()?.etapa?.rodada || 1));
  protected itensDoCiclo = computed(() => cicloDoManual(this.cicloAvaliado())?.itens ?? []);
  protected aprovados = signal<ItemAprovado[]>([]);
  private cicloCarregado: number | null = null;

  // Dinâmicas: cartas de evento, pontos fora do manual e a pergunta relâmpago.
  protected cartas = CARTAS;
  protected ajustes = signal<AjusteFeito[]>([]);
  protected perguntaAtual = computed(() => {
    const estado = this.feira.estado();
    return estado ? perguntaDoCiclo(estado.etapa?.rodada || this.cicloAvaliado(), estado.pergunta) : null;
  });

  /** O que a organização faz na etapa atual (o mesmo do roteiro do dia) e a seção do painel para isso. */
  protected passo = computed<{ tarefas: string[]; ir?: { id: string; rotulo: string } } | null>(() => {
    const etapa = this.feira.estado()?.etapa;
    if (!etapa) return null;
    const ciclo = etapa.rodada;
    switch (etapa.tipo) {
      case 'AULA':
        return {
          tarefas: [
            `Aula de 5 minutos do ciclo ${ciclo}: a comparação, o desenho, a mágica e a pergunta (roteiro do dia).`,
            ciclo > 1
              ? 'Os papéis já giraram no telão. Lembre o novo piloto: git pull e depois .\\piloto.cmd.'
              : 'Mostre a arrumação: o piloto no editor, o copiloto no manual, o repórter no painel.',
            'Terminou a aula? Próxima etapa: o relógio de 30 minutos começa.',
          ],
        };
      case 'MISSAO':
        return {
          tarefas: [
            'Circule pelas mesas e atenda os copos vermelhos. Fiscalize as espiadas (2 de 30 segundos por ciclo).',
            'Perto dos 15 minutos, sorteie uma carta de evento.',
            'Avise aos 20 e aos 25 minutos: só pontua o que entrar no telão.',
          ],
          ir: { id: 'dinamicas', rotulo: 'Ir para as dinâmicas' },
        };
      case 'AVALIACAO':
        return {
          tarefas: [
            'Mostre a pergunta relâmpago e dê +5 à equipe de quem responder primeiro.',
            'Abra cada barraca e marque os itens cumpridos. A linha "o repórter deve ver" do manual diz o que conferir.',
          ],
          ir: { id: 'avaliacao', rotulo: 'Ir para a avaliação' },
        };
      case 'VOTACAO':
        return {
          tarefas: [
            'Todos visitam as barracas das outras equipes e dão as 2 fichas.',
            'Acompanhe as fichas gastas no placar. Quando acabarem, Próxima etapa.',
          ],
          ir: { id: 'placar', rotulo: 'Ir para o placar' },
        };
      default:
        if (etapa.codigo === 'ABERTURA') {
          return {
            tarefas: [
              'Monte as equipes (ou sorteie). A ordem dentro da equipe define o rodízio.',
              'Peça para todos entrarem na feira com o e-mail: a página mostra o git switch da equipe de cada um.',
              'Diga as regras e mostre a barraca modelo. Depois, Próxima etapa.',
            ],
            ir: { id: 'equipes', rotulo: 'Ir para as equipes' },
          };
        }
        if (etapa.codigo === 'PREMIACAO') {
          return {
            tarefas: [
              'Cada pessoa diz uma frase com o que aprendeu hoje.',
              'Entregue os prêmios da organização: ideia mais criativa e melhor trabalho em equipe.',
              'Clique em Revelar no telão.',
            ],
            ir: { id: 'placar', rotulo: 'Ir para o placar' },
          };
        }
        return { tarefas: ['Intervalo de 10 minutos: bom momento para destravar quem ficou para trás.'] };
    }
  });

  protected irPara(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  constructor() {
    // O estado chega a cada três segundos. A distribuição também pode mudar
    // sem alterar o total de fichas, por isso consultamos a cada atualização.
    effect(() => {
      const estado = this.feira.estado();
      if (this.dentro() && estado) this.carregarPlacar();
    });
    effect(() => {
      const ciclo = this.cicloAvaliado();
      const rodada = this.feira.estado()?.etapa?.rodada ?? 0;
      const querVer = this.cicloEscolhido() !== null || rodada > 0;
      if (this.dentro() && querVer && ciclo !== this.cicloCarregado) this.carregarAvaliacoes(ciclo);
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

  /**
   * Ações que apagam ou trocam algo pedem um segundo clique na própria página.
   * Não usamos confirm(): alguns navegadores bloqueiam a janela e respondem "não" sozinhos.
   */
  protected confirmando = signal<'sortear' | 'recomecar' | null>(null);

  protected pedirConfirmacao(acao: 'sortear' | 'recomecar') {
    this.confirmando.set(acao);
  }

  protected cancelarConfirmacao() {
    this.confirmando.set(null);
  }

  protected sortear() {
    this.confirmando.set(null);
    this.chamar('POST', 'equipes/sortear');
  }

  protected definirEquipe(slug: string, equipe: string) {
    this.chamar('PUT', `participantes/${slug}/equipe`, { equipe: equipe || null });
  }

  protected revelar(revelado: boolean) {
    this.chamar('POST', 'resultado', { revelado });
  }

  protected recomecar() {
    this.confirmando.set(null);
    this.chamar('POST', 'recomecar');
  }

  protected nomeDaBarraca(id: string): string {
    const barraca = BARRACAS.find((b) => b.id === id);
    return barraca ? `${barraca.emoji} ${barraca.nome}` : id;
  }

  private chamar(metodo: 'POST' | 'PUT', caminho: string, corpo: unknown = {}) {
    if (this.ocupado()) return;
    this.ocupado.set(true);
    this.http
      .request<EstadoDaFeira>(metodo, `/api/organizacao/${caminho}`, { body: corpo, headers: this.cabecalho() })
      .subscribe({
        next: (estado) => {
          this.ocupado.set(false);
          this.feira.estado.set(estado);
          this.feira.atualizar();
          this.aviso.set('');
          this.carregarPlacar();
        },
        error: (erro) => {
          this.ocupado.set(false);
          this.aviso.set(mensagemDeErro(erro));
        },
      });
  }

  protected aprovado(equipe: string, item: ItemDoManual): boolean {
    return this.aprovados().some((a) => a.equipe === equipe && a.item === item.id);
  }

  protected pontosNoCiclo(equipe: string): number {
    return this.aprovados().filter((a) => a.equipe === equipe).reduce((soma, a) => soma + a.pontos, 0);
  }

  protected alternarItem(equipe: string, item: ItemDoManual) {
    const ciclo = this.cicloAvaliado();
    const feito = !this.aprovado(equipe, item);
    // Mostra na hora; a resposta do servidor confirma.
    this.aprovados.set(
      feito
        ? [...this.aprovados(), { equipe, ciclo, item: item.id, pontos: item.pontos }]
        : this.aprovados().filter((a) => !(a.equipe === equipe && a.item === item.id)),
    );
    this.marcacoesPendentes++;
    this.http
      .put<EstadoDaFeira>(
        '/api/organizacao/avaliacoes',
        { equipe, ciclo, item: item.id, pontos: item.pontos, feito },
        { headers: this.cabecalho() },
      )
      .subscribe({
        next: (estado) => {
          this.feira.estado.set(estado);
          // Com várias marcações seguidas, só confere com o servidor depois da última:
          // assim as caixinhas não piscam enquanto as outras ainda estão a caminho.
          if (--this.marcacoesPendentes === 0) {
            this.carregarAvaliacoes(ciclo);
            this.carregarPlacar();
          }
        },
        error: (erro) => {
          this.marcacoesPendentes--;
          this.aviso.set(mensagemDeErro(erro));
          this.carregarAvaliacoes(ciclo);
        },
      });
  }

  private carregarAvaliacoes(ciclo: number) {
    this.cicloCarregado = ciclo;
    this.http
      .get<ItemAprovado[]>('/api/organizacao/avaliacoes', { params: { ciclo }, headers: this.cabecalho() })
      .subscribe({
        next: (lista) => {
          if (this.cicloAvaliado() === ciclo && this.marcacoesPendentes === 0) this.aprovados.set(lista);
        },
        error: () => undefined,
      });
  }

  protected mostrarCarta(codigo: string | null) {
    this.chamar('POST', 'dinamicas/carta', { codigo });
  }

  protected tirarCarta() {
    this.chamar('POST', 'dinamicas/carta/encerrar');
  }

  protected ajustar(equipe: string, pontos: number, motivo: string) {
    this.chamar('POST', 'dinamicas/ajustes', { equipe, pontos, motivo });
  }

  protected desfazer(ajuste: AjusteFeito) {
    this.chamar('POST', `dinamicas/ajustes/${ajuste.id}/desfazer`);
  }

  protected pergunta(acao: 'proxima' | 'revelar' | 'esconder') {
    this.chamar('POST', `dinamicas/pergunta/${acao}`);
  }

  private carregarPlacar() {
    this.http.get<Placar[]>('/api/organizacao/resultado', { headers: this.cabecalho() }).subscribe({
      next: (placar) => this.placar.set(placar),
      error: () => undefined,
    });
    this.http.get<AjusteFeito[]>('/api/organizacao/dinamicas/ajustes', { headers: this.cabecalho() }).subscribe({
      next: (lista) => this.ajustes.set(lista),
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
