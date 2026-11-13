import { Type } from '@angular/core';

/** O que cada equipe define no seu barraca.config.ts. Aparece no mapa da feira e no telão. */
export interface ConfigDaBarraca {
  /** O nome da barraca, com até 30 letras. */
  nome: string;
  /** Uma frase curta para chamar visitantes. */
  slogan: string;
  /** Um emoji que represente a barraca. */
  emoji: string;
  /** A cor da barraca em hexadecimal, como "#e4572e". */
  cor: string;
}

/** A barraca completa, como a plataforma enxerga: a configuração mais a página da equipe. */
export interface Barraca extends ConfigDaBarraca {
  id: string;
  componente: Type<unknown>;
}
