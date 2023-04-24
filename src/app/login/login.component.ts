import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators, FormBuilder} from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  hide: boolean = true;
  email!: string;
  password!: string;

  

  
  constructor(private authService: AuthService,private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    //this.authService.setLoggedIn(false);
  }

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })


  onSubmit() {
    if (this.email === 'test@gmail.com' && this.password === '123456') {
      this.authService.setLoggedIn(true);
      this.router.navigate(['/dashboard']);
    } else {
      alert('Usuario y/o contraseña incorrectos');
      console.log('Email:', this.email);
      console.log('Password:', this.password);
    }
    
    if (!this.loginForm.valid) {
      return;
    }
    console.log(this.loginForm.value);
  }
}
