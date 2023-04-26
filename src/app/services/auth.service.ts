import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean = false; 

  constructor() {}

  setLoggedIn(value: boolean): void {
    this.isLoggedIn = value;
  }

  getLoggedIn(): boolean {
    return this.isLoggedIn;
  }
}
