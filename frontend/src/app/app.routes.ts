import { Routes } from '@angular/router';
import { BarracaPage } from './plataforma/barraca.page';
import { CrachasPage } from './plataforma/crachas.page';
import { FeiraPage } from './plataforma/feira.page';
import { OrganizacaoPage } from './plataforma/organizacao.page';
import { TelaoPage } from './plataforma/telao.page';

export const routes: Routes = [
  { path: '', component: FeiraPage, title: 'Feira Dev' },
  { path: 'barraca/:id', component: BarracaPage, title: 'Feira Dev · Barraca' },
  { path: 'crachas', component: CrachasPage, title: 'Feira Dev · Crachás' },
  { path: 'telao', component: TelaoPage, title: 'Feira Dev · Telão' },
  { path: 'organizacao', component: OrganizacaoPage, title: 'Feira Dev · Organização' },
  { path: '**', redirectTo: '' },
];
