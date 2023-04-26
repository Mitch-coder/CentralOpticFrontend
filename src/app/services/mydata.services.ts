import { HttpClient, HttpHeaders } from '@angular/common/http';
<<<<<<< HEAD
import { Injectable } from '@angular/core';
=======
import {Injectable} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
>>>>>>> 10aa17d296d941248c998c3f9b0f336d3fc2c91c
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
<<<<<<< HEAD
export class MyDataServices {
  constructor(private http: HttpClient) { }


  getData(): Observable<any[]> {
    const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IlJvYmVydG8iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJjZW50cmFsb3B0aWMuc2FjQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2dpdmVubmFtZSI6IlJvYmVydG8iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zdXJuYW1lIjoiT3JvemNvIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW5pc3RyYWRvciIsImV4cCI6MTY4MjQ4MzA1OCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDIwMCIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjQyMDAifQ.sC2KLd73tSkKyse1U6TK8tQe0nZnBujTVq7czI-z43U';
    localStorage.setItem('access_token', bearerToken);

    //This is the authentication about
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.http.get<any[]>('https://localhost:7210/centralopticapi/cliente', httpOptions)
=======
export class MyDataServices{
    constructor(private http:HttpClient, private cookieService:CookieService){}
    

    getData(endpoint:string):Observable<any[]>{
      const bearerToken:string = this.cookieService.get('token');
      localStorage.setItem('access_token', bearerToken);
  
      //This is the authentication about
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        })
      };
      return this.http.get<any[]>('https://localhost:7210/centralopticapi/'+endpoint,httpOptions)
>>>>>>> 10aa17d296d941248c998c3f9b0f336d3fc2c91c
  }
}