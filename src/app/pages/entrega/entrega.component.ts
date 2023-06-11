import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { forkJoin, map, tap } from 'rxjs';

interface Entrega{
  codEntrega:number;
  idEstadoEntrega:number;
  fechaEntrega:string;
  descripcion:string;
}
interface EstadoEntrega{
  idEstadoEntrega:number;
  estadoEntrega:string;
}

interface OrdenPedidoEntrega{
  idOrdenPedido_Entrega:string;
  numOrden:number;
  codEntrega:number;
}

interface OrdenPedido{
  numOrden:number;
  numExamen:number;
  numEmpleado:number;
  idLaboratorio:number;
  codProducto:number;
  idEstadoPedido:number;
  idFechaPedido:number;
  costo:number;
  descripcion:string;
}

interface EstadoPedido{
  idEstadoPedido:number;
	estadoPedido:string;
}

interface FechaPedido{
  idFechaPedido:number;
	fechaPedido:string;
}

interface Laboratorio{
  idLaboratorio:number;
	nombre:string;
	direccion:string;
	telefono:string;
	correo:string;
}

interface Empleado{
  numEmpleado:number;
	nombres:string;
	apellidos:string;
	dirreccion:string;
}


@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.css']
})


export class EntregaComponent {
  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]
  constructor(private dataService:MyDataServices){}

ngOnInit(): void{

  this.myData$=forkJoin(
    this.dataService.getData('entrega'),
    this.dataService.getData('estadoentrega'),
    this.dataService.getData('ordenpedido'),
    this.dataService.getData('estadopedido'),
    this.dataService.getData('fechapedido'),
    this.dataService.getData('laboratorio'),
    this.dataService.getData('empleado')
    ).pipe(
    map((data:any[])=>{
      let entrega:Entrega[] = data[0];
      let estadoEntrega:EstadoEntrega[] = data[1];
    

      entrega.forEach( element =>{
        let state =estadoEntrega.filter(e => e.idEstadoEntrega == element.idEstadoEntrega);
        let date: Date = new Date(element.fechaEntrega)
        let formatoFecha:string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

        this.myData.push(
          {
            estadoEntrega:state[0].estadoEntrega,
            codEntrega:element.codEntrega,
            fechaEntrega:formatoFecha,
            descripcion:element.descripcion
          }
        )
      })
      console.log(this.myData)
      return this.myData
    })
  )

  this.setTableColumns();
}
 
 setTableColumns(){
   this.tableColumns=[
     {label:'Codigo de entrega', def:'codEntrega', dataKey:'codEntrega'},
     {label:'EstadoEntrega', def:'estadoEntrega', dataKey:'estadoEntrega'},
     {label:'Fecha de entrega', def:'fechaEntrega', dataKey:'fechaEntrega'},
     {label:'Descripcion', def:'descripcion', dataKey:'descripcion'},
   
   ]
 }

}
