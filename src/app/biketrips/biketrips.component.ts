import { Component, OnInit } from '@angular/core';
import { BiketripService } from '../biketrip.service';
import { faArrowRight, faArrowLeft, faMagnifyingGlass, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';


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
  ChevronRight = faChevronRight;
  ChevronLeft = faChevronLeft;

  ngOnInit(): void {
   this.itemsCountFromServer();
   this.GetBikeTripsMay2021();
}

  GetBikeTripsMay2021(): void {
  this.hpservice.GetBikeTripsPerPage(1).subscribe((data: any) =>
    this.citybiketripsmay2021 = data)
}

newPageNumber = 1;
totalPages!: number;
totalItems!: number;

itemsCountFromServer(): any {
  this.hpservice.GetBikeTripsPerPage(this.newPageNumber).subscribe((data: any) => {
  this.totalPages = data.totalPages;
  this.totalItems = data.totalItems;
  })
}

onPageChangePlus(): any {
this.increasePageNumber();
this.hpservice.GetBikeTripsPerPage(this.newPageNumber).subscribe((data: any) => {
this.citybiketripsmay2021 = data;
})
}

onPageChangeMinus(): any {
this.decreasePageNumber();
this.hpservice.GetBikeTripsPerPage(this.newPageNumber).subscribe((data: any) => {
this.citybiketripsmay2021 = data;
})
}

increasePageNumber(): void {
this.newPageNumber++;
}

decreasePageNumber(): void {
if (this.newPageNumber > 1) {
this.newPageNumber--;
}
}

  // sorted by distance and put items to uniqueArray
  // sortA = distance
  // serverside --> citybiketripsmay2021.data
  sortA(isAsc: boolean) {
    if (isAsc) {
    this.citybiketripsmay2021.data.sort((a: { covered_distance_m: number; }, b: { covered_distance_m: number; }) => (a.covered_distance_m > b.covered_distance_m) ? 1 : ((b.covered_distance_m > a.covered_distance_m) ? -1 : 0)
    );
    } else {
    this.citybiketripsmay2021.data.sort((a: { covered_distance_m: number; }, b: { covered_distance_m: number; }) => (a.covered_distance_m > b.covered_distance_m) ? -1 : ((b.covered_distance_m > a.covered_distance_m) ? 1 : 0)
    );
    }
    let uniqueArray = this.citybiketripsmay2021.data.filter((item: { covered_distance_m: any; }, index: any, self: any[]) =>
    index === self.findIndex((t) => (
    t.covered_distance_m === item.covered_distance_m
    ))
    );
    this.citybiketripsmay2021.data = uniqueArray;
    }

  // sorted by duration sec and put items to uniqueArray
  // sortB = duration sec
  // serverside --> citybiketripsmay2021.data
  sortB(isAsc: boolean) {
    if (isAsc) {
    this.citybiketripsmay2021.data.sort((a: { duration_sec: number; }, b: { duration_sec: number; }) => (a.duration_sec > b.duration_sec) ? 1 : ((b.duration_sec > a.duration_sec) ? -1 : 0)
    );
    } else {
    this.citybiketripsmay2021.data.sort((a: { duration_sec: number; }, b: { duration_sec: number; }) => (a.duration_sec > b.duration_sec) ? -1 : ((b.duration_sec > a.duration_sec) ? 1 : 0)
    );
    }
    let uniqueArray = this.citybiketripsmay2021.data.filter((item: { duration_sec: any; }, index: any, self: any[]) =>
    index === self.findIndex((t) => (
    t.duration_sec === item.duration_sec
    ))
    );
    this.citybiketripsmay2021.data = uniqueArray;
    }

}
