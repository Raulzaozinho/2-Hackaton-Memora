// A lista de todas as barracas da feira. Este arquivo é da organização: as equipes não precisam mexer aqui.
import { Barraca } from './barraca';
import { EQUIPE_1 } from './equipe-1/barraca.config';
import { Equipe1 } from './equipe-1/equipe-1';
import { EQUIPE_2 } from './equipe-2/barraca.config';
import { Equipe2 } from './equipe-2/equipe-2';
import { EQUIPE_3 } from './equipe-3/barraca.config';
import { Equipe3 } from './equipe-3/equipe-3';
import { MODELO } from './modelo/barraca.config';
import { Modelo } from './modelo/modelo';

/** As barracas das equipes, que recebem fichas na feira. */
export const BARRACAS: Barraca[] = [
  { id: 'equipe-1', ...EQUIPE_1, componente: Equipe1 },
  { id: 'equipe-2', ...EQUIPE_2, componente: Equipe2 },
  { id: 'equipe-3', ...EQUIPE_3, componente: Equipe3 },
];

/** A barraca de consulta, feita pela organização. Não recebe fichas. */
export const BARRACA_MODELO: Barraca = { id: 'modelo', ...MODELO, componente: Modelo };

export function acharBarraca(id: string | null): Barraca | null {
  return [...BARRACAS, BARRACA_MODELO].find((barraca) => barraca.id === id) ?? null;
}
