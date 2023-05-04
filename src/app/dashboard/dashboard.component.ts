import { Component } from '@angular/core';
import { MyDataServices } from '../services/mydata.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {
  
  Nombre:string = "";

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{
    this.dataService
     .getData('acceso').subscribe((data:any) =>{
      this.Nombre = data.nombres + ' ' +  data.apellidos;
      }
     );
  }
}
