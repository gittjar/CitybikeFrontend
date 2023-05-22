import { Component, OnInit } from '@angular/core';
import { BiketripService } from '../biketrip.service';
import { faArrowRight, faArrowLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-biketrips',
  templateUrl: './biketrips.component.html',
  styleUrls: ['./biketrips.component.css']
})
export class BiketripsComponent implements OnInit {

  constructor(private hpservice: BiketripService) {}

  citybiketripsmay2021 : any;
  term = '';
  // fontawesome
  ArrowRight = faArrowRight;
  ArrowLeft = faArrowLeft;
  MagnifyingGlass = faMagnifyingGlass;

  ngOnInit(): void {
    this.GetBikeTripsMay2021();
  }

  GetBikeTripsMay2021(): void {
  this.hpservice.GetBikeTrips().subscribe((data: any) =>
    this.citybiketripsmay2021 = data)
}


}
