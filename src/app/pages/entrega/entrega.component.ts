import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { forkJoin, map, tap } from 'rxjs';

interface Entrega{
  codEntrega:number;
  idEstadoEntrega:number;
  fechaEntrega:string;
  descripcion:string;
}
interface EstadoEntrega{
  idEstadoEntrega:number;
  estadoEntrega:string;
}


@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.css']
})


export class EntregaComponent {
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]
  constructor(private dataService:MyDataServices){}

ngOnInit(): void{

  this.myData$=forkJoin(
    this.dataService.getData('entrega'),
    this.dataService.getData('estadoentrega'),
  ).pipe(
    map((data:any[])=>{
      let entrega:Entrega[] = data[0];
      let estadoEntrega:EstadoEntrega[] = data[1];
    

      entrega.forEach( element =>{
        let state =estadoEntrega.filter(e => e.idEstadoEntrega == element.idEstadoEntrega);

        this.myData.push(
          {
            estadoEntrega:state[0].estadoEntrega,
            codEntrega:element.codEntrega,
            fechaEntrega:element.fechaEntrega,
            descripcion:element.descripcion
          }
        )
      })
      console.log(this.myData)
      return this.myData
    })
  )

  this.setTableColumns();
}
 
 setTableColumns(){
   this.tableColumns=[
     {label:'EstadoEntrega', def:'estadoEntrega', dataKey:'estadoEntrega'},
     {label:'Codigo de entrega', def:'codEntrega', dataKey:'codEntrega'},
     {label:'Fecha de entrega', def:'fechaEntrega', dataKey:'fechaEntrega'},
     {label:'Descripcion', def:'descripcion', dataKey:'descripcion'},
   
   ]
 }

}
