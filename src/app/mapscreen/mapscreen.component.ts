import { Component, OnInit } from '@angular/core';
import { StationService } from '../station.service';
import { BiketripService } from '../biketrip.service';
import { Journey } from '../models/journey.model';
import { faRotateLeft, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

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
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    center: {
      lat: 60.177038,
      lng: 24.939662,
    },
    zoom: 14,
    styles: [
      {
        "elementType": "geometry",
        "stylers": [{"color": "#212121"}]
      },
      {
        "elementType": "labels.icon",
        "stylers": [{"visibility": "off"}]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#757575"}]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{"color": "#212121"}]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{"color": "#757575"}]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#9e9e9e"}]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#bdbdbd"}]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#757575"}]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{"color": "#181818"}]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#616161"}]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [{"color": "#1b1b1b"}]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#2c2c2c"}]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#8a8a8a"}]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{"color": "#373737"}]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{"color": "#3c3c3c"}]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [{"color": "#4e4e4e"}]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#616161"}]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#757575"}]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#000000"}]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#3d3d3d"}]
      }
    ]
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

  getStationIdByName(stationName: string): number | null {
    if (!this.stations) return null;
    const station = this.stations.find((s: any) => s.nimi === stationName);
    return station ? station.id : null;
  }

  // google maps configurations
  markers = [] as any;
  markerClusterer?: MarkerClusterer;

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
          title: citybikeasema?.nimi,
          animation: google.maps.Animation.DROP,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="40" height="50" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2 C 10 2, 2 10, 2 20 C 2 30, 20 48, 20 48 C 20 48, 38 30, 38 20 C 38 10, 30 2, 20 2 Z" 
                      fill="#08c9de" stroke="#292524" stroke-width="2"/>
                <circle cx="20" cy="20" r="8" fill="#292524"/>
                <path d="M 16 20 L 19 23 L 25 17" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/>
              </svg>
            `),
            scaledSize: new google.maps.Size(40, 50),
            anchor: new google.maps.Point(20, 50)
          },
        });

        let markerContent = `
          <div class="custom-info-window">
            <div class="info-header">
              <div class="info-icon">🚲</div>
              <div class="info-title-section">
                <h3 class="info-title">${citybikeasema.nimi}</h3>
                <p class="info-address">${citybikeasema?.osoite}, ${citybikeasema?.kaupunki}</p>
              </div>
            </div>
            
            <div class="info-divider"></div>
            
            <div class="info-details">
              <div class="info-row">
                <span class="info-label">Operaattori:</span>
                <span class="info-value">${citybikeasema?.operaattor || 'N/A'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Kapasiteetti:</span>
                <span class="info-value">${citybikeasema?.kapasiteet} pyörää</span>
              </div>
            </div>
            
            <a href="/station-details/${citybikeasema?.id}" class="info-link">
              <span>Näytä lisätiedot</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>`;

        // Add click listener to marker
        google.maps.event.addListener(marker, "click", () => {
          this.infoWindow.setContent(markerContent);
          this.infoWindow.open(this.map, marker);
        });

        // Add marker to array for clustering
        this.markers.push(marker);
      });

      // Create marker clusterer after all markers are added
      if (this.markerClusterer) {
        this.markerClusterer.clearMarkers();
      }
      
      this.markerClusterer = new MarkerClusterer({
        map: this.map,
        markers: this.markers,
        renderer: {
          render: ({ count, position }) => {
            // Custom cluster marker style matching your theme
            return new google.maps.Marker({
              position,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="30" r="28" fill="#08c9de" stroke="#292524" stroke-width="3"/>
                    <text x="30" y="38" text-anchor="middle" font-size="20" font-weight="bold" fill="#292524">${count}</text>
                  </svg>
                `),
                scaledSize: new google.maps.Size(60, 60),
                anchor: new google.maps.Point(30, 30)
              },
              label: {
                text: ' ',
                color: 'transparent'
              },
              zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
            });
          }
        }
      });
    });
  }
}