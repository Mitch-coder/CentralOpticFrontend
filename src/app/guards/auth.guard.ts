import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,private router: Router) {}

  canActivate(): boolean {
    // Check if user is logged in (you can implement your own logic here)
    const isLoggedIn = this.authService.getLoggedIn();

    if (isLoggedIn) {
      return true;
    } else {
      // Redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}
