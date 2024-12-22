import { Component, OnInit } from '@angular/core';
import { StationService } from '../station.service';
import { BiketripService } from '../biketrip.service';
import { Station } from '../models/station.model';
import { faSort, faLink, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-stations-list',
  templateUrl: './stations-list.component.html',
  styleUrls: ['./stations-list.component.css']
})
export class StationsListComponent implements OnInit {
  stations: Station[] = [];
  sortedStations: any[] = [];
  sortDirection: { [key: string]: boolean } = {
    nimi: true,
    kapasiteet: true,
    palautetut: true,
    lahdetyt: true
  };

  term = '';
  faSort = faSort;
  faLink = faLink;
  MagnifyingGlass = faMagnifyingGlass;

  constructor(private stationService: StationService, private biketripService: BiketripService) {}

  ngOnInit(): void {
    this.stationService.getStations().subscribe((data: Station[]) => {
      this.stations = data;
      this.loadAdditionalData();
    });
  }

  loadAdditionalData(): void {
    this.biketripService.GetAllStations().subscribe((stationData: any) => {
      console.log('Station Data:', stationData); // Log station data
      this.stations.forEach(station => {
        const stationInfo = stationData.find((s: any) => s.station === station.nimi);
        this.sortedStations.push({
          ...station,
          palautetut: stationInfo ? stationInfo.returnCount : 0,
          lahdetyt: stationInfo ? stationInfo.departureCount : 0
        });
      });
      console.log('Sorted Stations:', this.sortedStations); // Log sorted stations
    });
  }

  sortStations(key: string): void {
    this.sortDirection[key] = !this.sortDirection[key];
    this.sortedStations.sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return this.sortDirection[key] ? -1 : 1;
      } else if (a[key] > b[key]) {
        return this.sortDirection[key] ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  get filteredStations(): any[] {
    return this.sortedStations.filter(station =>
      station.nimi.toLowerCase().includes(this.term.toLowerCase()) ||
      station.kaupunki.toLowerCase().includes(this.term.toLowerCase())
    );
  }
}