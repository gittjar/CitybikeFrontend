import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }


  // base url
  BASEURL = 'https://corsproxy.io/?https://citybikeapi.azurewebsites.net/api/Stations/';
  
  public getStations():any {
    // for localhos
    //const stations = this.http.get('/stations');
    const stations = this.http.get(this.BASEURL);
    return stations;
  }

  getStation(id: number):any {
   // const station = this.http.get('stations/'+id)
    const station = this.http.get(this.BASEURL+id);
    return station;
  }


}
