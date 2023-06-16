import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { map, mergeMap, tap, elementAt } from 'rxjs';
import { forkJoin } from 'rxjs';

interface RegistroBodega{
  idRegistro_Bodega:number;
  idBodega:number;
  codProducto:number;
  cantidad:number;
}

interface Bodega{
  idBodega:number;
  nombre:string;
  direccion:string;
  telefono:string;
  correo:string;
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
@Component({
  selector: 'app-registro-bodega',
  templateUrl: './registro-bodega.component.html',
  styleUrls: ['./registro-bodega.component.css']
})
export class RegistroBodegaComponent {
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('registrobodega'),
      this.dataService.getData('bodega'),
      this.dataService.getData('producto'),
      this.dataService.getData('nombreproducto')
    ).pipe(
      map((data:any[])=>{
        let resgitroBodega:RegistroBodega[] = data[0];
        let bodega:Bodega[] = data[1];
        let producto:Producto[] = data[2];
        let nombreProducto:NombreProducto[]= data[3];

        console.log(data[0])

        resgitroBodega.forEach(element => {
          let product = producto.filter(e => e.codProducto ==element.codProducto);
          let nameProduct = nombreProducto.filter(e => e.idNombreProducto == product[0].idNombreProducto);
          let bod = bodega.filter(e => e.idBodega == element.idBodega);
          this.myData.push(
            {
              idRegistroBodega:element.idRegistro_Bodega,
              bodega:bod[0].nombre,
              nombreProducto:nameProduct[0].nombreProducto,
              descripProducto:product[0].descripcion,
              cantidad:element.cantidad
            })
        })
        return this.myData
      })
    )

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'Identificador', def:'idRegistroBodega', dataKey:'idRegistroBodega'},
      {label:'Bodega', def:'bodega', dataKey:'bodega'},
      {label:'Nombre Producto', def:'nombreProductp', dataKey:'nombreProducto'},
      {label:'Descripcion Producto', def:'descripProducto', dataKey:'descripProducto'},
      {label:'Cantidad', def:'cantidad', dataKey:'cantidad'}
    ]
  }
}
