import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }


  // base url
  BASEURL = 'https://corsproxy.io/?https://citybikeapi.azurewebsites.net/api/Stations/';
  
  public getStations():any {
    //const stations = this.http.get('/stations');
    const stations = this.http.get(this.BASEURL);
    return stations;
  }

  getStation(id: number):any {
   // const station = this.http.get('stations/'+id)
    const station = this.http.get(this.BASEURL+id);
    return station;
  }

  public getStationDetails(id: number): Observable<any> {
    return this.http.get(`${this.BASEURL}${id}/details`);
  }


}
