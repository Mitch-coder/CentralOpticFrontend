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

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('pago'),
      this.dataService.getData('fechaPago')
    ).pipe(
      map((data:any[]) =>{
        let pago:Pago[] = data[0];
        let fechaPago: FechaPago[] = data[1];
        
        pago.forEach(element =>{
          let date= fechaPago.filter(e => e.idFechaPago == element.idFechaPago);

          this.myData.push(
            {idPago:element.idPago,
             fechaPago:date[0].fechaPago,
             monto:element.monto,
             tipoPago:element.tipoPago
            })
        })
        return this.myData
      })
    )

    
    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'IdPago', def:'idPago', dataKey:'idPago'},
      {label:'FechaPago', def:'fechaPago', dataKey:'fechaPago'},
      {label:'Monto', def:'monto', dataKey:'monto'},
      {label:'TipoPago', def:'tipoPago', dataKey:'tipoPago'}
    ]
  }
}
