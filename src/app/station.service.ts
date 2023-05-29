import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }

  //get all stations from localhost
  public getStations():any {
    const stations = this.http.get('/stations');
    return stations;
  }

  getStation(id: number):any {
    const station = this.http.get('stations/'+id)
    return station;
  }


}
