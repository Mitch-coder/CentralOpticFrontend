import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';

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
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('nombreProducto'),
      this.dataService.getData('marca'),
      this.dataService.getData('producto'),
    ).pipe(
      map((data:any[])=>{
        let nombre:NombreProducto[] = data[0]
        let marca:Marca[] = data[1]
        let producto:Product[] = data[2]
        
         producto.forEach(element => {

          this.myData.push({
            codProducto:element.codProducto,
            marca: marca[element.idMarca - 1].marca,
            nombre: nombre[element.idNombreProducto - 1].nombreProducto,
            descripcion: element.descripcion,
            precioActual: element.precioActual,
            estadoProducto : element.estadoProducto
          })
        });
        return this.myData
      })
    )

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'CodProducto', def:'codProducto', dataKey:'codProducto'},
      {label:'marca', def:'marca', dataKey:'marca'},
      {label:'Nombre', def:'Nombre', dataKey:'nombre'},
      {label:'PrecioActual', def:'precioActual', dataKey:'precioActual'},
      {label:'EstadoProducto', def:'estadoProducto', dataKey:'estadoProducto'}
    ]
  }
}
