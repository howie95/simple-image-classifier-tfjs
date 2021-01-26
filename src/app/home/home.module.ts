import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component'
import { ComponentsModule } from '../components/components.module'
import { HomeRoutingModule } from './home-routing.module'

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    HomeRoutingModule,
    ComponentsModule
  ]
})

export class HomeModule { }