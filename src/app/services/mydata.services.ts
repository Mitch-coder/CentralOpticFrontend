import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
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
  }
}