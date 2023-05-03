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

interface Marca{
  idMarca:number;
  marca:string;
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

}
