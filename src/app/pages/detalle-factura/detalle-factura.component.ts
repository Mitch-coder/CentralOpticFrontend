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

interface DetalleFactura{
  idDetalleFactura:number;
  numFactura:number;
  codProducto:number;
  cantidad:number;
  precioUni:number;
}

interface Product{
  codProducto:number;
  idMarca:number;
  idNombreProducto:number;
  descripcion:string;
  precioActual:number;
  estadoProducto:boolean
}


interface NombreProducto{
  idNombreProducto:number;
  nombreProducto:string;
}

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: ['./detalle-factura.component.css']
})
export class DetalleFacturaComponent {
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('detallefactura'),
      this.dataService.getData('factura'),
      this.dataService.getData('producto'),
      this.dataService.getData('nombreproducto')
    ).pipe(
      map((data:any[]) => {
        let detalleFactura:DetalleFactura[] = data[0];
        let factura:Factura[] = data[1];
        let producto:Product[] = data[2];
        let nombreProducto:NombreProducto[] = data[3];

        detalleFactura.forEach(element => {
          let product = producto.filter( e => e.codProducto == element.codProducto)
          let nameProduct = nombreProducto.filter(e => e.idNombreProducto == product[0].idNombreProducto)
          let fac = factura.filter(e => e.numFactura == element.numFactura)

          let subTotal = (element.cantidad 
            * element.precioUni)
          this.myData.push({
            numFactura:element.numFactura,
            nombreProducto:nameProduct[0].nombreProducto,
            descripProducto:product[0].descripcion,
            cantidad:element.cantidad,
            precioUni:element.precioUni,
            subTotal: subTotal
          })
        })
        return this.myData;
      })
    )

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'Numero Factura', def:'numFactura', dataKey:'numFactura'},
      {label:'Nombre Producto', def:'nombreProductp', dataKey:'nombreProducto'},
      {label:'Descripcion Producto', def:'descripProducto', dataKey:'descripProducto'},
      {label:'Cantidad', def:'cantidad', dataKey:'cantidad'},
      {label:'Precio Unitario', def:'precioUni', dataKey:'precioUni'},
      {label:'Precio Total', def:'subTotal', dataKey:'subTotal'}
    ]
  }
}
