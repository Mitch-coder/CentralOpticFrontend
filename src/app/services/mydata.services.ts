import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyDataServices {
  constructor(private http: HttpClient, private cookieService: CookieService) { }


  getData(endpoint: string): Observable<any[]> {
    const bearerToken: string = this.cookieService.get('token');
    localStorage.setItem('access_token', bearerToken);

    //This is the authentication about
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.http.get<any[]>('https://localhost:7210/centralopticapi/' + endpoint, httpOptions)
  }

  /* En el Json que se le pasa a body, o al objeto que se le pasa como parametro body No tiene que ir el identificador*/

  postData(endpoint: string, body: any): Promise<boolean> {
    const bearerToken: string = this.cookieService.get('token');
    localStorage.setItem('access_token', bearerToken);

    //This is the authentication about
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return new Promise<boolean>((resolve, reject) => {
      this.http.post('https://localhost:7210/centralopticapi/' + endpoint, body, httpOptions)
        .subscribe(
          response => {
            console.log('Insertado con éxito');
            resolve(true);
          },
          error => {
            console.log('Error al insertar los datos:', error);
            resolve(false);
          }
        );
    });
  }

  /* En el Json que se le pasa a body, o al objeto que se le pasa como parametro body No tiene que ir el identificador ya que en este caso solo se le pasa como parametro*/

  updateData(endpoint: string, body: any, Id: number): Promise<boolean> {

    // const success = true
    const bearerToken: string = this.cookieService.get('token');
    localStorage.setItem('access_token', bearerToken);
    //This is the authentication about
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };

    return new Promise<boolean>((resolve, reject) => {
    this.http.put('https://localhost:7210/centralopticapi/' + endpoint + '/' + Id, body, httpOptions)
      .subscribe(
        response => {
          console.log('Actualizado con éxito');
          resolve(true);
        },
        error => {
          console.log('Error al insertar los datos:', error);
          resolve(false);
        }
      );
    });
  }

  //Te devuelvo exito o True si el registro como tal no existe, te devuelve false si tiene registros ya

  deleteData(endpoint: string, Id: number): Promise<boolean> {

    // const success = true
    const bearerToken: string = this.cookieService.get('token');
    localStorage.setItem('access_token', bearerToken);
    //This is the authentication about
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };

    return new Promise<boolean>((resolve, reject) => {
    this.http.delete('https://localhost:7210/centralopticapi/' + endpoint + '/' + Id , httpOptions)
      .subscribe(
        response => {
          console.log('Eliminado con éxito');
          resolve(true);
        },
        error => {
          console.log('Error al eliminar los datos:', error);
          resolve(false);
        }
      );
    });
  }
  
}