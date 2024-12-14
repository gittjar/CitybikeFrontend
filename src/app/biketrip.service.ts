import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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