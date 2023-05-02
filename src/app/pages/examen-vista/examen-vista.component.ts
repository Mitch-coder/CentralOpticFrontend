import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { elementAt, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';

interface ExamenVista{
  numExamen:number;
  codCliente:number;
  idFechaExamen:number;
  ojoIzquierdo:number;
  ojoDerecho:number;
  descripLenteIzq:string;
  descripLenteDer:string;
}

interface FechaExamen{
  idFechaExamen:number;
  fechaExamen:string;
}

interface Cliente{
  codCliente:number;
  cedula:string;
  nombres:string;
  apellidos:string;
  direccion:string;
}

@Component({
  selector: 'app-examen-vista',
  templateUrl: './examen-vista.component.html',
  styleUrls: ['./examen-vista.component.css']
})
export class ExamenVistaComponent {
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('examenvista'),
      this.dataService.getData('fechaexamen'),
      this.dataService.getData('cliente')
    ).pipe(
      map((data:any[])=>{
        let examenVista:ExamenVista[] = data[0];
        let fechaExamen:FechaExamen[] = data[1];
        let cliente:Cliente[] = data[2];
        
        examenVista.forEach(element =>{
          let client = cliente.filter(e => e.codCliente == element.codCliente)
          let date = fechaExamen.filter(e => e.idFechaExamen == element.idFechaExamen)
          this.myData.push({
            numExamen:element.numExamen,
            cliente: client[0].nombres,
            fechaExamen: date[0].fechaExamen,
            ojoIzquierdo:element.ojoIzquierdo,
            ojoDerecho:element.ojoDerecho,
            descripLenteIzq:element.descripLenteIzq,
            descripLenteDer:element.descripLenteDer
          })
        })
        return this.myData;
      })
    )

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'NumExamen', def:'numExamen', dataKey:'numExamen'},
      {label:'Cliente', def:'cliente', dataKey:'cliente'},
      {label:'FechaExamen', def:'fechaExamen', dataKey:'fechaExamen'},
      {label:'OjoIzquierdo', def:'ojoIzquierdo', dataKey:'ojoIzquierdo'},
      {label:'OjoDerecho', def:'ojoDerecho', dataKey:'ojoDerecho'},
      {label:'DescripLenteIzq', def:'descripLenteIzq', dataKey:'descripLenteIzq'},
      {label:'DescripLenteDer', def:'descripLenteDer', dataKey:'descripLenteDer'}
    ]
  }
}
