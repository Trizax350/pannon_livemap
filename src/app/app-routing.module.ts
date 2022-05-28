import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';
import { ConntagsensorComponent } from './conntagsensor/conntagsensor.component';
import { MachineComponent } from './machine/machine.component';

const routes: Routes = [
  { path: 'conntagsensor', component: ConntagsensorComponent},
  { path: 'machine', component: MachineComponent},
  { path: 'livemap', component: MapComponent},
  { path: '', redirectTo: '/livemap', pathMatch: 'full'},
  { path: '**', component: MapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  ConntagsensorComponent, 
  MachineComponent
]