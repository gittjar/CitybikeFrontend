import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StationService } from '../station.service';
import { BiketripService } from '../biketrip.service';
import { Journey } from '../models/journey.model';

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.css']
})
export class StationDetailsComponent implements OnInit {


  stationdetail: any;


  constructor (private actRoute: ActivatedRoute, private router: Router, private hpservice: StationService, private tripservice: BiketripService) {}

    ngOnInit (): void{
 
      const id = Number(this.actRoute.snapshot.paramMap.get('id'));
   if(id){
        this.getStationDetail(id);
   }
   this.getTripData();

     }

     getStationDetail(id: number): any {
      this.hpservice.getStation(id).subscribe((data: any) => {
        this.stationdetail = data;
        this.displayMap();
        }
        )}

        
        getTripData(): void{
          this.tripservice.GetBikeTrips().subscribe((data: any) =>
          this.jsonData = data)
        }
        jsonData: Journey[] = [];
        averageDistance : any;
        getTopReturnStations(departureStation: string): string[] {
          
          const returnStations = this.jsonData
            .filter(journey => journey.departure_station_name === departureStation)
            .map(journey => journey.return_station_name);
      
          const stationCountMap = returnStations.reduce((countMap, station) => {
            countMap.set(station, (countMap.get(station) || 0) + 1);
            return countMap;
          }, new Map<string, number>());

          // Calculate the average distance
            const filteredData = this.jsonData.filter(journey => journey.departure_station_name === departureStation);
            const totalDistance = filteredData.reduce((sum, journey) => sum + journey.covered_distance_m, 0);
            const averageDistance = totalDistance / filteredData.length;

            // Assign the average distance and top return stations to component variables
            this.averageDistance = averageDistance;
      
          return Array.from(stationCountMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => entry[0]);
        }
   



        displayMap(): void {
          const xCoordinate = this.stationdetail.x;
          const yCoordinate = this.stationdetail.y;

        
          // Create a new Google Map instance
          const mapOptions: google.maps.MapOptions = {
            center: { lat: yCoordinate, lng: xCoordinate },
            zoom: 15,
          };
          const map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
      
        
          // Add a marker to the map at the specified coordinates
          const markerOptions: google.maps.MarkerOptions = {
            position: { lat: yCoordinate, lng: xCoordinate },
            map: map,
            title: this.stationdetail.nimi,
            icon: {url: '/assets/bike.png', scaledSize: new google.maps.Size(50, 50)}  
            };
          const marker = new google.maps.Marker(markerOptions);
        }



        onBack(): void {
          this.router.navigate(['/mapscreen']);
        }
}
    

