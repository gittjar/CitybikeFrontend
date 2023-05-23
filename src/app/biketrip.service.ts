import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BiketripService {

  constructor(private http: HttpClient) { }

  // get biketrips
  // ?page=$1&limit=50
  public GetBikeTrips(): any {
    const trips = this.http.get('/biketrips');
    return trips;
  }

  public GetBikeTripsPerPage(pagenumber: number): any {
    const trips = this.http.get('/biketrips?pageNumber='+pagenumber+'&pageSize=200')
    return trips;
  }


  
}
