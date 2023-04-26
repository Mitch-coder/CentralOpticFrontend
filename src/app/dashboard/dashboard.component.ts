import { Component } from '@angular/core';
import { MyDataServices } from '../services/mydata.services';
import { HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { TableColumn } from '../modules/table/models/table-column';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent {
  
  myData:any ;
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{
<<<<<<< HEAD
      this.myData$ = this.dataService
     .getData()
=======
     this.myData$ = this.dataService
     .getData('cliente')
>>>>>>> 10aa17d296d941248c998c3f9b0f336d3fc2c91c
     .pipe(tap((data) =>(this.myData = data)))

     this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'Cedula', def:'Cedula', dataKey:'cedula'},
      {label:'Nombre', def:'Nombre', dataKey:'nombres'},
      {label:'Apellido', def:'Apellido', dataKey:'apellidos'},
      {label:'Direccion', def:'Direccion', dataKey:'direccion'}
    ]
  }


}
