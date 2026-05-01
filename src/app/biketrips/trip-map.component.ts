import { Component, Input, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';

// Shared promise so all instances wait for the same script load
let leafletLoadPromise: Promise<void> | null = null;

function loadLeaflet(): Promise<void> {
  if ((window as any)['L']) return Promise.resolve();
  if (leafletLoadPromise) return leafletLoadPromise;
  leafletLoadPromise = new Promise(resolve => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
  return leafletLoadPromise;
}

@Component({
  selector: 'app-trip-map',
  template: `<div #mapContainer class="trip-map-container"></div>`,
  styleUrls: ['./trip-map.component.css']
})
export class TripMapComponent implements AfterViewInit, OnDestroy {
  @Input() startLat!: number;
  @Input() startLng!: number;
  @Input() endLat!: number;
  @Input() endLng!: number;
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private mapInstance: any;

  ngAfterViewInit(): void {
    if (!this.startLat || !this.startLng || !this.endLat || !this.endLng) return;
    requestAnimationFrame(() => requestAnimationFrame(() => this.initMap()));
  }

  initMap(): void {
    loadLeaflet().then(() => {
      const L = (window as any)['L'];
      if (!L || !this.mapContainer?.nativeElement) return;

      const start: [number, number] = [+this.startLat, +this.startLng];
      const end: [number, number] = [+this.endLat, +this.endLng];

      this.mapInstance = L.map(this.mapContainer.nativeElement, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(this.mapInstance);

      L.polyline([start, end], {
        color: '#1976d2',
        weight: 3,
        opacity: 0.85
      }).addTo(this.mapInstance);

      const greenIcon = L.divIcon({ className: '', html: '<div style="width:10px;height:10px;background:#2e7d32;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>', iconSize: [10, 10], iconAnchor: [5, 5] });
      const redIcon   = L.divIcon({ className: '', html: '<div style="width:10px;height:10px;background:#c62828;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>', iconSize: [10, 10], iconAnchor: [5, 5] });

      L.marker(start, { icon: greenIcon, title: 'Lähtö' }).addTo(this.mapInstance);
      L.marker(end,   { icon: redIcon,   title: 'Palautus' }).addTo(this.mapInstance);

      const bounds = L.latLngBounds([start, end]);
      this.mapInstance.invalidateSize();
      this.mapInstance.fitBounds(bounds, { padding: [18, 18] });
      // Second invalidate after tiles have had time to render
      setTimeout(() => this.mapInstance?.invalidateSize(), 300);
    });
  }

  ngOnDestroy(): void {
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }
  }
}
