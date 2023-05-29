import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StationService } from '../station.service';

@Component({
  selector: 'app-station-details',
  templateUrl: './station-details.component.html',
  styleUrls: ['./station-details.component.css']
})
export class StationDetailsComponent implements OnInit {

  stationdetail: any;

  constructor (private actRoute: ActivatedRoute, private router: Router, private hpservice: StationService) {}

    ngOnInit (): void{
      // this.getProductDetail();
      // this.sortName();
      const id = Number(this.actRoute.snapshot.paramMap.get('id'));
   if(id){
        this.getStationDetail(id);
   }
     }

     getStationDetail(id: number): any {
      this.hpservice.getStation(id).subscribe((data: any) => {
        this.stationdetail = data;}
        )}
}
    

