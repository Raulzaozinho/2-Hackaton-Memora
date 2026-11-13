// Os formatos dos dados que vão e voltam entre o front e o back-end.
// Cada interface aqui tem uma classe ou record com os mesmos campos no Java.

/** Uma coisa que a barraca oferece. No Java: barracas/Item.java */
export interface Item {
  emoji: string;
  nome: string;
  descricao: string;
}

/** Algo que a barraca guardou no banco. No Java: plataforma/Registro.java */
export interface Registro {
  id: number;
  barraca: string;
  autor: string | null;
  texto: string;
  detalhe: string | null;
  numero: number | null;
  criadoEm: string;
}

/** O que o front manda para guardar um registro. Só o texto é obrigatório. */
export interface NovoRegistro {
  texto: string;
  autor?: string | null;
  detalhe?: string | null;
  numero?: number | null;
}

export interface Cracha {
  slug: string;
  nome: string;
  emoji: string;
  frase: string | null;
  equipe: string | null;
}

export interface EtapaInfo {
  codigo: string;
  titulo: string;
  minutos: number;
  rodada: number;
  quadro: string | null;
  entrega: string;
}

export interface Membro {
  slug: string;
  nome: string;
  emoji: string;
  papel: 'piloto' | 'copiloto' | 'reporter' | 'apoio' | null;
}

export interface EntregaInfo {
  ok: boolean;
  mensagem: string;
  autor: string | null;
  quando: string;
}

export interface EquipeInfo {
  id: string;
  membros: Membro[];
  ultimaEntrega: EntregaInfo | null;
  entregas: number;
}

export interface Placar {
  barraca: string;
  fichas: number;
}

export interface EstadoDaFeira {
  etapa: EtapaInfo;
  etapas: EtapaInfo[];
  terminaEm: string | null;
  agora: string;
  feiraAberta: boolean;
  resultadoRevelado: boolean;
  equipes: EquipeInfo[];
  fichasGastas: number;
  fichasTotal: number;
  resultado: Placar[] | null;
  endereco: string | null;
  /** Muda quando o telão recebe um front novo. Nulo quando se roda com "npm start". */
  versaoDoFront: number | null;
}

export interface MinhasFichas {
  restantes: number;
  total: number;
  porBarraca: Record<string, number>;
}
