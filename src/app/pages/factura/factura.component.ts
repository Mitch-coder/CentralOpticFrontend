import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';

interface Factura{
  numFactura:number;
  idEstadoFactura:number;
  idFechaFactura:number;
  numEmpleado:number;
  codCliente:number
  impuestos:number;
  descuento:number;
}

interface EstadoFactura{
  idEstadoFactura:number;
  estadoFactura:number;
}

interface FechaFactura{
  idFechaFactura:number;
  fechaEmision:number;
}

interface Empleado{
  numEmpleado:number
  nombres:string;
  apellidos:string;
  direccion:string;
}

interface Cliente{
  codCliente:number;
  cedula:string;
  nombres:string;
  apellidos:string;
  direccion:string;
}

interface DetalleFactura{
  idDetalleFactura:number;
  numFactura:number;
  codProducto:number;
  cantidad:number;
  precioUni:number;
}

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent {
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('factura'),
      this.dataService.getData('estadofactura'),
      this.dataService.getData('fechafactura'),
      this.dataService.getData('empleado'),
      this.dataService.getData('cliente'),
      this.dataService.getData('detallefactura'),
    ).pipe(
      map((data:any[])=>{
        let factura:Factura[]= data[0];
        let estadoFactura:EstadoFactura[] = data[1];
        let fechaFactura:FechaFactura[] = data[2];
        let empleado:Empleado[] = data[3];
        let cliente:Cliente[] = data[4];
        let detalleFactura:DetalleFactura[] = data[5];

        factura.forEach(element => {
          let subTotal = (detalleFactura[element.numFactura -1].cantidad 
            * detalleFactura[element.numFactura - 1].precioUni)

          this.myData.push(
            {
              numFactura:element.numFactura,
              estadoFactura:estadoFactura[element.idEstadoFactura - 1].estadoFactura,
              fechaFactura:fechaFactura[element.idFechaFactura - 1].fechaEmision,
              empleado:empleado[element.numEmpleado - 1].nombres,
              cliente:cliente[element.codCliente - 1].nombres,
              subTotal:subTotal,
              impuesto:element.impuestos,
              descuento:element.descuento,
              total: (subTotal - (element.descuento * subTotal))
              +(subTotal * element.impuestos)
            }
          )
        });
        return this.myData
      })
    )

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'NumFactura', def:'numFactura', dataKey:'numFactura'},
      {label:'EstadoFactura', def:'estadoFactura', dataKey:'estadoFactura'},
      {label:'FechaFactura', def:'fechaFactura', dataKey:'fechaFactura'},
      {label:'Empleado', def:'empleado', dataKey:'empleado'},
      {label:'Cliente', def:'cliente', dataKey:'cliente'},
      {label:'SubTotal', def:'subTotal', dataKey:'subTotal'},
      {label:'Impuesto', def:'impuesto', dataKey:'impuesto'},
      {label:'Descuento', def:'descuento', dataKey:'descuento'},
      {label:'Total', def:'total', dataKey:'total'},
    ]
  }
}
