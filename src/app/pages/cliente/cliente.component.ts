import { Component } from '@angular/core';
import { tap } from 'rxjs';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent {
  myData:any ;
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{
     this.myData$ = this.dataService
     .getData('cliente')
     .pipe(tap((data) =>(this.myData = data)))

     this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'IdCliente', def:'IdCliente', dataKey:'codCliente'},
      {label:'Cedula', def:'Cedula', dataKey:'cedula'},
      {label:'Nombre', def:'Nombre', dataKey:'nombres'},
      {label:'Apellido', def:'Apellido', dataKey:'apellidos'},
      {label:'Direccion', def:'Direccion', dataKey:'direccion'}
    ]
  }
}
