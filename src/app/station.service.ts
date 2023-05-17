import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }

  //get all stations from localhost
  public getStations(): Observable<any> {
    const BASEURL = 'https://localhost:7297/api/Stations';
    return this.http.get<any>(BASEURL);
  }


}
