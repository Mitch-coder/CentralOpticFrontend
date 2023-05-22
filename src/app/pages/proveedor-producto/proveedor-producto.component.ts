import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { elementAt, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';

interface ProveedorProducto{
  idProveedor_Producto:number;
  idProveedor:number;
  codProducto:number;
  idFechaObtencion:number;
  cantidad:number;
  costo:number;
}

interface FechaObtencion{
  idFechaObtencion:number;
  fechaObtencion:string;
}

interface Producto{
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

interface Proveedor{
  idProveedor:number;
  nombre:string;
  direccion:string;
  propietario:string;
}

@Component({
  selector: 'app-proveedor-producto',
  templateUrl: './proveedor-producto.component.html',
  styleUrls: ['./proveedor-producto.component.css']
})
export class ProveedorProductoComponent {
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]
  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit'};

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$ =forkJoin(
         this.dataService.getData('proveedorproducto'),
      this.dataService.getData('fechaobtencion'),
      this.dataService.getData('producto'),
      this.dataService.getData('nombreproducto'),
      this.dataService.getData('proveedor'),
    ).pipe(
      map((data:any[])=>{
        let proveedorProducto:ProveedorProducto[] = data[0];
        let fechaObtencion:FechaObtencion[] = data[1];
        let producto:Producto[] = data[2];
        let nombreProducto:NombreProducto[] = data[3];
        let proveedor:Proveedor[] = data[4];

        proveedorProducto.forEach(element =>{
          let fecha = fechaObtencion.filter(e => e.idFechaObtencion == element.idFechaObtencion);
          let product = producto.filter(e => e.codProducto == element.codProducto);
          let nameProduct = nombreProducto.filter(e => e.idNombreProducto == product[0].idNombreProducto);
          let prov = proveedor.filter(e => e.idProveedor == element.idProveedor);
 
          let date:Date = new Date(fecha[0].fechaObtencion)
          const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

          this.myData.push(
            {
              id:element.idProveedor_Producto,
              nombreProveedor:prov[0].nombre,
              nombreProducto:nameProduct[0].nombreProducto,
              descripProducto:product[0].descripcion,
              fechaObtencion:formatoFecha,
              cantidad:element.cantidad,
              costo:element.costo
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
      {label:'ID', def:'id', dataKey:'id'},
      {label:'Nombre Proveedor', def:'nombreProveedor', dataKey:'nombreProveedor'},
      {label:'Nombre Producto', def:'nombreProducto', dataKey:'nombreProducto'},
      {label:'Descripción Producto', def:'descripProducto', dataKey:'descripProducto'},
      {label:'Fecha Obtención', def:'fechaObtencion', dataKey:'fechaObtencion'},
      {label:'Cantidad', def:'cantidad', dataKey:'cantidad'},
      {label:'Costo', def:'costo', dataKey:'costo'}
    ]
  }
}
