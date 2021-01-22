import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnPrepareRoutingModule, LearnPlayingRoutingModule } from './learn-routing.module'
import { PrepareDataComponent } from './prepare-data/prepare-data.component'
import { PlayingModelComponent } from './playing-model/playing-model.component'

import { ButtonComponent } from '../components/button/button.component';

@NgModule({
  declarations: [
    PrepareDataComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    LearnPrepareRoutingModule
  ]
})
export class LearnPrepareModule { }
@NgModule({
  declarations: [
    PlayingModelComponent
  ],
  imports: [
    CommonModule,
    LearnPlayingRoutingModule
  ]
})
export class LearnPlayingModule { }
