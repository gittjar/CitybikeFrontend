import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { MapscreenComponent } from './mapscreen/mapscreen.component';
import { BiketripsComponent } from './biketrips/biketrips.component';

@NgModule({
  declarations: [
    AppComponent,
    MapscreenComponent,
    BiketripsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
