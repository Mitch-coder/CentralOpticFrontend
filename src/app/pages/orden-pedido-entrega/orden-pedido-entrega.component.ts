import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { elementAt, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';

interface OrdenPedidoEntrega{
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
  selector: 'app-orden-pedido-entrega',
  templateUrl: './orden-pedido-entrega.component.html',
  styleUrls: ['./orden-pedido-entrega.component.css']
})
export class OrdenPedidoEntregaComponent {
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$=forkJoin(
      this.dataService.getData('ordenpedidoentrega'),
      this.dataService.getData('entrega')
    ).pipe(
      map((data:any[])=>{
        let ordenPedidoEntrega:OrdenPedidoEntrega[] = data[0];
        let entrega:Entrega[] = data[1];

        ordenPedidoEntrega.forEach( element =>{
          let ent = entrega.filter(e => e.codEntrega == element.codEntrega);

          this.myData.push(
            {
              numOrden:element.numOrden,
              codEntrega:ent[0].codEntrega,
              fechaEntrega:ent[0].fechaEntrega
            }
          )
        })
        return this.myData
      })
    )

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'NumOrden', def:'numOrden', dataKey:'numOrden'},
      {label:'CodEntrega', def:'codEntrega', dataKey:'codEntrega'},
      {label:'FechaEntrega', def:'fechaEntrega', dataKey:'fechaEntrega'}
    ]
  }
}
