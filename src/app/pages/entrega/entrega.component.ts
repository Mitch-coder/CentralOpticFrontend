import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { tap } from 'rxjs';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.css']
})
export class EntregaComponent {
    
  myData: Array<object> = [] ;
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}
  ngOnInit(): void{

    this.myData$ = this.dataService
    .getData('entrega')
    .pipe(tap((data) =>{
     console.log(data)
     this.myData = data
    }))

    this.setTableColumns();
 }
 
 setTableColumns(){
   this.tableColumns=[
     {label:'IdEstadoEntrega', def:'idEstadoEntrega', dataKey:'idEstadoEntrega'},
     {label:'Codigo de entrega', def:'codEntrega', dataKey:'codEntrega'},
     {label:'Fecha de entrega', def:'fechaEntrega', dataKey:'fechaEntrega'},
     {label:'Descripcion', def:'descripcion', dataKey:'descripcion'},
   
   ]
 }

}
