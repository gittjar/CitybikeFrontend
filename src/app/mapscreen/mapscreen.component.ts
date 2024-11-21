import { Component, OnInit } from '@angular/core';
import { StationService } from '../station.service';
import { BiketripService } from '../biketrip.service';
import { Journey } from '../models/journey.model';
import { faRotateLeft, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-mapscreen',
  templateUrl: './mapscreen.component.html',
  styleUrls: ['./mapscreen.component.css']
})
export class MapscreenComponent implements OnInit {

  stations: any;
  RotareLeft = faRotateLeft;
  ArrowRightFromBracket = faArrowRightFromBracket;
  loading: boolean = true;
  topDepartureStations: any[] = [];
  topReturnStations: any[] = [];

  constructor(private hpservice: StationService, private tripservice: BiketripService) {}

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
    this.loadTopDepartureStations();
    this.loadTopReturnStations();
  }

  // loading window
  showLoadingWindowForDuration(duration: number) {
    setTimeout(() => {
      this.loading = false;
    }, duration);
  }

  getAllStations(): void {
    this.hpservice.getStations().subscribe((data: any) => {
      this.stations = data;
      this.showLoadingWindowForDuration(2000); // Display loading window for 2 seconds
    });
  }

  getTripData(): void {
    this.tripservice.GetBikeTripsPerPage(1).subscribe((data: any) => {
      this.jsonData = data;
      console.log('Trip data loaded:', this.jsonData);
    });
  }

  jsonData: Journey[] = [];

  loadTopDepartureStations(): void {
    this.tripservice.GetTopDepartureStations().subscribe((data: any) => {
      this.topDepartureStations = data;
      console.log('Top Departure Stations:', data);
    });
  }

  loadTopReturnStations(): void {
    this.tripservice.GetTopReturnStations().subscribe((data: any) => {
      this.topReturnStations = data;
      console.log('Top Return Stations:', data);
    });
  }

  // google maps configurations
  markers = [] as any;

  showContent(contentType: string) {
    this.markers = [];

    let content: any = null;

    if (contentType === "MyText") {
      content = this.hpservice.getStations();
    } else {
      console.error("unknown content type");
      return;
    }

    console.log("click");

    content.subscribe((response: any) => {
      let arr = response as Array<any>;

      arr.forEach((citybikeasema: any) => {
        this.stations = response;

        let marker = new google.maps.Marker({
          position: {
            lat: citybikeasema?.y,
            lng: citybikeasema?.x,
          },
          label: {
            text: citybikeasema?.nimi,
            color: 'Navy', fontWeight: '700', fontFamily: 'Arial', fontSize: '14px'
          },
          title: citybikeasema?.osoite + ', ' + citybikeasema?.kaupunki,
          opacity: 1.2,
          animation: google.maps.Animation.DROP,
          icon: { url: '/assets/location-pin.png' },
        });

        let markerContent = '<div class="map-infowindow">' +
          `<div class="map-infowindow-title">${citybikeasema.nimi}</div>` +
          `<div class="map-infowindow-content">${citybikeasema?.osoite}, ${citybikeasema?.kaupunki}</div>` +
          `<hr>` + `<br>` +
          `<div class="map-infowindow-content">Operaattori: ${citybikeasema?.operaattor}</div>` +
          `<div class="map-infowindow-content">Kapasiteetti: ${citybikeasema?.kapasiteet} kpl</div>` +
          `<div class="map-infowindow-content">
                             <a href="station-details/${citybikeasema?.id}">
                               Katso lisätiedot >
                             </a>
                           </div>` +
          '</div>';

        // To add the marker to the map, call setMap();
        marker.setMap(this.map);
        google.maps.event.addListener(marker, "click", () => {
          let infowindow = new google.maps.InfoWindow();
          infowindow.setContent(markerContent);
          infowindow.open(this.map, marker);
        });
      });
    });
  }
}