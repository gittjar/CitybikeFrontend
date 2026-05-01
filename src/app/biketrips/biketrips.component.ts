import { Component, OnInit } from '@angular/core';
import { BiketripService } from '../biketrip.service';
import { StationService } from '../station.service';
import { faMagnifyingGlass, faBicycle, faArrowRight, faLocationDot, faRuler, faClock, faGaugeHigh, faHashtag, faCalendar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-biketrips',
  templateUrl: './biketrips.component.html',
  styleUrls: ['./biketrips.component.css']
})
export class BiketripsComponent implements OnInit {

  constructor(private hpservice: BiketripService, private stationService: StationService) {}

  citybiketripsmay2021: any[] = [];
  allTrips: any[] = [];
  displayedTrips: any[] = [];
  stationMap = new Map<number, any>();
  term = '';
  loading: boolean = true;
  loadingMore: boolean = false;
  loadingAll: boolean = false;
  // fontawesome
  MagnifyingGlass = faMagnifyingGlass;
  faBicycle = faBicycle;
  faArrowRight = faArrowRight;
  faLocationDot = faLocationDot;
  faRuler = faRuler;
  faClock = faClock;
  faGaugeHigh = faGaugeHigh;
  faHashtag = faHashtag;
  faCalendar = faCalendar;
  isMobile = false;

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
  loadingAborted = false;
  loadingStartTime = 0;
  estimatedTimeRemaining = 0;
  elapsedTime = 0;

  // Stats
  showStats = false;
  stats: any = null;

  ngOnInit(): void {
    this.isMobile = window.innerWidth < 700;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 700;
    });
    this.stationService.getStations().subscribe((stations: any[]) => {
      stations.forEach(s => this.stationMap.set(s.id, s));
    });
    this.GetBikeTripsMay2021();
  }

    // loading window
    showLoadingWindowForDuration(duration: number) {
      setTimeout(() => {
        this.loading = false;
      }, duration);
    }

  GetBikeTripsMay2021(): void {
    this.hpservice.GetBikeTripsPerPage(this.newPageNumber, 500).subscribe((data: any) => {
      this.citybiketripsmay2021 = this.removeDuplicates(data.data);
      this.allTrips = [...this.citybiketripsmay2021];
      this.updatePagination();
      this.showLoadingWindowForDuration(3000);
    });
  }

  loadMoreTrips(): void {
    this.loadingMore = true;
    this.newPageNumber++;
    this.hpservice.GetBikeTripsPerPage(this.newPageNumber, 500).subscribe((data: any) => {
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
    this.loadingAborted = false;
    this.tripsLoadedSoFar = this.allTrips.length; // Start from current count
    this.loadingPercentage = 0;
    this.estimatedTotalTrips = 0;
    this.loadingStartTime = Date.now();
    this.estimatedTimeRemaining = 0;
    this.elapsedTime = 0;

    console.log('Fetching total trip count from API...');
    
    // Try to get total count from API first
    this.hpservice.GetTotalTripsCount().subscribe(
      (response: any) => {
        if (response && response.totalTrips > 0) {
          // API provided total count!
          this.estimatedTotalTrips = response.totalTrips;
          console.log(`✅ API reports total trips: ${response.totalTrips}`);
        } else {
          // API doesn't have count or returned 0
          console.log('ℹ️ No count available, estimating dynamically');
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

  private loadAllPagesRecursively(startPage: number, retryCount: number = 0): void {
    // Check if loading was aborted
    if (this.loadingAborted) {
      console.log('Loading aborted by user');
      this.finishLoadingAll(true);
      return;
    }

    const maxRetries = 3;
    const baseDelay = 500; // Base delay between requests (ms)
    
    this.hpservice.GetBikeTripsPerPage(startPage, 500).subscribe(
      (data: any) => {
        console.log(`Page ${startPage}: Received ${data.data?.length || 0} trips`);
        
        // Check abort again after receiving data
        if (this.loadingAborted) {
          console.log('Loading aborted by user after receiving data');
          this.finishLoadingAll(true);
          return;
        }
        
        if (data.data && data.data.length > 0) {
          // Add new data
          const previousCount = this.allTrips.length;
          const newTrips = this.removeDuplicates([...this.allTrips, ...data.data]);
          this.allTrips = newTrips;
          this.citybiketripsmay2021 = [...this.allTrips];
          this.newPageNumber = startPage;
          
          // Update progress
          this.tripsLoadedSoFar = this.allTrips.length;
          
          // Calculate elapsed time and estimate remaining
          this.elapsedTime = Math.floor((Date.now() - this.loadingStartTime) / 1000);
          
          const addedCount = this.allTrips.length - previousCount;
          console.log(`Page ${startPage}: Added ${addedCount} new trips (${data.data.length} received, ${data.data.length - addedCount} duplicates removed)`);
          
          // Dynamic estimation (only if we don't have API count)
          if (this.estimatedTotalTrips === 0 || data.data.length >= 450) {
            if (data.data.length >= 450) {
              // Still loading full pages (500 per page) - estimate conservatively
              const avgPerPage = this.allTrips.length / startPage;
              const estimatedRemainingPages = Math.min(10, Math.ceil(startPage * 0.2));
              const dynamicEstimate = Math.floor(this.allTrips.length + (avgPerPage * estimatedRemainingPages));
              
              // Only update estimate if we don't have API count
              if (this.estimatedTotalTrips === 0) {
                this.estimatedTotalTrips = dynamicEstimate;
              }
            } else {
              // Last page detected (less than 450 items), set exact total
              this.estimatedTotalTrips = this.allTrips.length;
            }
          }
          
          // Calculate percentage and time estimates
          if (this.estimatedTotalTrips > 0) {
            this.loadingPercentage = Math.min(99, Math.floor((this.tripsLoadedSoFar / this.estimatedTotalTrips) * 100));
            
            // Estimate time remaining
            const tripsPerSecond = this.tripsLoadedSoFar / this.elapsedTime;
            const remainingTrips = this.estimatedTotalTrips - this.tripsLoadedSoFar;
            this.estimatedTimeRemaining = Math.ceil(remainingTrips / tripsPerSecond);
          }
          
          console.log(`Total: ${this.allTrips.length} trips | Estimate: ~${this.estimatedTotalTrips} | Progress: ${this.loadingPercentage}%`);
          
          // If page has substantial data (450+ items out of 500), there might be more
          if (data.data.length >= 450) {
            // Continue loading next page with delay to avoid rate limiting
            console.log(`Continuing to page ${startPage + 1}...`);
            setTimeout(() => this.loadAllPagesRecursively(startPage + 1, 0), baseDelay);
          } else {
            // This was the last page (less than 450 items)
            console.log(`Last page detected (only ${data.data.length} items). Finishing...`);
            this.finishLoadingAll(false);
          }
        } else {
          // No more data
          console.log(`No data received on page ${startPage}. Finishing...`);
          this.finishLoadingAll(false);
        }
      },
      error => {
        console.error(`Error loading page ${startPage}:`, error);
        
        // Check if aborted
        if (this.loadingAborted) {
          this.finishLoadingAll(true);
          return;
        }
        
        // Retry logic with exponential backoff
        if (retryCount < maxRetries) {
          const retryDelay = baseDelay * Math.pow(2, retryCount + 1); // 1s, 2s, 4s
          console.log(`⚠️ Retrying page ${startPage} in ${retryDelay}ms (attempt ${retryCount + 1}/${maxRetries})...`);
          setTimeout(() => this.loadAllPagesRecursively(startPage, retryCount + 1), retryDelay);
        } else {
          console.error(`❌ Failed to load page ${startPage} after ${maxRetries} retries. Stopping.`);
          alert(`Lataaminen keskeytetty sivulla ${startPage}. Ladattu ${this.allTrips.length} matkaa.\n\nVirhe: ${error.message || 'CORS-proxy rate limit'}`);
          this.finishLoadingAll(false);
        }
      }
    );
  }

  private finishLoadingAll(wasAborted: boolean = false): void {
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
      
      if (wasAborted) {
        alert(`⚠️ Lataaminen keskeytetty käyttäjän toimesta.\nLadattu: ${this.allTrips.length.toLocaleString()} matkaa`);
      } else {
        alert(`✅ Kaikki matkat ladattu! Yhteensä: ${this.allTrips.length.toLocaleString()} matkaa`);
      }
    }, 500);
  }

  abortLoading(): void {
    if (confirm('⚠️ Haluatko varmasti keskeyttää lataamisen?\n\nTähän mennessä ladatut matkat säilytetään.')) {
      this.loadingAborted = true;
    }
  }

  formatTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}min ${secs}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${mins}min`;
    }
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
    // Check if trips have an 'id' field for true duplicate detection
    if (trips.length > 0 && trips[0].id !== undefined) {
      const seen = new Set();
      return trips.filter(trip => {
        if (seen.has(trip.id)) {
          return false;
        }
        seen.add(trip.id);
        return true;
      });
    }
    
    // No ID field - create a composite key from trip properties to detect duplicates
    const seen = new Set();
    return trips.filter(trip => {
      // Create unique key from multiple properties
      const key = `${trip.departure}-${trip.return}-${trip.departure_station_id}-${trip.departure_station_name}-${trip.return_station_id}-${trip.return_station_name}-${trip.duration_sec}-${trip.covered_distance_m}`;
      
      if (seen.has(key)) {
        console.log('Duplicate detected and removed:', key);
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

  loadStats(): void {
    // Calculate statistics from loaded trips
    if (this.allTrips.length === 0) {
      alert('Lataa ensin matkoja nähdäksesi tilastot');
      return;
    }

    const trips = this.allTrips;
    
    // Basic counts
    const totalTrips = trips.length;
    
    // Distance stats (in meters)
    const distances = trips.map(t => t.covered_distance_m);
    const totalDistance = distances.reduce((sum, d) => sum + d, 0);
    const avgDistance = totalDistance / totalTrips;
    const maxDistance = Math.max(...distances);
    const minDistance = Math.min(...distances);
    
    // Duration stats (in seconds)
    const durations = trips.map(t => t.duration_sec);
    const totalDuration = durations.reduce((sum, d) => sum + d, 0);
    const avgDuration = totalDuration / totalTrips;
    const maxDuration = Math.max(...durations);
    const minDuration = Math.min(...durations);
    
    // Speed stats (km/h)
    const speeds = trips.map(t => (t.covered_distance_m / 1000) / (t.duration_sec / 3600));
    const avgSpeed = speeds.reduce((sum, s) => sum + s, 0) / totalTrips;
    const maxSpeed = Math.max(...speeds);
    
    // Date range
    const departureDates = trips.map(t => new Date(t.departure).getTime());
    const firstTrip = new Date(Math.min(...departureDates));
    const lastTrip = new Date(Math.max(...departureDates));
    
    // Top stations
    const departureStations: {[key: string]: number} = {};
    const returnStations: {[key: string]: number} = {};
    
    trips.forEach(trip => {
      const depStation = trip.departure_station_name || 'Unknown';
      const retStation = trip.return_station_name || 'Unknown';
      
      departureStations[depStation] = (departureStations[depStation] || 0) + 1;
      returnStations[retStation] = (returnStations[retStation] || 0) + 1;
    });
    
    const topDepartures = Object.entries(departureStations)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
      
    const topReturns = Object.entries(returnStations)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    
    // Unique stations
    const allStationNames = new Set([
      ...Object.keys(departureStations),
      ...Object.keys(returnStations)
    ]);
    
    this.stats = {
      totalTrips,
      uniqueStations: allStationNames.size,
      dateRange: {
        firstTrip,
        lastTrip
      },
      duration: {
        averageSeconds: avgDuration,
        averageMinutes: avgDuration / 60,
        maxSeconds: maxDuration,
        minSeconds: minDuration,
        totalHours: totalDuration / 3600
      },
      distance: {
        averageMeters: avgDistance,
        averageKilometers: avgDistance / 1000,
        maxMeters: maxDistance,
        minMeters: minDistance,
        totalKilometers: totalDistance / 1000
      },
      speed: {
        averageKmh: avgSpeed,
        maxKmh: maxSpeed
      },
      topDepartures,
      topReturns
    };
    
    this.showStats = true;
    console.log('Stats calculated:', this.stats);
  }

  closeStats(): void {
    this.showStats = false;
  }
}