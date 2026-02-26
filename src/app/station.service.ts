import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Station } from './models/station.model';

@Injectable({
  providedIn: 'root'
})
export class StationService {
  constructor(private http: HttpClient) { }

  BASEURL = 'https://citybikeapi.azurewebsites.net/api/Stations/';
  
  public getStations(): Observable<Station[]> {
    return this.http.get<Station[]>(this.BASEURL);
  }

  getStation(id: number): Observable<Station> {
    return this.http.get<Station>(`${this.BASEURL}${id}`);
  }

  public getStationDetails(id: number): Observable<any> {
    return this.http.get(`${this.BASEURL}${id}/details`);
  }
}