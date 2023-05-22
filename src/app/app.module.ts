import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { MapscreenComponent } from './mapscreen/mapscreen.component';
import { BiketripsComponent } from './biketrips/biketrips.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


// locale

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFi from '@angular/common/locales/fi';
import { CustomFilterPipe } from './custom-filter-pipe.pipe';

registerLocaleData(localeFi);


@NgModule({
  declarations: [
    AppComponent,
    MapscreenComponent,
    BiketripsComponent,
    NavbarComponent,
    FooterComponent,
    CustomFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,

  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fi' }], // this provides FIN
  bootstrap: [AppComponent]
})
export class AppModule { }
