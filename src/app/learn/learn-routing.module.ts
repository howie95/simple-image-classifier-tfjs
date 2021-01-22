import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrepareDataComponent } from './prepare-data/prepare-data.component'
import { PlayingModelComponent } from './playing-model/playing-model.component'

const prepareRoutes: Routes = [
  {
    path: '',
    component: PrepareDataComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(prepareRoutes)],
  exports: [RouterModule]
})
export class LearnPrepareRoutingModule { }

const playingRoutes: Routes = [
  {
    path: '',
    component: PlayingModelComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(playingRoutes)],
  exports: [RouterModule]
})
export class LearnPlayingRoutingModule { }