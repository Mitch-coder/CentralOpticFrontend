import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class MyDataServices{
    constructor(private http:HttpClient){}
    

    getData():Observable<any[]>{
        const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IlJvYmVydG8iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJjZW50cmFsb3B0aWMuc2FjQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2dpdmVubmFtZSI6IlJvYmVydG8iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zdXJuYW1lIjoiT3JvemNvIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW5pc3RyYWRvciIsImV4cCI6MTY4MjM1OTQ5OSwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDIwMCIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjQyMDAifQ.0xuDXUjEuElFD0M799bTQuoW4ThrR4_6Lauu5mzr6M8';
        localStorage.setItem('access_token', bearerToken);
    
        //This is the authentication about
        const httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
          })
        };
        return this.http.get<any[]>('https://localhost:7210/centralopticapi/cliente',httpOptions)
    }
}