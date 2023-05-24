import { Component, OnInit } from '@angular/core';
import { StationService } from '../station.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-mapscreen',
  templateUrl: './mapscreen.component.html',
  styleUrls: ['./mapscreen.component.css']
})
export class MapscreenComponent implements OnInit {

  stations : any
  apiLoaded: Observable<boolean>;

  constructor (private hpservice: StationService, httpClient: HttpClient ) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyCPGsdM1rbk_01lcFMT2NvoKUbyyJh2Fhg', 'callback')
    .pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  ngOnInit(): void {
    this.getAllStations();
  }

  getAllStations():void {
    this.hpservice.getStations().subscribe((data: any) =>
    this.stations = data)
  }

  

}
