import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getAcceso(endpoint: string) {
    return this.http.get('https://localhost:7210/centralopticapi/'+endpoint);
  }

  public postAcceso(endpoint: string, body: Object) {
    return this.http.post('https://localhost:7210/centralopticapi/'+endpoint, body);
  }

}
