import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Item, NovoRegistro, Registro } from './tipos';

/**
 * O caminho pronto entre a barraca (front) e o back-end.
 *
 * Cada função faz um PEDIDO e devolve a RESPOSTA quando ela chegar. Por isso se usa
 * `.subscribe(...)`: "quando a resposta chegar, faça isto com ela". Exemplo:
 *
 *   this.api.itens('equipe-1').subscribe((lista) => this.itens.set(lista));
 */
@Injectable({ providedIn: 'root' })
export class BarracaApi {
  private http = inject(HttpClient);

  /** CICLO 2 — pede a lista de itens da barraca. GET /api/barracas/{barraca}/itens */
  itens(barraca: string) {
    return this.http.get<Item[]>(`/api/barracas/${barraca}/itens`);
  }

  /** CICLO 3 — pede o que a barraca já guardou, do mais novo para o mais antigo. */
  registros(barraca: string) {
    return this.http.get<Registro[]>(`/api/barracas/${barraca}/registros`);
  }

  /** CICLO 3 — guarda um registro novo no banco. POST /api/barracas/{barraca}/registros */
  salvar(barraca: string, registro: NovoRegistro) {
    return this.http.post<Registro>(`/api/barracas/${barraca}/registros`, registro);
  }

  /** CICLO 1 e 3 — chama um endpoint que a própria equipe criou. Ex.: buscar<Item>('modelo', 'surpresa') */
  buscar<T>(barraca: string, caminho: string) {
    return this.http.get<T>(`/api/barracas/${barraca}/${caminho}`);
  }

  /** Extra — manda dados para um endpoint que a própria equipe criou. */
  enviar<T>(barraca: string, caminho: string, dados: unknown) {
    return this.http.post<T>(`/api/barracas/${barraca}/${caminho}`, dados);
  }
}

/** Transforma um erro do back-end em uma frase que dá para mostrar na tela. */
export function mensagemDeErro(erro: unknown): string {
  const resposta = erro as { status?: number; error?: { mensagem?: string } };
  if (resposta?.error?.mensagem) {
    return resposta.error.mensagem;
  }
  if (resposta?.status === 404) {
    return 'O back-end não tem esse endereço (erro 404). O nome do caminho está certo?';
  }
  return 'Não deu certo. O back-end está rodando?';
}
