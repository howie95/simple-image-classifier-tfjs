import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'prepare', loadChildren: () => import('./learn/learn.module').then(m => m.LearnPrepareModule) },
  { path: 'playing', loadChildren: () => import('./learn/learn.module').then(m => m.LearnPlayingModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
