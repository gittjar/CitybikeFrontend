import { Component, OnInit } from '@angular/core';
import { BiketripService } from '../biketrip.service';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-biketrips',
  templateUrl: './biketrips.component.html',
  styleUrls: ['./biketrips.component.css']
})
export class BiketripsComponent implements OnInit {

  constructor(private hpservice: BiketripService) {}

  citybiketripsmay2021: any[] = [];
  allTrips: any[] = [];
  term = '';
  loading: boolean = true;
  // fontawesome
  MagnifyingGlass = faMagnifyingGlass;

  newPageNumber = 1;

  ngOnInit(): void {
    this.GetBikeTripsMay2021();
  }

    // loading window
    showLoadingWindowForDuration(duration: number) {
      setTimeout(() => {
        this.loading = false;
      }, duration);
    }

  GetBikeTripsMay2021(): void {
    this.hpservice.GetBikeTripsPerPage(this.newPageNumber).subscribe((data: any) => {
      this.citybiketripsmay2021 = data.data;
      this.allTrips = data.data;
      this.showLoadingWindowForDuration(3000);
    });
  }

  loadMoreTrips(): void {
    this.newPageNumber++;
    this.hpservice.GetBikeTripsPerPage(this.newPageNumber).subscribe((data: any) => {
      this.citybiketripsmay2021 = [...this.citybiketripsmay2021, ...data.data];
      this.allTrips = [...this.allTrips, ...data.data];
    });
  }

  sortA(isAsc: boolean) {
    if (isAsc) {
      this.citybiketripsmay2021.sort((a, b) => a.covered_distance_m - b.covered_distance_m);
    } else {
      this.citybiketripsmay2021.sort((a, b) => b.covered_distance_m - a.covered_distance_m);
    }
    this.citybiketripsmay2021 = this.citybiketripsmay2021.filter((item, index, self) =>
      index === self.findIndex((t) => t.covered_distance_m === item.covered_distance_m)
    );
  }

  sortB(isAsc: boolean) {
    if (isAsc) {
      this.citybiketripsmay2021.sort((a, b) => a.duration_sec - b.duration_sec);
    } else {
      this.citybiketripsmay2021.sort((a, b) => b.duration_sec - a.duration_sec);
    }
    this.citybiketripsmay2021 = this.citybiketripsmay2021.filter((item, index, self) =>
      index === self.findIndex((t) => t.duration_sec === item.duration_sec)
    );
  }
}