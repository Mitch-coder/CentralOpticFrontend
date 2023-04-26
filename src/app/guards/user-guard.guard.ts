import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuardGuard implements CanActivate {

  constructor(private cookieService: CookieService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const cookieCheck = this.cookieService.check('token')
    // const cookieToken = this.cookieService.get('token')

    if (!cookieCheck) {
      this.router.navigate(['/', 'login']);
      return false;
    } else {

      // try {
      //   const decodedToken = verify(cookieToken, 'eJ%2pak5hqC9Phnfy5HK');
      //   console.log('El token es válido. Datos decodificados:', decodedToken);
      //   return true;
      // } catch (error:any) {
      //   console.log('El token no es válido. Error:', error.message);
      //   this.router.navigate(['/','login']);
      //   return false;
      // }
      return true;

    }

  }



}
