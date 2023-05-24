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
  }

  getAllStations():void {
    this.hpservice.getStations().subscribe((data: any) =>
    this.stations = data)
  }

  // google maps configurations
  markers = [] as any;

  showContent(contentType: string) {

    this.markers = []
  
    let content: any = null
  
  
    // getPlace in placeservice is configured to show text and it changes here what user gives.
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
            label : {text: citybikeasema?.nimi, color: 'Navy', fontWeight: '700', fontFamily: 'Arial', fontSize: '13px' },
            title : citybikeasema?.osoite + ', ' + citybikeasema?.kaupunki,
            animation : google.maps.Animation.DROP,
            icon: {url: '/assets/location-pin.png'},
          });
          
          let markerContent = '<div class="map-infowindow">' +
                             `<div class="map-infowindow-title">${citybikeasema.nimi}</div>` + 
                             `<div class="map-infowindow-content">${citybikeasema?.osoite}</div>` + 
                             `<div class="map-infowindow-content" *ngIf="citybikeasema?.kaupunki.lenght!">${citybikeasema?.kaupunki}, ${citybikeasema?.operaattor}</div>` + 
                             `<div class="map-infowindow-content"><a href="${""}">Lue lisää ></a></div>
                             ` + 
  
                             `<hr>` + `<br>`+ 
                             `<div class="map-infowindow-content">Kapasiteetti: ${citybikeasema?.kapasiteet} kpl</div>` + 
  
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
