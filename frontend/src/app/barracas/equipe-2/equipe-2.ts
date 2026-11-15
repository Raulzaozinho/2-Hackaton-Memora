import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarracaApi, mensagemDeErro } from '../../plataforma/barraca-api';
import { FeiraService } from '../../plataforma/feira.service';
import { Item, Registro } from '../../plataforma/tipos';

/**
 * A página da barraca da EQUIPE 2. Esta pasta é de vocês: podem mexer em tudo aqui dentro.
 *
 * São três arquivos: este (.ts) guarda os dados e as ações, o .html diz o que aparece
 * na tela e o .css diz como aparece. Na dúvida, olhem a pasta "modelo", que está completa.
 */
@Component({
  selector: 'app-equipe-2',
  imports: [FormsModule],
  templateUrl: './equipe-2.html',
  styleUrl: './equipe-2.css',
})
export class Equipe2 {
  // Ferramentas prontas da plataforma.
  private api = inject(BarracaApi); // conversa com o back-end
  private feira = inject(FeiraService); // sabe quem está usando a tela: this.feira.meuNome()

  // CICLO 2 — a lista de itens que vem do back-end entra aqui.

  // CICLO 3 — o que o visitante digita e a lista do que já foi gravado entram aqui.

  // CICLO 3 · DESAFIO — a atração de vocês!
}
