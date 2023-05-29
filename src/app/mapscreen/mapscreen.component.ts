import { Component, OnInit, SimpleChanges } from '@angular/core';
import { StationService } from '../station.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { BiketripService } from '../biketrip.service';
import { Journey } from '../models/journey.model';
import { faRotateLeft, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-mapscreen',
  templateUrl: './mapscreen.component.html',
  styleUrls: ['./mapscreen.component.css']
})
export class MapscreenComponent implements OnInit {

  stations : any
  RotareLeft = faRotateLeft;
  ArrowRightFromBracket = faArrowRightFromBracket;

  constructor (private hpservice: StationService, private tripservice: BiketripService) {}

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
    zoom: 14,
  };

  ngOnInit(): void {
    this.getAllStations();

    this.map = new google.maps.Map(
      document.getElementById("map")!,
      this.options
    );
    this.infoWindow = new google.maps.InfoWindow();

    this.showContent('MyText');

    this.getTripData();

  }

  getAllStations():void {
    this.hpservice.getStations().subscribe((data: any) =>
    this.stations = data)
  }

  getTripData(): void{
    this.tripservice.GetBikeTrips().subscribe((data: any) =>
    this.jsonData = data)
  }

  jsonData: Journey[] = [];

  // top 10 lähtöasemat ja count
  getTopDepartureStations(): string[] {
    const stationCountMap = this.jsonData.reduce((countMap, journey) => {
      const station = journey.departure_station_name;
      countMap.set(station, (countMap.get(station) || 0) + 1);
      return countMap;
    }, new Map<string, number>());

    return Array.from(stationCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
  }

  getDepartureStationCount(station: string): number {
    return this.jsonData.filter(journey => journey.departure_station_name === station).length;
  }

  // top 10 palautusasemat ja count
  getTopReturnStations(): string[] {
    const stationCountMap = this.jsonData.reduce((countMap, journey) => {
      const station = journey.return_station_name;
      countMap.set(station, (countMap.get(station) || 0) + 1);
      return countMap;
    }, new Map<string, number>());

    return Array.from(stationCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
  }

  getReturnStationCount(station: string): number {
    return this.jsonData.filter(journey => journey.return_station_name === station).length;
  }
  






  // google maps configurations
  markers = [] as any;

  showContent(contentType: string) {

    this.markers = []
  
    let content: any = null
  
  
    if(contentType === "MyText") {
     // content = this.placeservice.getPlace(this.textid);
     content = this.hpservice.getStations();
    }
    else {
      console.error("unknown content type");
      return
    }
  
    console.log("click")
  
    content.subscribe((response: any) => {
      
        let arr = response as Array<any>
  
        arr.forEach((citybikeasema: any) => {
          this.stations = response;
          
          let marker = new google.maps.Marker({
            position: {
              lat: citybikeasema?.y,
              lng: citybikeasema?.x,
            },
            label : {text: citybikeasema?.nimi,
            color: 'Navy', fontWeight: '700', fontFamily: 'Arial', fontSize: '14px' },
            title : citybikeasema?.osoite + ', ' + citybikeasema?.kaupunki,
            opacity: 1.2,
            animation : google.maps.Animation.DROP,
            icon: {url: '/assets/location-pin.png'},
          });
          
          let markerContent = '<div class="map-infowindow">' +
                             `<div class="map-infowindow-title">${citybikeasema.nimi}, ${citybikeasema?.id}</div>` + 
                             `<div class="map-infowindow-content">${citybikeasema?.osoite}, ${citybikeasema?.kaupunki}</div>` + 
                             
  
                             `<hr>` + `<br>`+ 
                             `<div class="map-infowindow-content">Operaattori: ${citybikeasema?.operaattor}</div>` + 
                             `<div class="map-infowindow-content">Kapasiteetti: ${citybikeasema?.kapasiteet} kpl</div>` +  
                             
                             `<div class="map-infowindow-content">
                             <a href=/station-details/${citybikeasema?.id}>
                               Lue lisää >
                             </a>
                           </div>` +  
                              '</div>'
                  
                           
                            
          // To add the marker to the map, call setMap();
          marker.setMap(this.map);
          google.maps.event.addListener(marker, "click", () => {
           let infowindow = new google.maps.InfoWindow();
            infowindow.setContent(markerContent)
            infowindow.open(this.map, marker);    
          });
        });
      }); 
  }
  

  

}
