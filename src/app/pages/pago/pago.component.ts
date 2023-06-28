import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { EventBtnClick, HeaderData } from 'src/app/header/header-data';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import Swal from 'sweetalert2';

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

interface Factura {
  numFactura: number;
  idEstadoFactura: number;
  idFechaFactura: number;
  numEmpleado: number;
  codCliente: number
  impuestos: number;
  descuento: number;
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

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent {
  myData: any[] = [];
  myData$: any;

  tableColumns: TableColumn[] = []
  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };

  pagoList: Pago[] = []
  fechaPagoList: FechaPago[] = []
  facturaList: Factura[] = []
  fechaFacturaList: FechaFactura[] = []
  empleadoList: Empleado[] = []
  clienteList: Cliente[] = []
  detalleFacturaList: DetalleFactura[] = []

  tipoPago: string[] = ['Credito', 'Contado']
  TipoPago: string = 'Contado'

  Pago: Pago = {
    idPago: 0,
    numFactura: 0,
    idFechaPago: 0,
    monto: 0,
    tipoPago: false
  }

  Factura: Factura = {
    numFactura: 0,
    idEstadoFactura: 0,
    idFechaFactura: 0,
    numEmpleado: 0,
    codCliente: 0,
    impuestos: 0,
    descuento: 0
  }

  FechaPago: FechaPago = {
    idFechaPago: 0,
    fechaPago: ''
  }

  FechaFactura: FechaFactura = {
    idFechaFactura: 0,
    fechaEmision: ''
  }

  DetalleFactura: DetalleFactura = {
    idDetalleFactura: 0,
    numFactura: 0,
    codProducto: 0,
    cantidad: 0,
    precioUni: 0
  }


  dataUpdate: any = undefined

  dataTableValidators = false
  private matDialogRef!: MatDialogRef<DialogComponent>;

  constructor(private dataService: MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService) { }


  ngOnInit(): void {

    this.myData$ = forkJoin(
      this.dataService.getData('pago'),
      this.dataService.getData('fechapago'),
      this.dataService.getData('factura'),
      this.dataService.getData('fechafactura'),
      this.dataService.getData('empleado'),
      this.dataService.getData('cliente'),
      this.dataService.getData('detallefactura'),
    ).pipe(
      map((data: any[]) => {
        this.pagoList = data[0];
        this.fechaPagoList = data[1];
        this.facturaList = data[2];
        this.fechaFacturaList = data[3];
        this.empleadoList = data[4];
        this.clienteList = data[5];
        this.detalleFacturaList = data[6];

        console.log(this.fechaPagoList)

        this.myData = this.pagoList.map((element) => {
          let fecha = this.fechaPagoList.find(e => e.idFechaPago === element.idFechaPago)
          let factura = this.facturaList.find(e => e.numFactura === element.numFactura)

          let date: Date = new Date(fecha?.fechaPago ? fecha.fechaPago : '')
          const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

          return {
            numFactura: element.numFactura,
            idPago: element.idPago,
            fechaPago: formatoFecha,
            monto: element.monto,
            tipoPago: element.tipoPago ? 'Credito' : 'Contado'
          }
        })

        return this.myData
      })
    )
    this.setTableColumns();
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Numero de factura', def: 'numFactura', dataKey: 'numFactura' },
      { label: 'ID Pago', def: 'idPago', dataKey: 'idPago' },
      { label: 'Fecha Pago', def: 'fechaPago', dataKey: 'fechaPago' },
      { label: 'Monto', def: 'monto', dataKey: 'monto' },
      { label: 'Tipo de Pago', def: 'tipoPago', dataKey: 'tipoPago' }
    ]
  }

  getEventBtnClickHeader() {
    // console.log(HeaderData.eventBtnClick)
    if (!HeaderData.eventBtnClick) {
      if (this.facturaFormat.length === 0) {
        this.loadDataCreate()
        console.log(this.FacturaFormat)
      }
    }
    return HeaderData.eventBtnClick;
  }

  formDataCreate: FormGroup = this.formBuilder.group(
    {
      'factura': [this.Factura.numFactura, Validators.required],
      'fechaPago': [this.FechaPago.fechaPago, Validators.required],
      'tipoPago': [this.TipoPago, Validators.required],
      'monto': [this.Pago.monto, Validators.required],
    }
  )

  formGetDataCreate(fr: string) {
    return this.formDataCreate.get(fr) as FormControl;
  }

  facturaFormat: any[] = []
  FacturaFormat: any

  tableColumnsFactura = [
    { label: 'Numero de factura', def: 'numFactura', dataKey: 'numFactura' },
    { label: 'Fecha factura', def: 'fechaFactura', dataKey: 'fechaFactura' },
    { label: 'Empleado', def: 'empleado', dataKey: 'empleado' },
    { label: 'Cliente', def: 'cliente', dataKey: 'cliente' },
    { label: 'Abonado', def: 'abono', dataKey: 'abono' },
    { label: 'Total', def: 'total', dataKey: 'total' }
  ]

  formatInforFactura() {
    let factura = this.facturaList.filter(e => e.idEstadoFactura !== 3 && e.idEstadoFactura !== 4)
    this.facturaFormat = factura.map((element) => {
      // console.log(element)
      let empleado = this.empleadoList.find(e => e.numEmpleado === element.numEmpleado)
      let cliente = this.clienteList.find(e => e.codCliente === element.codCliente)
      // console.log(cliente)
      let detalleFactura = this.detalleFacturaList.filter(e => e.numFactura === element.numFactura)
      let fecha = this.fechaFacturaList.find(e => e.idFechaFactura === element.idFechaFactura)

      let pago = this.pagoList.filter(e => e.numFactura === element.numFactura)

      let abonado = pago.reduce((acumulador, objeto) => acumulador + objeto.monto, 0)
      let result = detalleFactura.reduce((acumulador, objeto) => acumulador + (objeto.cantidad * objeto.precioUni), 0)

      let date: Date = new Date(fecha?.fechaEmision ? fecha.fechaEmision : '')
      const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
      return {
        numFactura: element.numFactura,
        fechaFactura: formatoFecha,
        empleado: empleado?.nombres + ' ' + empleado?.apellidos,
        cliente: cliente?.nombres + ' ' + cliente?.apellidos,
        abono: abonado,
        total: ((result - (element.descuento * result))
          + (result * element.impuestos)).toFixed(2)
      }
    })
    console.log(this.facturaFormat)

  }

  resultDataTableFactura(data: any) {
    if (data) {
      this.FacturaFormat = data
      let factura = this.facturaList.find(e => e.numFactura === data.numFactura)
      if (factura) {
        this.Factura = { ...factura }
      }
      console.log(this.Factura)
      this.cancelDialogResult()
    }
  }

  loadDataCreate() {
    let date: Date = new Date(new Date())
    const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
    this.FechaPago.fechaPago = formatoFecha
    this.formatInforFactura()
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
    //aqui se obtiene la fecha actual
    let fecha1 = new Date();
    fecha1.setHours(0, 0, 0, 0) // se pone la hora en 00:00:00

    // buscamos si existe una fecha que coincida con la fecha actual
    let fecha = this.fechaPagoList.find(e => new Date(e.fechaPago).toString() == fecha1.toString())
    //estaba variable se usa para comprobar despues si la fecha existe
    let F = -1;
    //se pone !fecha por que sino existe lanza undifine y poniendo ! lo lanza como true
    if (!fecha) {
      // se usa para obtener el ultimo id
      const numeros = this.fechaPagoList.map(objeto => objeto.idFechaPago);
      F = Math.max(...numeros) + 1 // se le suma 1 y se guarda


      let FechaPago = {
        fechaPago: fecha1
      }

      console.log(FechaPago.fechaPago.toString())
      this.dataService.postData('fechapago', FechaPago).then((success) => {
        if (success) {
          let total = (this.FacturaFormat.total - this.FacturaFormat.abono) - this.Pago.monto

          let pago = {
            numFactura: this.Factura.numFactura,
            idFechaPago: F !== -1 ? F : fecha?.idFechaPago,
            monto: total <= 0 ? (this.FacturaFormat.total - this.FacturaFormat.abono) : this.Pago.monto,
            tipoPago: this.TipoPago === 'Contado' ? false : true
          }

          // console.log(total)

          this.dataService.postData('pago', pago)

          if (total <= 0) {
            this.Factura.idEstadoFactura = 3
            this.dataService.updateData('factura', this.Factura, this.Factura.numFactura).then((success) => {
              if (success) {
                Swal.fire({
                  icon: 'success',
                  title: 'Exito',
                  text: 'El pago se realizo correctamente',
                  footer: 'El cambio es de $' + total * (-1)
                })
                this.resetData()
                this.formDataCreate.reset()
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
            this.Factura.idEstadoFactura = 2
            this.dataService.updateData('factura', this.Factura, this.Factura.numFactura).then((success) => {
              if (success) {
                Swal.fire(
                  'Exito!',
                  'La informacion a sido actualizado con exito',
                  'success'
                )
                this.resetData()
                this.formDataCreate.reset()
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
      let subTotal = (this.FacturaFormat.total - this.FacturaFormat.abono)
      let total = subTotal - this.Pago.monto

      let pago = {
        numFactura: this.Factura.numFactura,
        idFechaPago: F !== -1 ? F : fecha?.idFechaPago,
        monto: total <= 0 ? (subTotal < 0 ? subTotal * -1 : subTotal) : this.Pago.monto,
        tipoPago: this.TipoPago === 'Contado' ? false : true
      }

      // console.log(pago)

      this.dataService.postData('pago', pago)

      if (total <= 0) {
        this.Factura.idEstadoFactura = 3
        this.dataService.updateData('factura', this.Factura, this.Factura.numFactura).then((success) => {
          if (success) {
            Swal.fire({
              icon: 'success',
              title: 'Exito',
              text: 'El pago se realizo correctamente',
              footer: 'El cambio es de $' + total * (-1)
            })
            this.resetData()
            this.formDataCreate.reset()
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
        this.Factura.idEstadoFactura = 2
        this.dataService.updateData('factura', this.Factura, this.Factura.numFactura).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'La informacion a sido actualizado con exito',
              'success'
            )
            this.resetData()
            this.formDataCreate.reset()
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
    }

  }

  resetData() {

    // HeaderData.eventBtnClick = false
    // console.log(HeaderData.eventBtnClick)

    EventBtnClick.setMiVariable(true)

    this.TipoPago = 'Contado'

    this.Pago = {
      idPago: 0,
      numFactura: 0,
      idFechaPago: 0,
      monto: 0,
      tipoPago: false
    }

    this.Factura = {
      numFactura: 0,
      idEstadoFactura: 0,
      idFechaFactura: 0,
      numEmpleado: 0,
      codCliente: 0,
      impuestos: 0,
      descuento: 0
    }

    this.FechaPago = {
      idFechaPago: 0,
      fechaPago: ''
    }

    this.FechaFactura = {
      idFechaFactura: 0,
      fechaEmision: ''
    }

    this.DetalleFactura = {
      idDetalleFactura: 0,
      numFactura: 0,
      codProducto: 0,
      cantidad: 0,
      precioUni: 0
    }

    this.facturaFormat = []

    this.dataUpdate = undefined


  }

  resultDataTableUpdate(data: any) {
    if (data) {
      let pago = this.pagoList.find(e => e.idPago === data.idPago)
      let factura = this.facturaList.find(e => e.numFactura === pago?.numFactura)
      let fechaPago = this.fechaPagoList.find(e => e.idFechaPago === pago?.idFechaPago)
      let empleado = this.empleadoList.find(e => e.numEmpleado === factura?.numEmpleado)
      let cliente = this.clienteList.find(e => e.codCliente === factura?.codCliente)

      if (pago && factura && fechaPago) {
        let fecha1 = new Date();
        fecha1.setHours(0, 0, 0, 0)
        let fecha = new Date(fechaPago.fechaPago)
        const diferenciaMs = fecha1.getTime() - fecha.getTime();
        const diferenciaDias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
        if (diferenciaDias > 1) {
          Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'Lo siento, ya no se puede actualizar el pago ya paso mas de un dia!',
          })
        } else {
          this.Factura = { ...factura }
          this.Pago = { ...pago }

          let date: Date = new Date(fechaPago.fechaPago)
          const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

          this.FechaPago = { ...fechaPago }
          this.FechaPago.fechaPago = formatoFecha
          this.TipoPago = pago.tipoPago ? 'Credito' : 'Contado'
          this.dataUpdate = data

          // let subTotal = (this.FacturaFormat.total-this.FacturaFormat.abono)
          // let total = subTotal- this.Pago.monto

          // let pagoList = this.pagoList.filter(e => e.numFactura === factura?.numFactura)
          // let detalleFactura = this.detalleFacturaList.filter(e => e.numFactura === factura?.numFactura)
          // let abonado = pagoList.reduce((acumulador, objeto) => acumulador + objeto.monto, 0)
          // let result = detalleFactura.reduce((acumulador, objeto) => acumulador + (objeto.cantidad * objeto.precioUni), 0)


          this.formatInforFactura()
          // this.facturaFormat.find(e=>e.numFactura === pago?.numFactura)

        }
      }
    } else {
      this.dataUpdate = data
    }
  }

  // resultDataTableFacturaUpdate(data: any) {
  //   if (data) {
  //     this.FacturaFormat = data
  //     let factura = this.facturaList.find(e => e.numFactura === data.numFactura)
  //     let pago = this.pagoList.find(e => e.idPago)
  //     if (factura) {
  //       this.Factura = { ...factura }
  //     }
  //     this.cancelDialogResult()
  //   }
  // }

  formDataUpdate: FormGroup = this.formBuilder.group(
    {
      'factura': [this.Factura.numFactura, Validators.required],
      'fechaPago': [this.FechaPago.fechaPago, Validators.required],
      'tipoPago': [this.TipoPago, Validators.required],
      'monto': [this.Pago.monto, Validators.required],
    }
  )

  formGetDataUpdate(fr: string) {
    return this.formDataUpdate.get(fr) as FormControl;
  }

  loadConfirmationDataUpdate() {

    //console.log(this.FacturaFormat.total)
    //console.log(this.FacturaFormat.abono)
    console.log(this.Pago.monto)

    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea actualizar la informacion?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveDataUpdate()
        // this.formUpdateData.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen a salvo:)',
          'error'
        )
      }
    });
  }

  saveDataUpdate() {
    let detalleFactura = this.detalleFacturaList.filter(e => e.numFactura === this.Factura.numFactura)
    let result = detalleFactura.reduce((acumulador, objeto) => acumulador + (objeto.cantidad * objeto.precioUni), 0)

    //let total = ((this.FacturaFormat.total - this.FacturaFormat.abono) - this.Pago.monto)
    let pago = this.pagoList.filter(e => e.numFactura === this.Pago.numFactura && e.idPago !== this.Pago.idPago)
    let abono = pago.reduce((acumulador, objeto) => acumulador + objeto.monto, 0)

    let total = ((result - abono) - this.Pago.monto)

    if (total < 0) {
      let p = {
        idPago: this.Pago.idPago,
        numFactura: this.Factura.numFactura,
        idFechaPago: this.Pago.idFechaPago,
        monto: (this.FacturaFormat.total - this.FacturaFormat.abono).toFixed(2),
        tipoPago: this.TipoPago == 'Contado' ? false : true
      }
      // console.log(p)
      this.dataService.updateData('pago', p, p.idPago)

      this.Factura.idEstadoFactura = 3

      this.dataService.updateData('factura', this.Factura, this.Factura.numFactura).then((success) => {
        if (success) {
          Swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'El pago se realizo correctamente',
            footer: 'El cambio es de $' + ((this.FacturaFormat.total - this.FacturaFormat.abono) * (-1)).toFixed(2)
          })
          this.resetData()
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
      let p = {
        idPago: this.Pago.idPago,
        numFactura: this.Factura.numFactura,
        idFechaPago: this.Pago.idFechaPago,
        monto: this.Pago.monto,
        tipoPago: this.TipoPago == 'Contado' ? false : true
      }

      this.dataService.updateData('pago', p, p.idPago).then((success) => {
        if (success) {
          Swal.fire(
            'Exito!',
            'La informacion a sido actualizado con exito',
            'success'
          )
          this.resetData()
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

  cancelDialogResult() {
    this.matDialogRef.close()
  }

  openDialogWithTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });

    this.matDialogRef.afterClosed().subscribe((res) => {
    });
  }

}
