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
      // this.getProductDetail();
      // this.sortName();
      const id = Number(this.actRoute.snapshot.paramMap.get('id'));
   if(id){
        this.getStationDetail(id);
   }
   this.getTripData();
     }

     getStationDetail(id: number): any {
      this.hpservice.getStation(id).subscribe((data: any) => {
        this.stationdetail = data;}
        )}

        
        getTripData(): void{
          this.tripservice.GetBikeTrips().subscribe((data: any) =>
          this.jsonData = data)
        }
        jsonData: Journey[] = []; // Replace this with your actual JSON data

        getTopReturnStations(departureStation: string): string[] {
          const returnStations = this.jsonData
            .filter(journey => journey.departure_station_name === departureStation)
            .map(journey => journey.return_station_name);
      
          const stationCountMap = returnStations.reduce((countMap, station) => {
            countMap.set(station, (countMap.get(station) || 0) + 1);
            return countMap;
          }, new Map<string, number>());
      
          return Array.from(stationCountMap.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => entry[0]);
        }

        onBack(): void {
          this.router.navigate(['/mapscreen']);
        }
}
    

