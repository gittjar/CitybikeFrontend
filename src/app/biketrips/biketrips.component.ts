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
  displayedTrips: any[] = [];
  term = '';
  loading: boolean = true;
  loadingMore: boolean = false;
  loadingAll: boolean = false;
  // fontawesome
  MagnifyingGlass = faMagnifyingGlass;

  newPageNumber = 1;
  currentSortFunction: (() => void) | null = null;
  
  // Pagination
  itemsPerPage = 50;
  currentPage = 1;
  totalPages = 1;
  usePagination = true;

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
      this.citybiketripsmay2021 = this.removeDuplicates(data.data);
      this.allTrips = [...this.citybiketripsmay2021];
      this.updatePagination();
      this.showLoadingWindowForDuration(3000);
    });
  }

  loadMoreTrips(): void {
    this.loadingMore = true;
    this.newPageNumber++;
    this.hpservice.GetBikeTripsPerPage(this.newPageNumber).subscribe((data: any) => {
      const previousCount = this.allTrips.length;
      // Add new data to allTrips and remove duplicates
      const newTrips = this.removeDuplicates([...this.allTrips, ...data.data]);
      this.allTrips = newTrips;
      // Update displayed trips
      this.citybiketripsmay2021 = [...this.allTrips];
      this.updatePagination();
      // Reapply current sort if any
      if (this.currentSortFunction) {
        this.currentSortFunction();
      }
      this.loadingMore = false;
      
      const loadedCount = this.allTrips.length - previousCount;
      console.log(`Loaded ${loadedCount} new trips (Total: ${this.allTrips.length})`);
    });
  }

  loadAllTrips(): void {
    if (!confirm('⚠️ Tämä lataa kaikki matkat kerralla. Se voi kestää hetken ja hidastaa selainta. Jatketaanko?')) {
      return;
    }

    this.loadingAll = true;
    this.loadMultiplePages(10); // Load 10 pages at once (2500 trips)
  }

  private loadMultiplePages(pagesToLoad: number): void {
    const startPage = this.newPageNumber + 1;
    const endPage = startPage + pagesToLoad - 1;
    let pagesLoaded = 0;

    for (let page = startPage; page <= endPage; page++) {
      this.hpservice.GetBikeTripsPerPage(page).subscribe((data: any) => {
        if (data.data && data.data.length > 0) {
          const newTrips = this.removeDuplicates([...this.allTrips, ...data.data]);
          this.allTrips = newTrips;
          this.citybiketripsmay2021 = [...this.allTrips];
          this.newPageNumber = Math.max(this.newPageNumber, page);
          
          pagesLoaded++;
          console.log(`Loaded page ${page}/${endPage} - Total trips: ${this.allTrips.length}`);
          
          if (pagesLoaded === pagesToLoad || data.data.length < 250) {
            this.loadingAll = false;
            this.updatePagination();
            if (this.currentSortFunction) {
              this.currentSortFunction();
            }
            alert(`✅ Ladattu ${this.allTrips.length} matkaa yhteensä!`);
          }
        } else {
          // No more data
          this.loadingAll = false;
          this.updatePagination();
          alert(`✅ Kaikki matkat ladattu! Yhteensä: ${this.allTrips.length} matkaa`);
        }
      }, error => {
        this.loadingAll = false;
        console.error('Error loading trips:', error);
      });
    }
  }

  updatePagination(): void {
    // First update displayed trips which includes filtering
    this.updateDisplayedTrips();
    
    // Calculate total pages based on filtered results
    const filteredCount = this.getFilteredTripsCount();
    this.totalPages = Math.ceil(filteredCount / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, Math.max(1, this.totalPages));
  }

  updateDisplayedTrips(): void {
    // First apply search filter to all trips
    let filteredTrips = this.citybiketripsmay2021;
    
    if (this.term && this.term.trim() !== '') {
      const searchTerm = this.term.toLowerCase();
      filteredTrips = this.citybiketripsmay2021.filter(trip => {
        return (
          trip.departure_station_name?.toLowerCase().includes(searchTerm) ||
          trip.return_station_name?.toLowerCase().includes(searchTerm) ||
          trip.departure?.toLowerCase().includes(searchTerm) ||
          trip.return?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Then apply pagination if enabled
    if (!this.usePagination) {
      this.displayedTrips = filteredTrips;
      return;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedTrips = filteredTrips.slice(startIndex, endIndex);
    
    // Update total pages based on filtered results
    this.totalPages = Math.ceil(filteredTrips.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedTrips();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  togglePagination(): void {
    this.usePagination = !this.usePagination;
    if (this.usePagination) {
      this.currentPage = 1;
      this.updatePagination();
    } else {
      this.displayedTrips = this.citybiketripsmay2021;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  removeDuplicates(trips: any[]): any[] {
    const seen = new Set();
    return trips.filter(trip => {
      const key = `${trip.departure}-${trip.departure_station_id}-${trip.return_station_id}-${trip.duration_sec}-${trip.covered_distance_m}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  sortByDistance(isAsc: boolean) {
    this.currentSortFunction = () => {
      if (isAsc) {
        this.citybiketripsmay2021.sort((a, b) => a.covered_distance_m - b.covered_distance_m);
      } else {
        this.citybiketripsmay2021.sort((a, b) => b.covered_distance_m - a.covered_distance_m);
      }
    };
    this.citybiketripsmay2021 = [...this.allTrips];
    this.currentSortFunction();
    this.updatePagination();
  }

  sortByDuration(isAsc: boolean) {
    this.currentSortFunction = () => {
      if (isAsc) {
        this.citybiketripsmay2021.sort((a, b) => a.duration_sec - b.duration_sec);
      } else {
        this.citybiketripsmay2021.sort((a, b) => b.duration_sec - a.duration_sec);
      }
    };
    this.citybiketripsmay2021 = [...this.allTrips];
    this.currentSortFunction();
    this.updatePagination();
  }

  sortBySpeed(isAsc: boolean) {
    this.currentSortFunction = () => {
      this.citybiketripsmay2021.sort((a, b) => {
        const speedA = (a.covered_distance_m / 1000) / (a.duration_sec / 3600);
        const speedB = (b.covered_distance_m / 1000) / (b.duration_sec / 3600);
        return isAsc ? speedA - speedB : speedB - speedA;
      });
    };
    this.citybiketripsmay2021 = [...this.allTrips];
    this.currentSortFunction();
    this.updatePagination();
  }

  resetSort() {
    this.currentSortFunction = null;
    this.citybiketripsmay2021 = [...this.allTrips];
    this.updatePagination();
  }

  formatDuration(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}min ${secs}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}min ${secs}s`;
    } else {
      return `${minutes}min ${secs}s`;
    }
  }

  trackByTrip(index: number, trip: any): string {
    return `${trip.departure}-${trip.departure_station_id}-${trip.return_station_id}-${trip.duration_sec}-${trip.covered_distance_m}`;
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset to first page when searching
    this.updateDisplayedTrips();
  }

  getFilteredTripsCount(): number {
    if (!this.term || this.term.trim() === '') {
      return this.citybiketripsmay2021.length;
    }
    
    const searchTerm = this.term.toLowerCase();
    return this.citybiketripsmay2021.filter(trip => {
      return (
        trip.departure_station_name?.toLowerCase().includes(searchTerm) ||
        trip.return_station_name?.toLowerCase().includes(searchTerm) ||
        trip.departure?.toLowerCase().includes(searchTerm) ||
        trip.return?.toLowerCase().includes(searchTerm)
      );
    }).length;
  }
}