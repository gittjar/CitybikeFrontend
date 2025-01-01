import { Component, OnInit } from '@angular/core';
import { StationService } from '../station.service';
import { BiketripService } from '../biketrip.service';
import { Station } from '../models/station.model';
import { faSort, faLink, faMagnifyingGlass, faArrowRightLong, faBicycle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-stations-list',
  templateUrl: './stations-list.component.html',
  styleUrls: ['./stations-list.component.css']
})
export class StationsListComponent implements OnInit {
  stations: Station[] = [];
  sortedStations: any[] = [];
  displayedStations: any[] = [];
  loading: boolean = true;
  sortDirection: { [key: string]: boolean } = {
    nimi: true,
    kapasiteet: true,
    palautetut: true,
    lahdetyt: true
  };

  term = '';
  faSort = faSort;
  faLink = faLink;
  faBicycle = faBicycle;
  MagnifyingGlass = faMagnifyingGlass;
  ArrowRightLong = faArrowRightLong;
  uniqueCities: string[] = [];
  selectedCities: Set<string> = new Set();

  constructor(private stationService: StationService, private biketripService: BiketripService) {}

  ngOnInit(): void {
    this.stationService.getStations().subscribe((data: Station[]) => {
      this.stations = data;
      this.loadAdditionalData();
      this.uniqueCities = [...new Set(this.stations.map(station => station.kaupunki))];
    });
  }

      // loading window
      showLoadingWindowForDuration(duration: number) {
        setTimeout(() => {
          this.loading = false;
        }, duration);
      }

  loadAdditionalData(): void {
    this.biketripService.GetAllStations().subscribe((stationData: any) => {
      this.stations.forEach(station => {
        const stationInfo = stationData.find((s: any) => s.station === station.nimi);
        this.sortedStations.push({
          ...station,
          palautetut: stationInfo ? stationInfo.returnCount : 0,
          lahdetyt: stationInfo ? stationInfo.departureCount : 0
        });
      });
      this.displayedStations = [...this.sortedStations];
      this.showLoadingWindowForDuration(3000);
    });
  }

  sortStations(key: string): void {
    this.sortDirection[key] = !this.sortDirection[key];
    this.displayedStations.sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return this.sortDirection[key] ? -1 : 1;
      } else if (a[key] > b[key]) {
        return this.sortDirection[key] ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  toggleCitySelection(city: string): void {
    if (this.selectedCities.has(city)) {
      this.selectedCities.delete(city);
    } else {
      this.selectedCities.add(city);
    }
    this.filterBySelectedCities();
  }

  filterBySelectedCities(): void {
    if (this.selectedCities.size === 0) {
      this.displayedStations = [...this.sortedStations];
    } else {
      this.displayedStations = this.sortedStations.filter(station => this.selectedCities.has(station.kaupunki));
    }
  }

  showAll(): void {
    this.selectedCities.clear();
    this.displayedStations = [...this.sortedStations];
  }

  get filteredStations(): any[] {
    return this.displayedStations.filter(station =>
      station.nimi.toLowerCase().includes(this.term.toLowerCase()) ||
      station.kaupunki.toLowerCase().includes(this.term.toLowerCase())
    );
  }

  isCitySelected(city: string): boolean {
    return this.selectedCities.has(city);
  }
}