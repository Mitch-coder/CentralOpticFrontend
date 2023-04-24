import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn:'root'
})
export class MyDataServices{
    constructor(private http:HttpClient){}
    

    getData():Observable<any[]>{
        const bearerToken = '------Please enter the Token---------';
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