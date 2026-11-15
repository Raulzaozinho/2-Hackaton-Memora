import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FeiraService } from './feira.service';
import { OrganizacaoPage } from './organizacao.page';

describe('placar privado da organização', () => {
  it('acompanha a votação sem precisar clicar em outro comando', () => {
    sessionStorage.setItem('feira.pin', 'feira');
    const estado = signal({ fichasGastas: 0 });
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: FeiraService, useValue: { estado } }],
    });
    TestBed.overrideComponent(OrganizacaoPage, { set: { template: '' } });
    const fixture = TestBed.createComponent(OrganizacaoPage);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('/api/organizacao/conferir').flush(null);
    fixture.detectChanges();
    for (const request of http.match('/api/organizacao/resultado')) {
      expect(request.request.headers.get('X-Pin')).toBe('feira');
      request.flush([{ barraca: 'equipe-2', pontosDoManual: 0, fichas: 0, total: 0 }]);
    }
    estado.set({ fichasGastas: 2 });
    fixture.detectChanges();
    http.expectOne('/api/organizacao/resultado').flush([{ barraca: 'equipe-2', pontosDoManual: 0, fichas: 2, total: 10 }]);
    expect(fixture.componentInstance['placar']()[0].fichas).toBe(2);
    http.verify();
    fixture.destroy();
    sessionStorage.clear();
  });
});
