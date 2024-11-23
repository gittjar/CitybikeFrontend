import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StationService } from '../station.service';
import { BiketripService } from '../biketrip.service';
import { Journey } from '../models/journey.model';
import { Station } from '../models/station.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.css']
})
export class StationDetailsComponent implements OnInit {
  stationdetail: Station | null = null;
  jsonData: Journey[] = [];
  errorMessage: string | null = null;
  topReturnStations: { id: number, name: string, rank: number }[] = [];
  stationTable: Station[] = [];
  averageDistance: number | null = null;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private hpservice: StationService,
    private tripservice: BiketripService
  ) {}

  ngOnInit(): void {
    this.actRoute.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.initializeStationTable().then(() => {
          this.getStationDetail(id);
          this.getTripData(id);
        });
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/mapscreen']);
  }

  getStationDetail(id: number): void {
    this.hpservice.getStation(id).subscribe({
      next: (data: Station) => {
        this.stationdetail = data;
        this.displayMap();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.status === 404 ? 'Station not found.' : 'An error occurred while fetching station details.';
      }
    });
  }

  getTripData(stationId: number): void {
    this.tripservice.GetTripsByStationId(stationId).subscribe((data: Journey[]) => {
      this.jsonData = data;
      this.topReturnStations = this.getTopReturnStations(this.stationdetail?.nimi || '');
      this.calculateAverageDistance();
      this.displayMap();
    });
  }

  getTopReturnStations(departureStation: string): { id: number, name: string, rank: number }[] {
    const returnStations = this.jsonData
      .filter(journey => journey.departure_station_name === departureStation)
      .map(journey => ({ id: journey.return_station_id, name: journey.return_station_name }));

    const stationCountMap = returnStations.reduce((countMap, station) => {
      const key = `${station.id}-${station.name}`;
      countMap.set(key, (countMap.get(key) || 0) + 1);
      return countMap;
    }, new Map<string, number>());

    return Array.from(stationCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((entry, index) => {
        const [id, name] = entry[0].split('-');
        return { id: Number(id), name, rank: index + 1 };
      });
  }

  calculateAverageDistance(): void {
    if (this.jsonData.length > 0) {
      const totalDistance = this.jsonData.reduce((sum, journey) => sum + journey.covered_distance_m, 0);
      this.averageDistance = totalDistance / this.jsonData.length;
    } else {
      this.averageDistance = null;
    }
  }

  initializeStationTable(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.hpservice.getStations().subscribe((stations: Station[]) => {
        this.stationTable = stations;
        resolve();
      }, (error: HttpErrorResponse) => {
        this.errorMessage = 'An error occurred while fetching stations.';
        reject(error);
      });
    });
  }

  getStationCoordinatesByName(stationName: string): { x: number, y: number } | null {
    const station = this.stationTable.find(station => station.nimi === stationName);
    return station ? { x: station.x, y: station.y } : null;
  }

  displayMap(): void {
    if (!this.stationdetail) return;

    const xCoordinate = this.stationdetail.x;
    const yCoordinate = this.stationdetail.y;

    const mapOptions: google.maps.MapOptions = {
      center: { lat: yCoordinate, lng: xCoordinate },
      zoom: 13,
    };
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);

    const markerOptions: google.maps.MarkerOptions = {
      position: { lat: yCoordinate, lng: xCoordinate },
      map: map,
      title: this.stationdetail.nimi,
      icon: { url: '/assets/bike.png', scaledSize: new google.maps.Size(50, 50) }
    };
    new google.maps.Marker(markerOptions);

    this.topReturnStations.forEach(station => {
      const coordinates = this.getStationCoordinatesByName(station.name);
      if (coordinates) {
        const returnMarkerOptions: google.maps.MarkerOptions = {
          position: { lat: coordinates.y, lng: coordinates.x },
          map: map,
          label: `${station.rank}`,
          title: station.name,
        };
        new google.maps.Marker(returnMarkerOptions);
      }
    });
  }
}