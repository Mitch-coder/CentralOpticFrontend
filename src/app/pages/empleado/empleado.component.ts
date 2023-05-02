import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent {
  myData: Array<object> = [] ;
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

     this.myData$ = this.dataService
     .getData('empleado')
     .pipe(tap((data) =>{
      //console.log(data)
      this.myData = data
     }))

     this.setTableColumns();
  }
  
  setTableColumns(){
    this.tableColumns=[
      {label:'IdEmpleado', def:'NumEmpleado', dataKey:'numEmpleado'},
      {label:'Nombre', def:'nombres', dataKey:'nombres'},
      {label:'Apellido', def:'apellidos', dataKey:'apellidos'},
      {label:'Direccion', def:'direccion', dataKey:'direccion'}
    ]
  }
}
