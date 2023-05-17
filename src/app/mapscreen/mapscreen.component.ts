import { Component, OnInit } from '@angular/core';
import { StationService } from '../station.service';

@Component({
  selector: 'app-mapscreen',
  templateUrl: './mapscreen.component.html',
  styleUrls: ['./mapscreen.component.css']
})
export class MapscreenComponent implements OnInit {

  stations : any

  constructor (private hpservice: StationService) {}

  ngOnInit(): void {
    this.getAllStations();
  }

  getAllStations():void {
    this.hpservice.getStations().subscribe((data: any) =>
    this.stations = data)
  }

}
