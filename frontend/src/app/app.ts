import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** A casca do aplicativo: só mostra a página do endereço atual. As páginas estão em app.routes.ts. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {}
