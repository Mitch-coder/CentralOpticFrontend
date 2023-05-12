import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { tap } from 'rxjs';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent {


  myData: Array<object> = [] ;
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}
  ngOnInit(): void{

    this.myData$ = this.dataService
    .getData('proveedor')
    .pipe(tap((data) =>{
     console.log(data)
     this.myData = data
    }))

    this.setTableColumns();
 }
 
 setTableColumns(){
   this.tableColumns=[
     {label:'IdProveedor', def:'idProveedor', dataKey:'idProveedor'},
     {label:'Nombre', def:'nombre', dataKey:'nombre'},
     {label:'Propietario', def:'propietario', dataKey:'propietario'},
     {label:'Direccion', def:'direccion', dataKey:'direccion'}
   ]
 }

}
