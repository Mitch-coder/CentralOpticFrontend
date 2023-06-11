import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators, FormBuilder} from '@angular/forms'
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

interface Acceso {
  nombreUsuario: string,
  clave: string
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{
  hide: boolean = true;
  email!: string;
  password!: string;

  private acceso:Acceso ={
    nombreUsuario: '',
    clave: ''
  }
  

  
  constructor(private authService: AuthService,private fb: FormBuilder, private router: Router,
    private cookieService: CookieService,
    private apiService:ApiService) {}

  ngOnInit() {
    //this.authService.setLoggedIn(false);
  }

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.min(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })


  onSubmit() {

    // if (this.email === 'test@gmail.com' && this.password === '123456') {
    //   this.authService.setLoggedIn(true);
    //   this.router.navigate(['/dashboard']);
    // } else {
    //   alert('Usuario y/o contraseña incorrectos');
    //   console.log('Email:', this.email);
    //   console.log('Password:', this.password);
    // }
    
    // if (!this.loginForm.valid) {
    //   return;
    // }
    // console.log(this.loginForm.value);

    this.acceso.nombreUsuario = this.email
    this.acceso.clave = this.password

    // console.log(this.acceso)

    this.apiService.postAcceso('acceso',this.acceso)
    .subscribe( (respuesta:any) => {

      // console.log(respuesta.token)
      this.cookieService.set('token', respuesta.token )
      //this.authService.setLoggedIn(true);
      this.router.navigate(['/dashboard']);

    }, (error) => { 
      // console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al ingresar los datos'
      })
    //   console.log('Email:', this.email);
    //   console.log('Password:', this.password);
    })

  }
}
