import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { MapscreenComponent } from './mapscreen/mapscreen.component';
import { BiketripsComponent } from './biketrips/biketrips.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GoogleMapsModule } from '@angular/google-maps';




// locale

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFi from '@angular/common/locales/fi';

import { CustomFilterPipe } from './custom-filter-pipe.pipe'; // search filter
import { MainpageComponent } from './mainpage/mainpage.component';
import { StationDetailsComponent } from './station-details/station-details.component';
import { LoadingComponent } from './loading/loading.component';

registerLocaleData(localeFi);


@NgModule({
  declarations: [
    AppComponent,
    MapscreenComponent,
    BiketripsComponent,
    NavbarComponent,
    FooterComponent,
    CustomFilterPipe,
    MainpageComponent,
    StationDetailsComponent,
    LoadingComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    CommonModule,
    GoogleMapsModule,
    FormsModule,
    FontAwesomeModule

  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fi' }], // this provides FIN
  bootstrap: [AppComponent]
})
export class AppModule { }
