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

  // sorted by distance and put items to uniqueArray
  sortA(isAsc: boolean) {
    if (isAsc) {
    this.citybiketripsmay2021.sort((a: { covered_distance_m: number; }, b: { covered_distance_m: number; }) => (a.covered_distance_m > b.covered_distance_m) ? 1 : ((b.covered_distance_m > a.covered_distance_m) ? -1 : 0)
    );
    } else {
    this.citybiketripsmay2021.sort((a: { covered_distance_m: number; }, b: { covered_distance_m: number; }) => (a.covered_distance_m > b.covered_distance_m) ? -1 : ((b.covered_distance_m > a.covered_distance_m) ? 1 : 0)
    );
    }
    let uniqueArray = this.citybiketripsmay2021.filter((item: { covered_distance_m: any; }, index: any, self: any[]) =>
    index === self.findIndex((t) => (
    t.covered_distance_m === item.covered_distance_m
    ))
    );
    this.citybiketripsmay2021 = uniqueArray;
    }


}
