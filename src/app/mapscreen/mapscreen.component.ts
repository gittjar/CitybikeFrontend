import { Component, OnInit } from '@angular/core';
import { StationService } from '../station.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';


@Component({
  selector: 'app-mapscreen',
  templateUrl: './mapscreen.component.html',
  styleUrls: ['./mapscreen.component.css']
})
export class MapscreenComponent implements OnInit {

  stations : any
 

  constructor (private hpservice: StationService) {}

  // googlemaps
  mapLoaded!: boolean;
  map!: google.maps.Map;
  geocoder = new google.maps.Geocoder();
  infoWindow!: google.maps.InfoWindow;
  options: google.maps.MapOptions = {
  mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: true,
    center: {
      lat: 60.177038,
      lng: 24.939662,
    },
    zoom: 13,
  };








  ngOnInit(): void {
    this.getAllStations();

    this.map = new google.maps.Map(
      document.getElementById("map")!,
      this.options
    );
    this.infoWindow = new google.maps.InfoWindow();

   // this.showContent('MyText');
  }

  getAllStations():void {
    this.hpservice.getStations().subscribe((data: any) =>
    this.stations = data)
  }

  

}
