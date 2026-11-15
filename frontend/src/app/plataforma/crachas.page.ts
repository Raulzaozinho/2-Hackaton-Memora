import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeiraService } from './feira.service';

/** O mural de crachás. É aqui que cada pessoa confere se o crachá dela entrou (Missão Zero). */
@Component({
  selector: 'app-crachas-page',
  imports: [RouterLink],
  template: `
    <div class="bandeirinhas" aria-hidden="true"></div>
    <main class="pagina">
      <header>
        <a class="voltar-feira" routerLink="/">← Voltar para a feira</a>
        <h1>🪪 Crachás</h1>
        <p>Quem já está na feira: {{ feira.participantes().length }} pessoas.</p>
      </header>

      <section class="mural">
        @for (pessoa of feira.participantes(); track pessoa.slug) {
          <article>
            <span class="inicial" aria-hidden="true">{{ pessoa.nome.charAt(0) }}</span>
            <h2>{{ pessoa.nome }}</h2>
            <small>{{ pessoa.slug }}.json</small>
          </article>
        } @empty {
          <p class="aviso">
            Nenhum crachá ainda. Crie o seu em <code>backend/src/main/resources/crachas</code> e reinicie o back-end.
          </p>
        }
      </section>
    </main>
  `,
  styles: `
    header {
      display: grid;
      gap: 6px;
    }
    .mural {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    article {
      display: grid;
      gap: 4px;
      justify-items: center;
      text-align: center;
      padding: 18px 14px;
      border-radius: var(--raio);
      background: var(--cartao);
      border: 2px solid var(--linha);
    }
    .inicial {
      display: grid;
      place-items: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--tinta, #2b211a);
      color: var(--cartao, #fff);
      font-size: 1.8rem;
      font-weight: 700;
    }
    h2 {
      font-size: 1.2rem;
      overflow-wrap: anywhere;
    }
    small {
      color: var(--tinta-suave);
    }
    .aviso {
      grid-column: 1 / -1;
    }
  `,
})
export class CrachasPage {
  protected feira = inject(FeiraService);
}
