import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'prepare', loadChildren: () => import('./learn/learn.module').then(m => m.LearnPrepareModule) },
  { path: 'playing', loadChildren: () => import('./learn/learn.module').then(m => m.LearnPlayingModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
