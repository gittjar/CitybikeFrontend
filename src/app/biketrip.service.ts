import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { Journey } from './models/journey.model';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BiketripService {
  private apiUrl = 'https://corsproxy.io/?url=https://citybikeapi.azurewebsites.net/api/CitybikeTripsMay2021';

  constructor(private http: HttpClient) { }

  public GetBikeTripsPerPage(pageNumber: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?pageNumber=${pageNumber}`);
  }

  public GetTotalTripsCount(): Observable<number> {
    // First try to get from a dedicated count endpoint
    return this.http.get<number>(`${this.apiUrl}/count`).pipe(
      catchError(error => {
        console.log('Count endpoint not available, will estimate dynamically');
        return of(0); // Return 0 to indicate count not available
      })
    );
  }

  public GetTopDepartureStations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/TopDepartureStations`);
  }

  public GetTopReturnStations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/TopReturnStations`);
  }

  GetTripsByStationId(stationId: number): Observable<Journey[]> {
    return this.http.get<Journey[]>(`${this.apiUrl}/station/${stationId}`);
  }

  public GetAllStations(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/AllStations`);
  }
}