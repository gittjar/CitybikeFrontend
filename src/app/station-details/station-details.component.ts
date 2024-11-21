import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StationService } from '../station.service';
import { BiketripService } from '../biketrip.service';
import { Journey } from '../models/journey.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.css']
})
export class StationDetailsComponent implements OnInit {

  stationdetail: any;
  getTopDepartureStations: any;
  jsonData: Journey[] = [];
  averageDistance: any;
  errorMessage: string | null = null;

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    private hpservice: StationService,
    private tripservice: BiketripService
  ) {}

  ngOnInit(): void {
    const id = Number(this.actRoute.snapshot.paramMap.get('id'));
    if (id) {
      this.getStationDetail(id);
      this.getTripData(id);
    }
  }

  getStationDetail(id: number): void {
    this.hpservice.getStation(id).subscribe({
      next: (data: any) => {
        this.stationdetail = data;
        this.displayMap();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.errorMessage = 'Station not found.';
        } else {
          this.errorMessage = 'An error occurred while fetching station details.';
        }
      }
    });
  }

  getTripData(stationId: number): void {
    this.tripservice.GetTripsByStationId(stationId).subscribe((data: Journey[]) => {
      this.jsonData = data;
      this.calculateAverageDistance();
    });
  }

  calculateAverageDistance(): void {
    const totalDistance = this.jsonData.reduce((sum, journey) => sum + journey.covered_distance_m, 0);
    this.averageDistance = totalDistance / this.jsonData.length;
  }

  getTopReturnStations(departureStation: string): { id: number, name: string }[] {
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
      .map(entry => {
        const [id, name] = entry[0].split('-');
        return { id: Number(id), name };
      });
  }

  displayMap(): void {
    const xCoordinate = this.stationdetail.x;
    const yCoordinate = this.stationdetail.y;

    const mapOptions: google.maps.MapOptions = {
      center: { lat: yCoordinate, lng: xCoordinate },
      zoom: 15,
    };
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);

    const markerOptions: google.maps.MarkerOptions = {
      position: { lat: yCoordinate, lng: xCoordinate },
      map: map,
      title: this.stationdetail?.nimi,
      icon: { url: '/assets/bike.png', scaledSize: new google.maps.Size(50, 50) }
    };
    const marker = new google.maps.Marker(markerOptions);
  }

  onBack(): void {
    this.router.navigate(['/mapscreen']);
  }
}