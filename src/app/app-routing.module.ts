import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapscreenComponent } from './mapscreen/mapscreen.component';
import { BiketripsComponent } from './biketrips/biketrips.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { StationDetailsComponent } from './station-details/station-details.component';

const routes: Routes = [
  { path: 'mapscreen', component: MapscreenComponent },
  { path: 'biketrips', component: BiketripsComponent },
  { path: 'mainpage', component: MainpageComponent },
  { path: 'station-details/:id', component: StationDetailsComponent},
  { path: '', redirectTo: '/mainpage', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
