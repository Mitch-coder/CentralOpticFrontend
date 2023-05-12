import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { elementAt, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';

interface OrdenPedido{
  idOrdenPedido_Entrega:string;
  numOrden:number;
  codEntrega:number;
}

interface Entrega{
  codEntrega:number;
  idEstadoEntrega:number;
  fechaEntrega:string;
  descripcion:string;
}

@Component({
  selector: 'app-orden-pedido',
  templateUrl: './orden-pedido.component.html',
  styleUrls: ['./orden-pedido.component.css']
})
export class OrdenPedidoComponent {
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{
    this.myData$ = this.dataService
    .getData('ordenpedido')
    .pipe(tap((data) =>{
     console.log(data)
     this.myData = data
    }))

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'CodProducto', def:'codProducto', dataKey:'codProducto'},
      {label:'Costo', def:'costo', dataKey:'costo'},
      {label:'Descripcion', def:'descripcion', dataKey:'descripcion'},
      {label:'IdEstadoPedido', def:'idEstadoPedido', dataKey:'idEstadoPedido'},
      {label:'IdFechaPedido', def:'idFechaPedido', dataKey:'idFechaPedido'},
      {label:'IdLaboratorio', def:'idLaboratorio', dataKey:'idLaboratorio'},
      {label:'N* Empleado', def:'numEmpleado', dataKey:'numEmpleado'},
      {label:'N* Examen', def:'numExamen', dataKey:'numExamen'},
      {label:'N* Orden', def:'numOrden', dataKey:'numOrden'},

    ]
  }

}
