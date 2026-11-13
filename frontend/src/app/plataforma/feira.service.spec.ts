import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FeiraService } from './feira.service';

describe('troca de crachá durante uma consulta', () => {
  let service: FeiraService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FeiraService);
    http.expectOne('/api/feira/estado').flush({ agora: new Date().toISOString(), versaoDoFront: null });
    http.expectOne('/api/participantes').flush([]);
  });

  afterEach(() => {
    http.verify();
    TestBed.resetTestingModule();
    localStorage.clear();
  });

  it('ignora o saldo atrasado da pessoa anterior', () => {
    service.escolherQuemSou('ana');
    const anterior = http.expectOne('/api/fichas?participante=ana');
    service.escolherQuemSou('bruno');
    const atual = http.expectOne('/api/fichas?participante=bruno');
    atual.flush({ restantes: 2, total: 5, porBarraca: { 'equipe-1': 3 } });
    anterior.flush({ restantes: 5, total: 5, porBarraca: {} });
    expect(service.fichas()?.restantes).toBe(2);
  });

  it('não restaura fichas depois de voltar a ser visitante', () => {
    service.escolherQuemSou('ana');
    const anterior = http.expectOne('/api/fichas?participante=ana');
    service.escolherQuemSou(null);
    anterior.flush({ restantes: 5, total: 5, porBarraca: {} });
    expect(service.fichas()).toBeNull();
  });

  it('não aplica o resultado de um voto ao crachá que foi escolhido depois', () => {
    service.escolherQuemSou('ana');
    http.expectOne('/api/fichas?participante=ana').flush({ restantes: 5, total: 5, porBarraca: {} });
    service.darFicha('equipe-2').subscribe();
    const voto = http.expectOne('/api/fichas');
    service.escolherQuemSou('bruno');
    http.expectOne('/api/fichas?participante=bruno').flush({ restantes: 2, total: 5, porBarraca: {} });
    voto.flush({ restantes: 4, total: 5, porBarraca: { 'equipe-2': 1 } });
    expect(service.fichas()?.restantes).toBe(2);
  });
});
