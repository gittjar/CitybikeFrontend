import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapscreenComponent } from './mapscreen/mapscreen.component';
import { BiketripsComponent } from './biketrips/biketrips.component';

const routes: Routes = [
  { path: 'mapscreen', component: MapscreenComponent },
  { path: 'biketrips', component: BiketripsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
