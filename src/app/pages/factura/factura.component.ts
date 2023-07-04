import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { Observable, ReplaySubject, catchError, elementAt, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventBtnClick, HeaderData } from 'src/app/header/header-data';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';

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
  fechaEmision: string;
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

interface DetalleFacturaInfo {
  idDetalleFactura: number;
  numFactura: number;
  codProducto: number;
  cantidad: number;
  precioUni: number;
  descripcion: (string|null);
}

// interface Data {
//   numFactuta: number;
//   estadoFactura: string;
//   fecha: Date;
//   empleado: string;
//   cliente: string;
//   subTotal: number;
//   impuesto: number;
//   descuento: number;
//   total: number;
// }

interface Producto {
  codProducto: number;
  idMarca: number;
  idNombreProducto: number;
  descripcion: string;
  precioActual: number;
  estadoProducto: boolean
}

interface Marca {
  idMarca: number;
  marca: string;
}

interface NombreProducto {
  idNombreProducto: number;
  nombreProducto: string;
}

interface Bodega {
  idBodega: number;
  nombre: string;
  telefono: string;
  direccion: string;
  correo: string;
}

interface RegistroBodega {
  idRegistro_Bodega: number;
  idBodega: number;
  codProducto: number;
  cantidad: number;
}

interface OrdenPedido {
  numOrden: number;
  numExamen: number;
  numEmpleado: number;
  idLaboratorio: number;
  codProducto: number;
  idEstadoPedido: number;
  idFechaPedido: number;
  costo: number;
  descripcion: string;
}
//Auxiliares

// interface EstadoPedido {
//   idEstadoPedido: number;
//   estadoPedido: string;
// }

interface FechaPedido {
  idFechaPedido: number;
  fechaPedido: string;
}

interface Pago {
  idPago: number;
  numFactura: number;
  idFechaPago: number;
  monto: number;
  tipoPago: boolean;
}

interface FechaPago {
  idFechaPago: number;
  fechaPago: string;
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
  productoList: Producto[] = []
  nombreProductoList: NombreProducto[] = []
  marcaList: Marca[] = []
  bodegaList: Bodega[] = []
  registroBodegaList: RegistroBodega[] = []
  ordenPedidoList: OrdenPedido[] = []
  // estadoPedidoList: EstadoPedido[] = []
  fechaPedidoList: FechaPedido[] = []
  pagoList: Pago[] = []
  fechaPagoList: FechaPago[] = []
  productosDetalleMostrar:any[] = []
  fechadetallefactura:string=''

  Factura: Factura = {
    numFactura: 0,
    idEstadoFactura: 0,
    idFechaFactura: 0,
    numEmpleado: 0,
    codCliente: 0,
    impuestos: 0,
    descuento: 0
  }

  EstadoFactura: EstadoFactura = {
    idEstadoFactura: 0,
    estadoFactura: ''
  }

  FechaFactura: FechaFactura = {
    idFechaFactura: 0,
    fechaEmision: ''
  }

  Empleado: Empleado = {
    numEmpleado: 0,
    nombres: '',
    apellidos: '',
    direccion: ''
  }

  Cliente: Cliente = {
    codCliente: 0,
    cedula: '',
    nombres: '',
    apellidos: '',
    direccion: ''
  }

  DetalleFactura: DetalleFactura = {
    idDetalleFactura: 0,
    numFactura: 0,
    codProducto: 0,
    cantidad: 0,
    precioUni: 0
  }

  Producto: Producto = {
    codProducto: 0,
    idMarca: 0,
    idNombreProducto: 0,
    descripcion: '',
    precioActual: 0,
    estadoProducto: false
  }

  NombreProducto: NombreProducto = {
    idNombreProducto: 0,
    nombreProducto: ''
  }

  Marca: Marca = {
    idMarca: 0,
    marca: ''
  }

  Bodega: Bodega = {
    idBodega: 0,
    nombre: '',
    telefono: '',
    direccion: '',
    correo: ''
  }

  RegistroProducto: RegistroBodega = {
    idRegistro_Bodega: 0,
    idBodega: 0,
    codProducto: 0,
    cantidad: 0
  }

  OrdenPedido: OrdenPedido = {
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

  // EstadoPedido: EstadoPedido = {
  //   idEstadoPedido: 0,
  //   estadoPedido: ''
  // }

  FechaPedido: FechaPedido = {
    idFechaPedido: 0,
    fechaPedido: ''
  }

  Pago: Pago = {
    idPago: 0,
    numFactura: 0,
    idFechaPago: 0,
    monto: 0,
    tipoPago: false
  }

  FechaPago: FechaPago = {
    idFechaPago: 0,
    fechaPago: ''
  }

  Total:number = 0
  Subtotal:number = 0

  form!: FormGroup;
  dataUpdate: any = undefined;
  // formBuilder: any;
  private matDialogRef!: MatDialogRef<DialogComponent>;

  constructor(private dataService: MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    //Buscar lo del forkjoin

    this.myData$ = forkJoin(
      this.dataService.getData('factura'),
      this.dataService.getData('estadofactura'),
      this.dataService.getData('fechafactura'),
      this.dataService.getData('empleado'),
      this.dataService.getData('cliente'),
      this.dataService.getData('detallefactura'),

      this.dataService.getData('producto'),
      this.dataService.getData('nombreProducto'),
      this.dataService.getData('marca'),
      this.dataService.getData('bodega'),
      this.dataService.getData('registrobodega'),

      this.dataService.getData('ordenpedido'),
      // this.dataService.getData('estadopedido'),
      this.dataService.getData('fechapedido'),
      this.dataService.getData('pago'),
      this.dataService.getData('fechapago'),
    ).pipe(
      map((data: any[]) => {
        this.facturaList = data[0];
        this.estadoFacturaList = data[1];
        this.fechaFacturaList = data[2];
        this.empleadoList = data[3];
        this.clienteList = data[4];
        this.detalleFacturaList = data[5];
        this.productoList = data[6]
        this.nombreProductoList = data[7]
        this.marcaList = data[8]
        this.bodegaList = data[9]
        this.registroBodegaList = data[10]
        this.ordenPedidoList = data[11];
        // this.estadoPedidoList = data[1];
        this.fechaPedidoList = data[12];
        this.pagoList = data[13];
        this.fechaPagoList = data[14];

        console.log(this.estadoFacturaList)

        this.clienteList = this.clienteList.filter( e => !(e.cedula[0]=='T' && e.cedula[1]=='P'));

        //console.log(this.clienteList);
        

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

          let date: Date = new Date(fecha?.fechaEmision ? fecha.fechaEmision : '')
          const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

          return {
            numFactura: element.numFactura,
            estadoFactura: estadoFactura?.estadoFactura,
            fechaFactura: formatoFecha,
            empleado: empleado?.nombres + ' ' + empleado?.apellidos,
            cliente: cliente?.nombres + ' ' + cliente?.apellidos,
            subTotal: subTotal.toFixed(2),
            impuesto: element.impuestos.toFixed(2),
            descuento: element.descuento.toFixed(2),
            total: ((subTotal - (element.descuento * subTotal))
              + (subTotal * element.impuestos)).toFixed(2)
          }

        })
        return this.myData
      })
    )

    this.setTableColumns();
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Número de Factura', def: 'numFactura', dataKey: 'numFactura' },
      { label: 'Estado de la Factura', def: 'estadoFactura', dataKey: 'estadoFactura' },
      { label: 'Fecha de la Factura', def: 'fechaFactura', dataKey: 'fechaFactura' },
      { label: 'Empleado', def: 'empleado', dataKey: 'empleado' },
      { label: 'Cliente', def: 'cliente', dataKey: 'cliente' },
      { label: 'Sub Total', def: 'subTotal', dataKey: 'subTotal' },
      { label: 'Impuesto', def: 'impuesto', dataKey: 'impuesto' },
      { label: 'Descuento', def: 'descuento', dataKey: 'descuento' },
      { label: 'Total', def: 'total', dataKey: 'total' },
    ]
  }

  valCreateData = true
  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick) {
      this.dataUpdate = undefined
      if (this.valCreateData) {
        this.loadDataCreate()
      }
    }
    return HeaderData.eventBtnClick;
  }

  // --------------------------------------------------------------------------------- //
  //               Aqui es donde se guardara la parte del detalle producto

  detalleFacturaItems: any[] = []

  detalleFacturaItemsList = new ExampleDataSource([...this.detalleFacturaItems]);

  displayedColumns: string[] = [
    'id',
    'tipoItems',
    'codProducto',
    'descripcion',
    'cantidad',
    'precioUni',
    'action'
  ];

  deleteEmployee(data: any) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro de eliminar el producto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        if (data.tipoItems === 'Pdt') {
          let producto = this.productoList.find(e => e.codProducto === data.codProducto)
          let nombreProducto = this.nombreProductoList.find(e => e.idNombreProducto === producto?.idNombreProducto)
          let marca = this.marcaList.find(e => e.idMarca == producto?.idMarca)

          this.tableDataProducto.push({
            codProducto: producto?.codProducto,
            marca: marca?.marca,
            nombre: nombreProducto?.nombreProducto,
            descripcion: producto?.descripcion,
            precioActual: producto?.precioActual.toFixed(2),
            estadoProducto: producto?.estadoProducto ? 'Activo' : 'Inactivo'
          })


          this.detalleFacturaItems = this.detalleFacturaItems.filter(e => e.codProducto !== producto?.codProducto)

        } else {
          let ordenPedido = this.ordenPedidoList.find(e => e.numOrden === data.numOrden)

          let fecha = this.fechaPedidoList.find(e => e.idFechaPedido === ordenPedido?.idFechaPedido)
          let date: Date = new Date(fecha?.fechaPedido ? fecha.fechaPedido : '')
          const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

          this.tableDataOrdenPedido.push({
            numOrden: ordenPedido?.numOrden,
            fechaPedido: formatoFecha,
            codProducto: ordenPedido?.codProducto,
            descripcion: ordenPedido?.descripcion,
            costo: ordenPedido?.costo.toFixed(2)
          })

          this.detalleFacturaItems = this.detalleFacturaItems.filter(e => e.numOrden !== ordenPedido?.numOrden)
        }
        this.detalleFacturaItemsList.setData([...this.detalleFacturaItems])

        this.Calcular();
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen a salvo:)',
          'error'
        )
      }
    });
  }

  cancelFormUpdate() {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea cerrar el formulario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cerrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataUpdate = undefined
        this.resetData()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen asalvo:)',
          'error'
        )
      }
    });
  }

  openEditForm(data: any, template: TemplateRef<any>) {
    this.detalleItems = data
    this.openDialogWithTemplate(template)
  }

  loadConfirmationUpdateItem() {
    let detalle = this.detalleFacturaItems.findIndex(e => e.id === this.detalleItems.id)

    if (detalle !== -1) {
      this.detalleFacturaItems[detalle] = this.detalleItems
      this.cancelDialogResult()
    }

    this.Calcular();

  }

  // id: this.detalleFacturaItems.length + 1,
  //   tipoItems: 'Pdt',
  //     codProducto: producto.codProducto,
  //       descripcion: producto.descripcion,
  //         cantidad: 1,
  //           precioUni: producto.precioActual

  //   idDetalleFactura: 0,
  //   numFactura: 0,
  //   codProducto: 0,
  //   cantidad: 0,
  //   precioUni: 0

  // producto
  tableColumnsProducto = [
    { label: 'Código del Producto', def: 'codProducto', dataKey: 'codProducto' },
    { label: 'Marca', def: 'marca', dataKey: 'marca' },
    { label: 'Nombre', def: 'Nombre', dataKey: 'nombre' },
    { label: 'Descripción', def: 'Descripcion', dataKey: 'descripcion' },
    { label: 'Precio Actual', def: 'precioActual', dataKey: 'precioActual' },
    { label: 'Estado Producto', def: 'estadoProducto', dataKey: 'estadoProducto' }
  ]

  tableDataProducto: any[] = []

  setDataProductoFormat() {
    this.tableDataProducto = this.productoList.map(element => {
      let nombreProducto = this.nombreProductoList.find(e => e.idNombreProducto == element.idNombreProducto)
      let marca = this.marcaList.find(e => e.idMarca == element.idMarca)
      return {
        codProducto: element.codProducto,
        marca: marca?.marca,
        nombre: nombreProducto?.nombreProducto,
        descripcion: element.descripcion,
        precioActual: element.precioActual.toFixed(2),
        estadoProducto: element.estadoProducto ? 'Activo' : 'Inactivo'
      }
    })
  }

  productoAuxiliarList: any[] = []

  resultDataTableProducto(data: any) {
    if (data) {

      let producto = this.productoList.find(e => e.codProducto === data.codProducto)
      let val = this.detalleFacturaItems.find(e => e.codProducto === data.codProducto)

      console.log(val)
      if (!val) {
        if (producto) {
          this.detalleFacturaItems.push(
            {
              id: this.detalleFacturaItems.length + 1,
              tipoItems: 'Pdt',
              codProducto: producto.codProducto,
              descripcion: producto.descripcion,
              cantidad: 1,
              precioUni: producto.precioActual.toFixed(2),
              numOrden: -1
            }
          )

          this.detalleFacturaItemsList.setData([...this.detalleFacturaItems])
          // console.log(this.detalleFacturaItems)

          this.productoAuxiliarList = this.productoAuxiliarList.filter(e => e.codProducto !== producto?.codProducto)
          this.cancelDialogResult()

          this.Calcular();

        }
      } else {
        Swal.fire(
          'El producto ya fue ingresado',
          '',
          'error'
        )
      }

    }

  }


  Calcular(){

    this.Subtotal = (this.detalleFacturaItems.reduce((acumulador, objeto) => acumulador + (objeto.cantidad * objeto.precioUni), 0))

    this.Total = this.Subtotal + (this.Subtotal * this.Factura.impuestos) - (this.Subtotal * this.Factura.descuento) 
    this.Total
  }
  // orden pedido

  tableColumnsOrdenPedido = [
    { label: 'Numero de Orden', def: 'numOrden', dataKey: 'numOrden' },
    { label: 'Fecha del Pedido', def: 'fechaPedido', dataKey: 'fechaPedido' },
    { label: 'Código del Producto', def: 'codProducto', dataKey: 'codProducto' },
    { label: 'Descripción', def: 'descripcion', dataKey: 'descripcion' },
    { label: 'Costo', def: 'costo', dataKey: 'costo' },
  ]

  tableDataOrdenPedido: any[] = []

  setDataOrdenPedidoFormat() {
    this.tableDataOrdenPedido = this.ordenPedidoList.map(element => {
      let fecha = this.fechaPedidoList.find(e => e.idFechaPedido === element.idFechaPedido)
      let date: Date = new Date(fecha?.fechaPedido ? fecha.fechaPedido : '')
      const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

      return {
        numOrden: element.numOrden,
        fechaPedido: formatoFecha,
        codProducto: element.codProducto,
        descripcion: element.descripcion,
        costo: element.costo,
      }
    })
  }

  ordenPedidoAuxiliarList: any[] = []

  resultDataTableOrdenPedido(data: any) {
    console.log(data)
    if (data) {
      let ordenPedido = this.ordenPedidoList.find(e => e.numOrden === data.numOrden)
      // let producto = this.productoList.find(e => e.codProducto === data.codProducto)
      let val = this.detalleFacturaItems.find(e => e.numOrden === ordenPedido?.numOrden)
      console.log(val)
      if (!val) {
        if (ordenPedido) {
          // this.ordenPedidoAuxiliarList.push(ordenPedido)
          this.detalleFacturaItems.push(
            {
              id: this.detalleFacturaItems.length + 1,
              tipoItems: 'Opp',
              codProducto: ordenPedido.codProducto,
              descripcion: ordenPedido.descripcion,
              cantidad: 1,
              precioUni: ordenPedido.costo,
              numOrden: ordenPedido.numOrden
            }
          )

          this.detalleFacturaItemsList.setData([...this.detalleFacturaItems])

          console.log(this.detalleFacturaItems)
          this.ordenPedidoAuxiliarList = this.ordenPedidoAuxiliarList.filter(e => e.numOrden !== ordenPedido?.numOrden)
          this.cancelDialogResult();
          this.Calcular();
        }
      } else {
        Swal.fire(
          'El producto ya fue ingresado aa',
          '',
          'error'
        )
      }
    }
  }

  detalleItems: any = {
    id: 0,
    tipoItems: '',
    codProducto: 0,
    descripcion: '',
    cantidad: 1,
    precioUni: 0,
    numOrden: 0
  }

  formUpdateItems: FormGroup = this.formBuilder.group(
    {
      'descripcion': [this.detalleItems.descripcion, Validators.required],
      'cantidad': [this.detalleItems.cantidad, Validators.required],
      'precioUni': [this.detalleItems.precioUni, Validators.required]
    }
  )

  formGetDataUpdateItems(fr: string) {
    return this.formUpdateItems.get(fr) as FormControl;
  }

  // aqui termina
  // -------------------------------------------------------------------------------------- //

  //   numEmpleado: 0,
  //   codCliente: 0,

  tableColumnsCliente = [
    { label: 'Número de Cliente', def: 'IdCliente', dataKey: 'codCliente' },
    { label: 'Cédula', def: 'Cedula', dataKey: 'cedula' },
    { label: 'Nombres', def: 'Nombre', dataKey: 'nombres' },
    { label: 'Apellidos', def: 'Apellido', dataKey: 'apellidos' },
    { label: 'Dirección', def: 'Direccion', dataKey: 'direccion' }
  ]

  resultDataTableCliente(data: any) {
    if (data) {
      this.Cliente = data
      console.log(data);
      this.cancelDialogResult()
    }
  }

  tableColumnsEmpleado = [
    { label: 'Número de Empleado', def: 'NumEmpleado', dataKey: 'numEmpleado' },
    { label: 'Nombres', def: 'nombres', dataKey: 'nombres' },
    { label: 'Apellidos', def: 'apellidos', dataKey: 'apellidos' },
    { label: 'Dirección', def: 'direccion', dataKey: 'direccion' }
  ]

  resultDataTableEmpleado(data: any) {
    if (data) {
      this.Empleado = data
      this.cancelDialogResult()
    }
  }

  // -------------------------------------------------------------------------------------- //

  formCreateData: FormGroup = this.formBuilder.group(
    {
      'empleado': [this.Empleado.nombres, Validators.required],
      'cliente': [this.Cliente.nombres, Validators.required],
      'fechaEmision': [this.FechaFactura.fechaEmision, Validators.required],
      'descuento': [this.Factura.descuento, Validators.required],
      'impuesto': [this.Factura.impuestos, Validators.required],
      'monto': [this.Pago.monto, Validators.required],
      'subtotal': [this.Subtotal, Validators.required],
      'total': [this.Total, Validators.required]
    }
  )

  formGetDataCreate(fr: string) {

    return this.formCreateData.get(fr) as FormControl;
  }

  loadDataCreate() {
    
    this.valCreateData = false
    let date: Date = new Date()
    let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
    this.FechaFactura.fechaEmision = formatoFecha

    this.Factura.descuento = 0.00
    this.Factura.impuestos = 0.15

    this.productoAuxiliarList = this.productoList.filter(e => e.estadoProducto)
    this.ordenPedidoAuxiliarList = this.ordenPedidoList.filter(e => e.idEstadoPedido === 1)

    this.setDataProductoFormat()
    this.setDataOrdenPedidoFormat()
    //this.resetData()
  }

  loadConfirmationDataCreate() {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea guardar la informacion?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveDataCreate()
        // this.formUpdateData.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen asalvo:)',
          'error'
        )
      }
    });
  }

  saveDataCreate() {

    console.log(this.detalleFacturaItems.length);

    if (this.detalleFacturaItems.length>0 && this.Pago.monto >=0 && 
      (this.Factura.impuestos>=0 && this.Factura.impuestos<=1) && (this.Factura.descuento>=0 && this.Factura.descuento<=1)) {

      let fecha1 = new Date();
      fecha1.setHours(0, 0, 0, 0)

      let fecha = this.fechaFacturaList.find(e => new Date(e.fechaEmision).toString() === fecha1.toString())

      console.log(fecha)
      let F = -1
      if (!fecha) {
        const numeros = this.fechaFacturaList.map(objeto => objeto.idFechaFactura);
        F = Math.max(...numeros) + 1

        let fechaFactura = {
          fechaEmision: fecha1
        }

        this.dataService.postData('fechafactura', fechaFactura).then((success) => {
          if (success) {
            console.log('entro a la fecha nueva')
            let subtotal = this.detalleFacturaItems.reduce((acumulador, objeto) => acumulador + (objeto.cantidad * objeto.precioUni), 0);
            let total = subtotal + (subtotal*this.Factura.impuestos) - (subtotal*this.Factura.descuento);
            let pagado = total - this.Pago.monto;

            let estadoFactura = 1
            if (pagado <= 0) {
              estadoFactura = 3
            } else if (pagado === total) {
              estadoFactura = 1
            } else {
              estadoFactura = 2
            }

            //EventBtnClick.setMiVariable(true);
            let factura = {
              idEstadoFactura: estadoFactura,
              idFechaFactura: F,
              numEmpleado: this.Empleado.numEmpleado,
              codCliente: this.Cliente.codCliente,
              impuestos: this.Factura.impuestos,
              descuento: this.Factura.descuento
            }

            console.log(factura)

            /////////////////////////////

            const numeros = this.facturaList.map(objeto => objeto.numFactura);
            let FT = Math.max(...numeros) + 1

            this.dataService.postData('factura', factura).then((success) => {
              if (success) {

                if (this.Pago.monto !== 0) {

                  let fechaPago = this.fechaPagoList.find(e => new Date(e.fechaPago).toString() === fecha1.toString())

                  if (!fechaPago) {
                    const numeros = this.fechaPagoList.map(objeto => objeto.idFechaPago);
                    let FP = Math.max(...numeros) + 1

                    let fechaPago = {
                      fechaPago: fecha1
                    }

                    this.dataService.postData('fechapago', fechaPago).then((success) => {
                      if (success) {
                        if (estadoFactura === 2) {
                          let pago = {
                            numFactura: FT,
                            idFechaPago: FP,
                            monto: this.Pago.monto,
                            tipoPago: true
                          }
                          this.dataService.postData('pago', pago).then((success) => {
                            if (success) {
                              Swal.fire({
                                icon: 'success',
                                title: 'Exito',
                                text: 'La factura se realizo correctamente',
                              })
                              EventBtnClick.setMiVariable(true);
                              
                            } else {
                              Swal.fire({
                                icon: 'error',
                                title: 'Ups...',
                                text: 'Algo salió mal!',
                                footer: '<a href="">¿Por qué tengo este problema??</a>'
                              })
                            }
                          })
                        } else if (estadoFactura === 3) {
                          let result = 0
                          if (pagado < 0) {
                            result = pagado * (-1)
                          } else {
                            result = 0
                          }

                          let pago = {
                            numFactura: FT,
                            idFechaPago: FP,
                            monto: total,
                            tipoPago: true
                          }

                          this.dataService.postData('pago', pago).then((success) => {
                            if (success) {
                              Swal.fire({
                                icon: 'success',
                                title: 'Exito',
                                text: 'La factura se realizo correctamente',
                                footer: 'El cambio es de $' + result
                              })
                              EventBtnClick.setMiVariable(true);
                            } else {
                              Swal.fire({
                                icon: 'error',
                                title: 'Ups...',
                                text: 'Algo salió mal!',
                                footer: '<a href="">¿Por qué tengo este problema??</a>'
                              })
                            }
                          })

                        }// pago
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Ups...',
                          text: 'Algo salió mal!',
                          footer: '<a href="">¿Por qué tengo este problema??</a>'
                        })
                      }
                    })
                  } else {

                    if (estadoFactura === 2) {
                      let pago = {
                        numFactura: FT,
                        idFechaPago: fechaPago.idFechaPago,
                        monto: this.Pago.monto,
                        tipoPago: true
                      }
                      this.dataService.postData('pago', pago).then((success) => {
                        if (success) {
                          Swal.fire({
                            icon: 'success',
                            title: 'Exito',
                            text: 'La factura se realizo correctamente',
                          })
                          EventBtnClick.setMiVariable(true);
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Ups...',
                            text: 'Algo salió mal!',
                            footer: '<a href="">¿Por qué tengo este problema??</a>'
                          })
                        }

                      })//post Pago

                    } else {
                      let result = 0
                      if (pagado < 0) {
                        result = pagado * (-1)
                      } else {
                        result = 0
                      }

                      let pago = {
                        numFactura: FT,
                        idFechaPago: fechaPago.idFechaPago,
                        monto: total,
                        tipoPago: true
                      }

                      this.dataService.postData('pago', pago).then((success) => {
                        if (success) {
                          Swal.fire({
                            icon: 'success',
                            title: 'Exito',
                            text: 'La factura se realizo correctamente',
                            footer: 'El cambio es de $' + result
                          })
                          EventBtnClick.setMiVariable(true);
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Ups...',
                            text: 'Algo salió mal!',
                            footer: '<a href="">¿Por qué tengo este problema??</a>'
                          })
                        }

                      })//post Pago
                    }
                  }
                }

                this.detalleFacturaItems.forEach(element => {

                  // tipoItems: 'Opp'
                  if (element.tipoItems === 'Opp') {
                    let pedido = this.ordenPedidoList.find(e => e.numOrden === element.numOrden)
                    if (pedido) {
                      pedido.idEstadoPedido = 4

                      this.dataService.updateData('ordenpedido', pedido, pedido.numOrden).then((success) => {
                        if (success) {
                          Swal.fire({
                            icon: 'success',
                            title: 'Exito',
                            text: 'La factura se realizo correctamente',
                          })
                          EventBtnClick.setMiVariable(true);
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Ups...',
                            text: 'Algo salió mal!',
                            footer: '<a href="">¿Por qué tengo este problema??</a>'
                          })
                        }
                      })
                    }

                    let detalleFatura = {
                      numFactura: FT,
                      codProducto: element.codProducto,
                      cantidad: element.cantidad,
                      precioUni: element.precioUni
                    }

                    console.log(detalleFatura)

                    this.dataService.postData('detallefactura', detalleFatura).then((success) => {
                      if (success) {
                        Swal.fire({
                          icon: 'success',
                          title: 'Exito',
                          text: 'La factura se realizo correctamente',
                        })
                        EventBtnClick.setMiVariable(true);
                        
                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Ups...',
                          text: 'Algo salió mal!',
                          footer: '<a href="">¿Por qué tengo este problema??</a>'
                        })
                      }
                    })

                  } else {
                    let registroBodega = this.registroBodegaList.find(e => e.codProducto === element.codProducto)

                    if (registroBodega) {
                      let sub = registroBodega.cantidad - element.cantidad

                      let RegistroBodega: RegistroBodega = {
                        idRegistro_Bodega: registroBodega.idRegistro_Bodega,
                        idBodega: registroBodega.idBodega,
                        codProducto: registroBodega.codProducto,
                        cantidad: sub
                      }

                      this.dataService.updateData('registrobodega', registroBodega, registroBodega.idRegistro_Bodega).then((success) => {
                        if (success) {
                          

                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Ups...',
                            text: 'Algo salió mal!',
                            footer: '<a href="">¿Por qué tengo este problema??</a>'
                          })
                        }
                      })
                    }


                    let detalleFatura = {
                      numFactura: FT,
                      codProducto: element.codProducto,
                      cantidad: element.cantidad,
                      precioUni: element.precioUni
                    }

                    console.log(detalleFatura)

                    this.dataService.postData('detallefactura', detalleFatura).then((success) => {
                      if (success) {
                        Swal.fire({
                          icon: 'success',
                          title: 'Exito',
                          text: 'La factura se realizo correctamente',
                        })

                        EventBtnClick.setMiVariable(true);

                      } else {
                        Swal.fire({
                          icon: 'error',
                          title: 'Ups...',
                          text: 'Algo salió mal!',
                          footer: '<a href="">¿Por qué tengo este problema??</a>'
                        })
                      }
                    })
                  }
                })


              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Ups...',
                  text: 'Algo salió mal!',
                  footer: '<a href="">¿Por qué tengo este problema??</a>'
                })
              }
            })// post Factura

          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ups...',
              text: 'Algo salió mal!',
              footer: '<a href="">¿Por qué tengo este problema??</a>'
            })
          }
        })

      } else {
        console.log('vieja fecha')
        let subtotal = this.detalleFacturaItems.reduce((acumulador, objeto) => acumulador + (objeto.cantidad * objeto.precioUni), 0);
        let total = subtotal + (subtotal*this.Factura.impuestos) - (subtotal*this.Factura.descuento);
        let pagado = total - this.Pago.monto;

        let estadoFactura = 1
        if (pagado <= 0) {
          estadoFactura = 3
        } else if (pagado === total) {
          estadoFactura = 1
        } else {
          estadoFactura = 2
        }


        let factura = {
          idEstadoFactura: estadoFactura,
          idFechaFactura: fecha.idFechaFactura,
          numEmpleado: this.Empleado.numEmpleado,
          codCliente: this.Cliente.codCliente,
          impuestos: this.Factura.impuestos,
          descuento: this.Factura.descuento
        }

        console.log(factura)

        const numeros = this.facturaList.map(objeto => objeto.numFactura);
        let FT = Math.max(...numeros) + 1

        this.dataService.postData('factura', factura).then((success) => {
          if (success) {

            if (this.Pago.monto !== 0) {

              let fechaPago = this.fechaPagoList.find(e => new Date(e.fechaPago).toString() === fecha1.toString())

              if (!fechaPago) {
                const numeros = this.fechaPagoList.map(objeto => objeto.idFechaPago);
                let FP = Math.max(...numeros) + 1

                let fechaPago = {
                  fechaPago: fecha1
                }

                this.dataService.postData('fechapago', fechaPago).then((success) => {
                  if (success) {
                    if (estadoFactura === 2) {
                      let pago = {
                        numFactura: FT,
                        idFechaPago: FP,
                        monto: this.Pago.monto,
                        tipoPago: true
                      }
                      this.dataService.postData('pago', pago).then((success) => {
                        if (success) {
                          Swal.fire({
                            icon: 'success',
                            title: 'Exito',
                            text: 'La factura se realizo correctamente',
                          })
                          EventBtnClick.setMiVariable(true);
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Ups...',
                            text: 'Algo salió mal!',
                            footer: '<a href="">¿Por qué tengo este problema??</a>'
                          })
                        }
                      })
                    } else if (estadoFactura === 3) {
                      let result = 0
                      if (pagado < 0) {
                        result = pagado * (-1)
                      } else {
                        result = 0
                      }

                      let pago = {
                        numFactura: FT,
                        idFechaPago: FP,
                        monto: total,
                        tipoPago: true
                      }

                      this.dataService.postData('pago', pago).then((success) => {
                        if (success) {
                          Swal.fire({
                            icon: 'success',
                            title: 'Exito',
                            text: 'La factura se realizo correctamente',
                            footer: 'El cambio es de $' + result
                          })
                          EventBtnClick.setMiVariable(true);
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Ups...',
                            text: 'Algo salió mal!',
                            footer: '<a href="">¿Por qué tengo este problema??</a>'
                          })
                        }
                      })

                    }// pago
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Ups...',
                      text: 'Algo salió mal!',
                      footer: '<a href="">¿Por qué tengo este problema??</a>'
                    })
                  }
                })
              } else {

                if (estadoFactura === 2) {
                  let pago = {
                    numFactura: FT,
                    idFechaPago: fechaPago.idFechaPago,
                    monto: this.Pago.monto,
                    tipoPago: true
                  }
                  this.dataService.postData('pago', pago).then((success) => {
                    if (success) {
                      Swal.fire({
                        icon: 'success',
                        title: 'Exito',
                        text: 'La factura se realizo correctamente',
                      })
                      EventBtnClick.setMiVariable(true);
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Ups...',
                        text: 'Algo salió mal!',
                        footer: '<a href="">¿Por qué tengo este problema??</a>'
                      })
                    }

                  })//post Pago

                } else {
                  let result = 0
                  if (pagado < 0) {
                    result = pagado * (-1)
                  } else {
                    result = 0
                  }

                  let pago = {
                    numFactura: FT,
                    idFechaPago: fechaPago.idFechaPago,
                    monto: total,
                    tipoPago: true
                  }

                  this.dataService.postData('pago', pago).then((success) => {
                    if (success) {
                      Swal.fire({
                        icon: 'success',
                        title: 'Exito',
                        text: 'La factura se realizo correctamente',
                        footer: 'El cambio es de $' + result
                      })
                      EventBtnClick.setMiVariable(true);
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Ups...',
                        text: 'Algo salió mal!',
                        footer: '<a href="">¿Por qué tengo este problema??</a>'
                      })
                    }

                  })//post Pago
                }
              }
            }

            this.detalleFacturaItems.forEach(element => {

              // tipoItems: 'Opp'
              if (element.tipoItems === 'Opp') {
                let pedido = this.ordenPedidoList.find(e => e.numOrden === element.numOrden)
                if (pedido) {
                  pedido.idEstadoPedido = 4

                  this.dataService.updateData('ordenpedido', pedido, pedido.numOrden).then((success) => {
                    if (success) {
                      Swal.fire({
                        icon: 'success',
                        title: 'Exito',
                        text: 'La factura se realizo correctamente',
                      })
                      EventBtnClick.setMiVariable(true);
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Ups...',
                        text: 'Algo salió mal!',
                        footer: '<a href="">¿Por qué tengo este problema??</a>'
                      })
                    }
                  })
                }

                let detalleFatura = {
                  numFactura: FT,
                  codProducto: element.codProducto,
                  cantidad: element.cantidad,
                  precioUni: element.precioUni
                }

                console.log(detalleFatura)

                this.dataService.postData('detallefactura', detalleFatura).then((success) => {
                  if (success) {
                    
                      Swal.fire({
                        icon: 'success',
                        title: 'Exito',
                        text: 'La factura se realizo correctamente',
                      })
                      EventBtnClick.setMiVariable(true);
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Ups...',
                      text: 'Algo salió mal!',
                      footer: '<a href="">¿Por qué tengo este problema??</a>'
                    })
                  }
                })

              } else {
                let registroBodega = this.registroBodegaList.find(e => e.codProducto === element.codProducto)

                if (registroBodega) {
                  let sub = registroBodega.cantidad - element.cantidad

                  let RegistroBodega: RegistroBodega = {
                    idRegistro_Bodega: registroBodega.idRegistro_Bodega,
                    idBodega: registroBodega.idBodega,
                    codProducto: registroBodega.codProducto,
                    cantidad: sub
                  }

                  this.dataService.updateData('registrobodega', registroBodega, registroBodega.idRegistro_Bodega).then((success) => {
                    if (success) {
                      

                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Ups...',
                        text: 'Algo salió mal!',
                        footer: '<a href="">¿Por qué tengo este problema??</a>'
                      })
                    }
                  })
                }


                let detalleFatura = {
                  numFactura: FT,
                  codProducto: element.codProducto,
                  cantidad: element.cantidad,
                  precioUni: element.precioUni
                }

                console.log(detalleFatura)

                this.dataService.postData('detallefactura', detalleFatura).then((success) => {
                  if (success) {
                    Swal.fire({
                      icon: 'success',
                      title: 'Exito',
                      text: 'La factura se realizo correctamente',
                    })
                    EventBtnClick.setMiVariable(true);
                  } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Ups...',
                      text: 'Algo salió mal!',
                      footer: '<a href="">¿Por qué tengo este problema??</a>'
                    })
                  }
                })
              }
            })

          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ups...',
              text: 'Algo salió mal!',
              footer: '<a href="">¿Por qué tengo este problema??</a>'
            })
          }
        })// post Factura
      }
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Ups...',
        text: 'Algo salió mal!',
        footer: '<a href="">¿Por qué tengo este problema??</a>'
      })
    }
  }

  facturaEstadoList: EstadoFactura[] = []

  setDataUpdate(data: any) {
    if (data) {
      let factura = this.facturaList.find(e => e.numFactura === data.numFactura)
      let estadoFactura = this.estadoFacturaList.find(e => e.idEstadoFactura === factura?.idEstadoFactura)

      if (factura?.idEstadoFactura !== 4) {
        this.dataUpdate = data
        if (factura && estadoFactura) {
          this.Factura = { ...factura }
          this.EstadoFactura = { ...estadoFactura }
        }

        this.facturaEstadoList = this.estadoFacturaList

        // if (factura?.numFactura === 3) {
        //   this.facturaEstadoList = this.estadoFacturaList.filter(e => e.idEstadoFactura > 3)
        // } else {
        //   this.facturaEstadoList = this.estadoFacturaList.filter(e => e.idEstadoFactura !== 4)
        // }

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ups...',
          text: 'No puede actualizar una factura anulada'
        })
      }
    }
  }

  formDataUpdate: FormGroup = this.formBuilder.group(
    {
      'estadoFactura': [this.EstadoFactura.estadoFactura, Validators.required],
    }
  )

  formGetDataUpdate(fr: string) {
    return this.formDataUpdate.get(fr) as FormControl;
  }

  loadConfirmationDataUpdate() {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea guardar la informacion?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveDataUpdate()
        // this.formUpdateData.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen asalvo:)',
          'error'
        )
      }
    });
  }

  saveDataUpdate() {
    this.Factura.idEstadoFactura = this.EstadoFactura.idEstadoFactura

    this.dataService.updateData('factura', this.Factura, this.Factura.numFactura).then((success) => {
      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'La factura se actualizo correctamente'
        })

        this.dataUpdate = undefined;
        this.resetData();

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ups...',
          text: 'Algo salió mal!',
          footer: '<a href="">¿Por qué tengo este problema??</a>'
        })
      }
    })
  }

  resetData() {
    this.detalleFacturaItems = []
    this.dataUpdate = undefined

    EventBtnClick.setMiVariable(true)

    this.Factura = {
      numFactura: 0,
      idEstadoFactura: 0,
      idFechaFactura: 0,
      numEmpleado: 0,
      codCliente: 0,
      impuestos: 0,
      descuento: 0
    }

    this.EstadoFactura = {
      idEstadoFactura: 0,
      estadoFactura: ''
    }

    this.FechaFactura = {
      idFechaFactura: 0,
      fechaEmision: ''
    }

    this.Empleado = {
      numEmpleado: 0,
      nombres: '',
      apellidos: '',
      direccion: ''
    }

    this.Cliente = {
      codCliente: 0,
      cedula: '',
      nombres: '',
      apellidos: '',
      direccion: ''
    }

    this.DetalleFactura = {
      idDetalleFactura: 0,
      numFactura: 0,
      codProducto: 0,
      cantidad: 0,
      precioUni: 0
    }

    this.Producto = {
      codProducto: 0,
      idMarca: 0,
      idNombreProducto: 0,
      descripcion: '',
      precioActual: 0,
      estadoProducto: false
    }

    this.NombreProducto = {
      idNombreProducto: 0,
      nombreProducto: ''
    }

    this.Marca = {
      idMarca: 0,
      marca: ''
    }

    this.Bodega = {
      idBodega: 0,
      nombre: '',
      telefono: '',
      direccion: '',
      correo: ''
    }

    this.RegistroProducto = {
      idRegistro_Bodega: 0,
      idBodega: 0,
      codProducto: 0,
      cantidad: 0
    }

    this.OrdenPedido = {
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

    // EstadoPedido: EstadoPedido = {
    //   idEstadoPedido: 0,
    //   estadoPedido: ''
    // }

    this.FechaPedido = {
      idFechaPedido: 0,
      fechaPedido: ''
    }

    this.Pago = {
      idPago: 0,
      numFactura: 0,
      idFechaPago: 0,
      monto: 0,
      tipoPago: false
    }

    this.FechaPago = {
      idFechaPago: 0,
      fechaPago: ''
    }

  }


  detalleFacturaInfo:DetalleFacturaInfo[] = []
  displayColumnInfo:string[]=['codProducto','descripcion','cantidad','precioUni',]

  setInfoData(data:any,template: TemplateRef<any>){
    
    let factura = this.facturaList.find(e=>e.numFactura === data.numFactura)
    let detalleFactura = this.detalleFacturaList.filter(e=>e.numFactura === factura?.numFactura)
    let empleado = this.empleadoList.find(e=>e.numEmpleado === factura?.numEmpleado)
    let cliente = this.clienteList.find(e=>e.codCliente === factura?.codCliente)
    let pago = this.pagoList.filter(e=>e.numFactura === factura?.numFactura)
    let estadoFactura = this.estadoFacturaList.find(e=>e.idEstadoFactura === factura?.idEstadoFactura)
    let fecha = this.fechaFacturaList.find(e=>e.idFechaFactura === factura?.idFechaFactura)
    //let productos =  this.productoList.filter(e=>e.codProducto === detalleFactura[0].codProducto)

    let productos = this.productoList.map(objeto1 => {
      const objeto2 = detalleFactura.find(objeto => objeto.codProducto === objeto1.codProducto);
      if (objeto2) {
        return { codProducto: objeto2.codProducto, descripcion: objeto1.descripcion };
      }
      return { codProducto: objeto1.codProducto, descripcion: null };
    }).map(objeto => objeto);

    productos = productos.filter( e => e.descripcion!=null)

    console.log(detalleFactura)
    console.log(productos)

    if(factura && detalleFactura && empleado && cliente && pago && fecha && estadoFactura){
      this.Factura = {...factura}
      this.detalleFacturaInfo = []
      detalleFactura.forEach((objeto,index) => {
        const objeto1 = {
          cantidad:  objeto.cantidad,
          codProducto: objeto.codProducto ,
          idDetalleFactura: objeto.idDetalleFactura,
          numFactura: objeto.numFactura,
          precioUni:objeto.precioUni,
          descripcion:productos[index].descripcion
        };
        
        this.detalleFacturaInfo.push(objeto1);
      })
      this.Empleado = empleado
      this.Cliente = cliente
      this.EstadoFactura = estadoFactura
      this.FechaFactura = fecha
      this.productosDetalleMostrar = productos

      let date: Date = new Date(this.FechaFactura.fechaEmision);
      console.log(date);
      let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
      this.fechadetallefactura = formatoFecha;
      this.Pago.monto = pago.reduce((acumulador, objeto) => acumulador + objeto.monto, 0)
      this.Subtotal = detalleFactura.reduce((a,o)=> a = (o.cantidad * o.precioUni),0)
      this.Total = this.Subtotal + (this.Subtotal*this.Factura.impuestos) - (this.Subtotal*this.Factura.descuento);
    }

    this.openDialogWithTemplate(template,true)
  }




  openDialogWithTemplate(template: TemplateRef<any>, Opendetails:boolean = false) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });

    this.matDialogRef.afterClosed().subscribe((res) => {

      if(Opendetails){
        this.resetData();
      }
    });
  }

  cancelDialogResult() {
    this.matDialogRef.close()
  }

  btnClick = 'left';

  getBtnClick(name: string): string {
    // this.getEventBtnClick()
    if (name == this.btnClick)
      return 'active'
    return 'no-active'
  }

  setBtnClick(name: string): void {
    this.btnClick = name;
  }
}




class ExampleDataSource extends DataSource<any> {
  private _dataStream = new ReplaySubject<any[]>();

  constructor(initialData: any[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<any[]> {
    return this._dataStream;
  }

  disconnect() { }

  setData(data: any[]) {
    this._dataStream.next(data);
  }
}
function objeto(value: DetalleFactura, index: number, obj: DetalleFactura[]): value is DetalleFactura {
  throw new Error('Function not implemented.');
}

