import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BiketripService {

  constructor(private http: HttpClient) { }

  // get biketrips
  // ?page=$1&limit=50
  Baseurl_common = 'https://corsproxy.io/?https://citybikeapi.azurewebsites.net/api/CitybikeTrips';
  public GetBikeTrips(): any {
    const trips = this.http.get(this.Baseurl_common);
    return trips;
  }

  Baseurl_biketripsMay2021 = 'https://corsproxy.io/?https://citybikeapi.azurewebsites.net/api/CitybikeTripsMay2021';
  
  public GetBikeTripsPerPage(pagenumber: number): any {
    const trips = this.http.get(this.Baseurl_biketripsMay2021+'?pageNumber='+pagenumber+'&pageSize=500')
    return trips;
  }


  
}
