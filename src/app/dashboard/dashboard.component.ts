import { Component } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent {
  
  constructor(private fb: FormBuilder){

  }

  f = {
    'name':['',Validators.required],
    'email':['',[Validators.required,Validators.email]]
  }

  formUser = this.fb.group(this.f);
  
  result(d:string ){
    return this.formUser.get(d) as FormControl;
  }

  get name(){
    return this.formUser.get('name') as FormControl;
  }

  get email(){
    return this.formUser.get('email') as FormControl;
  }

  // formUser = new FormGroup({
  //   'name': new FormControl('',Validators.required),
  //   'email': new FormControl('',[Validators.required,Validators.email])
  // });
  
  procesar(){
    console.log(this.formUser.value)
  }

  item:any;

}
