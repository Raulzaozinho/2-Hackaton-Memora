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
        <a routerLink="/">← Voltar para a feira</a>
        <h1>🪪 Crachás</h1>
        <p>Quem já está na feira: {{ feira.participantes().length }} pessoas.</p>
      </header>

      <section class="mural">
        @for (pessoa of feira.participantes(); track pessoa.slug) {
          <article>
            <span class="emoji" aria-hidden="true">{{ pessoa.emoji }}</span>
            <h2>{{ pessoa.nome }}</h2>
            @if (pessoa.frase) {
              <p>“{{ pessoa.frase }}”</p>
            }
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
    .emoji {
      font-size: 3rem;
      line-height: 1;
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
