import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BarracaApi, mensagemDeErro } from '../../plataforma/barraca-api';
import { FeiraService } from '../../plataforma/feira.service';
import { Item, Registro } from '../../plataforma/tipos';

/**
 * A página da barraca da EQUIPE 3. Esta pasta é de vocês: podem mexer em tudo aqui dentro.
 *
 * São três arquivos: este (.ts) guarda os dados e as ações, o .html diz o que aparece
 * na tela e o .css diz como aparece. Na dúvida, olhem a pasta "modelo", que está completa.
 */
@Component({
  selector: 'app-equipe-3',
  imports: [FormsModule],
  templateUrl: './equipe-3.html',
  styleUrl: './equipe-3.css',
})
export class Equipe3 {
  // Ferramentas prontas da plataforma.
  private api = inject(BarracaApi); // conversa com o back-end
  private feira = inject(FeiraService); // sabe quem está usando a tela: this.feira.meuNome()

  // CICLO 1 — as caixinhas do primeiro ciclo (curtidas e destaque) entram aqui.

  // CICLO 2 — a lista de itens que vem do back-end entra aqui.
  itens = signal<Item[]>([]);

  // CICLO 3 — o recado do visitante e a pescaria entram aqui.

recado = signal('');
recados = signal<Registro[]>([]);

carregarRecados(){
  this.api.registros('equipe-3').subscribe((lista) =>this.recados.set(lista))
}

cadastrarRecado(){
  const novo = {autor:this.feira.meuNome(),texto:this.recado()};
  this.api.salvar('equipe-3', novo).subscribe(()=>{this.recado.set('')})
  this.carregarRecados();
}

  constructor() {
    this.api.itens('equipe-3').subscribe((lista)=> this.itens.set(lista));
    // O que precisa ser buscado assim que a barraca abre entra aqui dentro
    this.carregarRecados();
  }
}
