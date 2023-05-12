import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { tap } from 'rxjs';


@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.css']
})
export class LaboratorioComponent {
  
  myData: Array<object> = [] ;
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}
  ngOnInit(): void{

    this.myData$ = this.dataService
    .getData('laboratorio')
    .pipe(tap((data) =>{
     console.log(data)
     this.myData = data
    }))

    this.setTableColumns();
 }
 
 setTableColumns(){
   this.tableColumns=[
     {label:'IdLaboratorio', def:'idLaboratorio', dataKey:'idLaboratorio'},
     {label:'Nombre', def:'nombre', dataKey:'nombre'},
     {label:'Correo', def:'correo', dataKey:'correo'},
     {label:'Direccion', def:'direccion', dataKey:'direccion'},
   
   ]
 }


}
