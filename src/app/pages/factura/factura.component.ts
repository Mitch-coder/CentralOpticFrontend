import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { catchError, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { HeaderData } from 'src/app/header/header-data';

interface Factura {
  numFactura: number;
  idEstadoFactura: number;
  idFechaFactura: number;
  numEmpleado: number;
  codCliente: number
  impuestos: number;
  descuento: number;
}

interface EstadoFactura {
  idEstadoFactura: number;
  estadoFactura: string;
}

interface FechaFactura {
  idFechaFactura: number;
  fechaEmision: Date;
}

interface Empleado {
  numEmpleado: number
  nombres: string;
  apellidos: string;
  direccion: string;
}

interface Cliente {
  codCliente: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  direccion: string;
}

interface DetalleFactura {
  idDetalleFactura: number;
  numFactura: number;
  codProducto: number;
  cantidad: number;
  precioUni: number;
}

interface Data {
  numFactuta: number;
  estadoFactura: string;
  fecha: Date;
  empleado: string;
  cliente: string;
  subTotal: number;
  impuesto: number;
  descuento: number;
  total: number;
}

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent {
  myData: any[] = [];
  myData$: any;

  tableColumns: TableColumn[] = []
  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };

  facturaList: Factura[] = []
  estadoFacturaList: EstadoFactura[] = []
  fechaFacturaList: FechaFactura[] = []
  empleadoList: Empleado[] = []
  clienteList: Cliente[] = []
  detalleFacturaList: DetalleFactura[] = []

  form!: FormGroup;
  dataUpdate: any = undefined;
  formBuilder: any;

  constructor(private dataService: MyDataServices) { }

  ngOnInit(): void {
    //Buscar lo del forkjoin

    this.myData$ = forkJoin(
      this.dataService.getData('factura'),
      this.dataService.getData('estadofactura'),
      this.dataService.getData('fechafactura'),
      this.dataService.getData('empleado'),
      this.dataService.getData('cliente'),
      this.dataService.getData('detallefactura'),
    ).pipe(
      map((data: any[]) => {
        this.facturaList = data[0];
        this.estadoFacturaList = data[1];
        this.fechaFacturaList = data[2];
        this.empleadoList = data[3];
        this.clienteList = data[4];
        this.detalleFacturaList = data[5];

        console.log(this.estadoFacturaList)

        this.myData = this.facturaList.map(element => {
          let detalleFactura = this.detalleFacturaList.filter(e => e.numFactura === element.numFactura)
          let fecha = this.fechaFacturaList.find(e => e.idFechaFactura === element.idFechaFactura)
          let cliente = this.clienteList.find(e => e.codCliente === element.codCliente)
          let empleado = this.empleadoList.find(e => e.numEmpleado === element.numEmpleado)
          let estadoFactura = this.estadoFacturaList.find(e => e.idEstadoFactura === element.idEstadoFactura)
          let subTotal = 0

          try {
            subTotal = detalleFactura.reduce((acumulador, objeto) => acumulador + (objeto.cantidad * objeto.precioUni), 0)
          } catch (error) {
            subTotal = 0
          }

          let date: Date = new Date(fecha?.fechaEmision?fecha.fechaEmision:'')
          const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

          return {
            numFactura: element.numFactura,
            estadoFactura: estadoFactura?.estadoFactura,
            fechaFactura: formatoFecha,
            empleado: empleado?.nombres + ' ' + empleado?.apellidos,
            cliente: cliente?.nombres + ' ' + cliente?.apellidos,
            subTotal: subTotal,
            impuesto: element.impuestos,
            descuento: element.descuento,
            total: (subTotal - (element.descuento * subTotal))
              + (subTotal * element.impuestos)
          }

        })
        return this.myData
      })
    )

    this.setTableColumns();
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Numero Factura', def: 'numFactura', dataKey: 'numFactura' },
      { label: 'Estado Factura', def: 'estadoFactura', dataKey: 'estadoFactura' },
      { label: 'Fecha Factura', def: 'fechaFactura', dataKey: 'fechaFactura' },
      { label: 'Empleado', def: 'empleado', dataKey: 'empleado' },
      { label: 'Cliente', def: 'cliente', dataKey: 'cliente' },
      { label: 'Sub Total', def: 'subTotal', dataKey: 'subTotal' },
      { label: 'Impuesto', def: 'impuesto', dataKey: 'impuesto' },
      { label: 'Descuento', def: 'descuento', dataKey: 'descuento' },
      { label: 'Total', def: 'total', dataKey: 'total' },
    ]
  }

  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick)
      this.dataUpdate = undefined
    return HeaderData.eventBtnClick;
  }

  initCreate() {
    this.form = this.formBuilder.group(
      {
        'Empleado': ['', Validators.required],
        'Cliente': ['', Validators.required],
        'precioActual': ['', Validators.required],
        'estadoProducto': ['', Validators.required]
      }
    );
  }

}
