import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { Journey } from './models/journey.model';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BiketripService {
  // Use relative path for local dev (proxied), absolute for production
  private apiUrl = environment.production 
    ? 'https://citybikeapi.azurewebsites.net/api/CitybikeTripsMay2021'
    : '/api/CitybikeTripsMay2021';
    
  constructor(private http: HttpClient) { }

  public GetBikeTripsPerPage(
    pageNumber: number, 
    pageSize: number = 500,
    sortBy: string = 'departure',
    sortOrder: string = 'asc',
    search: string = ''
  ): Observable<any> {
    let params = `?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
    if (search) {
      params += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get<any>(`${this.apiUrl}${params}`);
  }

  public GetTotalTripsCount(search: string = ''): Observable<any> {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.http.get<any>(`${this.apiUrl}/count${params}`).pipe(
      catchError(error => {
        console.log('Count endpoint error:', error);
        return of({ totalTrips: 0 });
      })
    );
  }

  public GetTripsStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  public GetTripsCountByStation(stationId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count/by-station/${stationId}`);
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