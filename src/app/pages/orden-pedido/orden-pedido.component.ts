import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { elementAt, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';

//Interfaz Principal
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
//Auxiliares

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
  selector: 'app-orden-pedido',
  templateUrl: './orden-pedido.component.html',
  styleUrls: ['./orden-pedido.component.css']
})


export class OrdenPedidoComponent {
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('ordenpedido'),
      this.dataService.getData('estadopedido'),
      this.dataService.getData('fechapedido'),
      this.dataService.getData('laboratorio'),
      this.dataService.getData('empleado')

    ).pipe(
      map((data:any[]) => {
        //Definimos las variables donde se van a guardar cada array de datos consultados
        let ordenpedido:OrdenPedido[] = data[0];
        let estadopedido:EstadoPedido[] = data[1];
        let fechapedido:FechaPedido[] = data[2];
        let laboratorio:Laboratorio[] = data[3];
        let empleado:Empleado[] = data[4];


        this.myData = ordenpedido.map(element => {
          const estadoPedido = estadopedido.find(e => e.idEstadoPedido== element.idEstadoPedido)?.estadoPedido;
          const fechaPedidoF = fechapedido.find(e => e.idFechaPedido == element.idFechaPedido)?.fechaPedido;
          const laboratorioF = laboratorio.find(e => e.idLaboratorio == element.idLaboratorio)?.nombre;
          const empleadorF = empleado.find(e => e.numEmpleado == element.numEmpleado)?.nombres;

          return {
            //Aqui se tiene que especificar los elementos a mostrar 
            numOrden:element.numOrden,
            numExamen:element.numExamen,
            descripcion:element.descripcion,
            costo:element.costo,
            codProducto:element.codProducto,
            // estadopedido:estadopedidoF[0].estadoPedido,
            estadopedido:estadoPedido,
            fechapedido:fechaPedidoF,
            laboratorio:laboratorioF,
            empleado:empleadorF,
          }
        })
        console.log(this.myData)
        return this.myData;
      })
    )

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'N* Orden', def:'numOrden', dataKey:'numOrden'},
      {label:'N* Examen', def:'numExamen', dataKey:'numExamen'},
      {label:'Descripcion', def:'descripcion', dataKey:'descripcion'},
      {label:'Costo', def:'costo', dataKey:'costo'},
      {label:'CodProducto', def:'codProducto', dataKey:'codProducto'},
      {label:'EstadoPedido', def:'estadoPedido', dataKey:'estadopedido'},
      {label:'FechaPedido', def:'fechaPedido', dataKey:'fechapedido'},
      {label:'Laboratorio', def:'laboratorio', dataKey:'laboratorio'},
      {label:'N* Empleado', def:'numEmpleado', dataKey:'empleado'},
    ]
  }

}
