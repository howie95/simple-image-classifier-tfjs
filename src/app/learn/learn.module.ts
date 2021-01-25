import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnPrepareRoutingModule, LearnPlayingRoutingModule } from './learn-routing.module'
import { PrepareDataComponent } from './prepare-data/prepare-data.component'
import { PlayingModelComponent } from './playing-model/playing-model.component'

import { ComponentsModule } from '../components/components.module'

@NgModule({
  declarations: [
    PrepareDataComponent
  ],
  imports: [
    CommonModule,
    LearnPrepareRoutingModule,
    ComponentsModule
  ]
})
export class LearnPrepareModule { }
@NgModule({
  declarations: [
    PlayingModelComponent
  ],
  imports: [
    CommonModule,
    LearnPlayingRoutingModule,
    ComponentsModule
  ]
})
export class LearnPlayingModule { }
