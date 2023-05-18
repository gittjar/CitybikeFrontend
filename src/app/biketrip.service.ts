import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BiketripService {

  constructor(private http: HttpClient) { }

  // get biketrips
  public GetBikeTrips(): any {
    const trips = this.http.get('/biketrips');
    return trips;

  }

}
