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
  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit'};

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
          
          let date:Date = new Date(ent[0].fechaEntrega)
          const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
          this.myData.push(
            {
              numOrden:element.numOrden,
              codEntrega:ent[0].codEntrega,
              fechaEntrega:formatoFecha
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
      {label:'Numero de Orden', def:'numOrden', dataKey:'numOrden'},
      {label:'Codido Entrega', def:'codEntrega', dataKey:'codEntrega'},
      {label:'Fecha Entrega', def:'fechaEntrega', dataKey:'fechaEntrega'}
    ]
  }
}
