import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';

interface Pago{
  idPago:number;
  numFactura:number;
  idFechaPago:number;
  monto:number;
  tipoPago:number;
}

interface FechaPago{
  idFechaPago:number;
  fechaPago:string;
}

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent {
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]
  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit'};
  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('pago'),
      this.dataService.getData('fechaPago')
    ).pipe(
      map((data:any[]) =>{
        let pago:Pago[] = data[0];
        let fechaPago: FechaPago[] = data[1];
        
        // opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit'};
        
        pago.forEach(element =>{
          let fecha= fechaPago.filter(e => e.idFechaPago == element.idFechaPago);

          let date:Date = new Date(fecha[0].fechaPago)
          const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

          this.myData.push(
            {idPago:element.idPago,
             fechaPago:formatoFecha,
             monto:element.monto,
             tipoPago:element.tipoPago? 'Credito' : 'Contado'
            })
        })
        return this.myData
      })
    )

    
    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'Identificador', def:'idPago', dataKey:'idPago'},
      {label:'Fecha Pago', def:'fechaPago', dataKey:'fechaPago'},
      {label:'Monto', def:'monto', dataKey:'monto'},
      {label:'Tipo de Pago', def:'tipoPago', dataKey:'tipoPago'}
    ]
  }
}
