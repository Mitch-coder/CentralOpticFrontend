import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { catchError, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { HeaderData } from 'src/app/header/header-data';

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
  estadoFactura:string;
}

interface FechaFactura{
  idFechaFactura:number;
  fechaEmision:Date;
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

interface Data{
  numFactuta:number;
  estadoFactura: string;
  fecha:Date;
  empleado:string;
  cliente:string;
  subTotal:number;
  impuesto:number;
  descuento:number;
  total:number;
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
  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit'};

  factura:Factura[] = []
  estadoFactura:EstadoFactura[] = []
  fechaFactura:FechaFactura[] = []
  empleado:Empleado[] = []
  cliente:Cliente[] = []
  detalleFactura:DetalleFactura[] = []

  form!: FormGroup;
  dataUpdate: any = undefined;
  formBuilder: any;

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{
    //Buscar lo del forkjoin

    this.myData$ = forkJoin(
      this.dataService.getData('factura'),
      this.dataService.getData('estadofactura'),
      this.dataService.getData('fechafactura'),
      this.dataService.getData('empleado'),
      this.dataService.getData('cliente'),
      this.dataService.getData('detallefactura'),
    ).pipe(
      map((data:any[])=>{
        this.factura= data[0];
        this.estadoFactura = data[1];
        this.fechaFactura = data[2];
        this.empleado = data[3];
        this.cliente = data[4];
        this.detalleFactura = data[5];

        this.factura.forEach(element => {
          let val= this.detalleFactura.filter(e => e.numFactura == element.numFactura)
          let fecha= this.fechaFactura.filter(e => e.idFechaFactura == element.idFechaFactura)
          let subTotal = 0
            
          try {
            subTotal = val[0].cantidad * val[0].precioUni
          } catch (error) {
            subTotal = 0
          }

          let date:Date = new Date(fecha[0].fechaEmision)
          const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
          this.myData.push(
            {
              numFactura:element.numFactura,
              estadoFactura:this.estadoFactura[element.idEstadoFactura - 1].estadoFactura,
              fechaFactura:formatoFecha,
              empleado:this.empleado[element.numEmpleado - 1].nombres,
              cliente:this.cliente[element.codCliente - 1].nombres,
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
      {label:'Numero Factura', def:'numFactura', dataKey:'numFactura'},
      {label:'Estado Factura', def:'estadoFactura', dataKey:'estadoFactura'},
      {label:'Fecha Factura', def:'fechaFactura', dataKey:'fechaFactura'},
      {label:'Empleado', def:'empleado', dataKey:'empleado'},
      {label:'Cliente', def:'cliente', dataKey:'cliente'},
      {label:'Sub Total', def:'subTotal', dataKey:'subTotal'},
      {label:'Impuesto', def:'impuesto', dataKey:'impuesto'},
      {label:'Descuento', def:'descuento', dataKey:'descuento'},
      {label:'Total', def:'total', dataKey:'total'},
    ]
  }

  getEventBtnClickHeader(){
    if(!HeaderData.eventBtnClick)
      this.dataUpdate = undefined
    return HeaderData.eventBtnClick;
  }

  initCreate(){
    this.form = this.formBuilder.group(
      {
        'Empleado':['',Validators.required],
        'Cliente':['',Validators.required],
        'precioActual':['',Validators.required],
        'estadoProducto':['',Validators.required]
      }
      
    );  
  }

}
