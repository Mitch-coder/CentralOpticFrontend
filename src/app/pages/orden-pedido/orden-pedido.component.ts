import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { elementAt, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ExamenVistaComponent } from '../examen-vista/examen-vista.component';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

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

interface Cliente {
  codCliente: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  direccion: string;
}

interface ExamenVista {
  numExamen: number;
  codCliente: number;
  idFechaExamen: number;
  ojoIzquierdo: number;
  ojoDerecho: number;
  descripLenteIzq: string;
  descripLenteDer: string;
}


@Component({
  selector: 'app-orden-pedido',
  templateUrl: './orden-pedido.component.html',
  styleUrls: ['./orden-pedido.component.css']
})


export class OrdenPedidoComponent {
  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
  myData: any[] = [];
  myData$:any;

  tableColumns: TableColumn[] =[]

  ordenPedidoList:OrdenPedido[] = []
  estadoPedidoList:EstadoPedido[] = []
  fechaPedidoList:FechaPedido[] = []
  laboratorioList:Laboratorio[] = []
  empleadoList:Empleado[] = []
  examenVistaList:ExamenVista[] =[]
  clienteList:Cliente[] = []

  OrdenPedido:OrdenPedido ={
    numOrden: 0,
    numExamen: 0,
    numEmpleado: 0,
    idLaboratorio: 0,
    codProducto: 0,
    idEstadoPedido: 0,
    idFechaPedido: 0,
    costo: 0,
    descripcion: ''
  }

  EstadoPedido:EstadoPedido ={
    idEstadoPedido: 0,
    estadoPedido: ''
  }

  FechaPedido:FechaPedido = {
    idFechaPedido: 0,
    fechaPedido: ''
  }

  Laboratorio:Laboratorio = {
    idLaboratorio: 0,
    nombre: '',
    direccion: '',
    telefono: '',
    correo: ''
  }

  ExamenVista: ExamenVista ={
    numExamen: 0,
    codCliente: 0,
    idFechaExamen: 0,
    ojoIzquierdo: 0,
    ojoDerecho: 0,
    descripLenteIzq: '',
    descripLenteDer: ''
  }

  Cliente:Cliente = {
    codCliente: 0,
    cedula: '',
    nombres: '',
    apellidos: '',
    direccion: ''
  }

  dataUpdate: any = undefined
  private matDialogRef!: MatDialogRef<DialogComponent>;


  constructor(private dataService: MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('ordenpedido'),
      this.dataService.getData('estadopedido'),
      this.dataService.getData('fechapedido'),
      this.dataService.getData('laboratorio'),
      this.dataService.getData('empleado'),
      this.dataService.getData('examenvista'),
      this.dataService.getData('cliente')

    ).pipe(
      map((data:any[]) => {
        //Definimos las variables donde se van a guardar cada array de datos consultados
        this.ordenPedidoList = data[0];
        this.estadoPedidoList = data[1];
        this.fechaPedidoList = data[2];
        this.laboratorioList = data[3];
        this.empleadoList = data[4];
        this.examenVistaList = data[5];
        this.clienteList = data[6];


        this.myData = this.ordenPedidoList.map(element => {
          const estadoPedido = this.estadoPedidoList.find(e => e.idEstadoPedido== element.idEstadoPedido)?.estadoPedido;
          const fechaPedidoF = this.fechaPedidoList.find(e => e.idFechaPedido == element.idFechaPedido)?.fechaPedido;
          const laboratorioF = this.laboratorioList.find(e => e.idLaboratorio == element.idLaboratorio)?.nombre;
          const empleadorF = this.empleadoList.find(e => e.numEmpleado == element.numEmpleado)?.nombres;
          let date: Date = new Date(fechaPedidoF?fechaPedidoF:'')
          let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

          return {
            //Aqui se tiene que especificar los elementos a mostrar 
            numOrden:element.numOrden,
            numExamen:element.numExamen,
            descripcion:element.descripcion,
            costo:element.costo,
            codProducto:element.codProducto,
            // estadopedido:estadopedidoF[0].estadoPedido,
            estadopedido:estadoPedido,
            fechapedido:formatoFecha,
            laboratorio:laboratorioF,
            empleado:empleadorF,
          }
        })
        // console.log(this.myData)
        return this.myData;
      })
    )

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'Numero Orden', def:'numOrden', dataKey:'numOrden'},
      {label:'Numero Examen', def:'numExamen', dataKey:'numExamen'},
      {label:'Descripcion', def:'descripcion', dataKey:'descripcion'},
      {label:'Costo', def:'costo', dataKey:'costo'},
      {label:'Codigo Producto', def:'codProducto', dataKey:'codProducto'},
      {label:'Estado Pedido', def:'estadoPedido', dataKey:'estadopedido'},
      {label:'Fecha Pedido', def:'fechaPedido', dataKey:'fechapedido'},
      {label:'Laboratorio', def:'laboratorio', dataKey:'laboratorio'},
      {label:'Empleado', def:'numEmpleado', dataKey:'empleado'},
    ]
  }


  /////////////////////////////////////////////////////////////////////////////////////////
  // codigo de actualizar informacion

  

  setDataUpdate(){

  }




}
