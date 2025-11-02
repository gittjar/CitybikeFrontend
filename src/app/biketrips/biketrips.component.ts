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

  // Loading progress
  showLoadingModal = false;
  totalTripsToLoad = 0;
  tripsLoadedSoFar = 0;
  loadingPercentage = 0;
  estimatedTotalTrips = 0;

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
    // Show confirmation
    if (!confirm('⚠️ Tämä lataa KAIKKI matkat kerralla. Se voi kestää useita minuutteja ja kuluttaa paljon muistia. Jatketaanko?')) {
      return;
    }

    this.loadingAll = true;
    this.showLoadingModal = true;
    this.tripsLoadedSoFar = this.allTrips.length; // Start from current count
    this.loadingPercentage = 0;
    this.estimatedTotalTrips = 0;

    console.log('Fetching total trip count from API...');
    
    // Try to get total count from API first
    this.hpservice.GetTotalTripsCount().subscribe(
      (totalCount: number) => {
        if (totalCount > 0) {
          // API provided total count!
          this.estimatedTotalTrips = totalCount;
          console.log(`✅ API reports total trips: ${totalCount}`);
        } else {
          // API doesn't have count endpoint, will estimate dynamically
          console.log('ℹ️ No count endpoint available, estimating dynamically');
        }
        
        // Start loading all pages
        this.loadAllPagesRecursively(this.newPageNumber + 1);
      },
      error => {
        // Error getting count, proceed with dynamic estimation
        console.log('⚠️ Error fetching count, will estimate dynamically');
        this.loadAllPagesRecursively(this.newPageNumber + 1);
      }
    );
  }

  private estimateTotalTrips(): void {
    // This method is no longer needed, we'll update estimate dynamically
  }

  private loadAllPagesRecursively(startPage: number): void {
    this.hpservice.GetBikeTripsPerPage(startPage).subscribe(
      (data: any) => {
        console.log(`Page ${startPage}: Received ${data.data?.length || 0} trips`);
        
        if (data.data && data.data.length > 0) {
          // Add new data
          const previousCount = this.allTrips.length;
          const newTrips = this.removeDuplicates([...this.allTrips, ...data.data]);
          this.allTrips = newTrips;
          this.citybiketripsmay2021 = [...this.allTrips];
          this.newPageNumber = startPage;
          
          // Update progress
          this.tripsLoadedSoFar = this.allTrips.length;
          
          const addedCount = this.allTrips.length - previousCount;
          console.log(`Page ${startPage}: Added ${addedCount} new trips (${data.data.length} received, ${data.data.length - addedCount} duplicates removed)`);
          
          // Dynamic estimation (only if we don't have API count)
          if (this.estimatedTotalTrips === 0 || data.data.length >= 200) {
            if (data.data.length >= 200) {
              // Still loading full pages - estimate conservatively
              // Use actual loaded count + small buffer based on average per page
              const avgPerPage = this.allTrips.length / startPage;
              const estimatedRemainingPages = Math.min(10, Math.ceil(startPage * 0.2)); // Estimate max 10-20% more pages
              const dynamicEstimate = Math.floor(this.allTrips.length + (avgPerPage * estimatedRemainingPages));
              
              // Only update estimate if we don't have API count, or dynamic is higher
              if (this.estimatedTotalTrips === 0) {
                this.estimatedTotalTrips = dynamicEstimate;
              }
            } else {
              // Last page detected (less than 200 items), set exact total
              this.estimatedTotalTrips = this.allTrips.length;
            }
          }
          
          // Calculate percentage
          if (this.estimatedTotalTrips > 0) {
            this.loadingPercentage = Math.min(99, Math.floor((this.tripsLoadedSoFar / this.estimatedTotalTrips) * 100));
          }
          
          console.log(`Total: ${this.allTrips.length} trips | Estimate: ~${this.estimatedTotalTrips} | Progress: ${this.loadingPercentage}%`);
          
          // If page has substantial data (200+ items), there might be more
          if (data.data.length >= 200) {
            // Continue loading next page
            console.log(`Continuing to page ${startPage + 1}...`);
            setTimeout(() => this.loadAllPagesRecursively(startPage + 1), 100);
          } else {
            // This was the last page (less than 200 items)
            console.log(`Last page detected (only ${data.data.length} items). Finishing...`);
            this.finishLoadingAll();
          }
        } else {
          // No more data
          console.log(`No data received on page ${startPage}. Finishing...`);
          this.finishLoadingAll();
        }
      },
      error => {
        console.error(`Error loading page ${startPage}:`, error);
        this.finishLoadingAll();
      }
    );
  }

  private finishLoadingAll(): void {
    this.loadingPercentage = 100;
    this.tripsLoadedSoFar = this.allTrips.length;
    this.totalTripsToLoad = this.allTrips.length;
    
    setTimeout(() => {
      this.loadingAll = false;
      this.showLoadingModal = false;
      this.updatePagination();
      
      if (this.currentSortFunction) {
        this.currentSortFunction();
      }
      
      alert(`✅ Kaikki matkat ladattu! Yhteensä: ${this.allTrips.length.toLocaleString()} matkaa`);
    }, 500);
  }

  private loadMultiplePages(pagesToLoad: number): void {
    // This method is now deprecated, replaced by loadAllPagesRecursively
    this.loadAllPagesRecursively(this.newPageNumber + 1);
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