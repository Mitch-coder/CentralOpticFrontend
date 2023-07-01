import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { elementAt, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ExamenVistaComponent } from '../examen-vista/examen-vista.component';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { EventBtnClick, HeaderData } from 'src/app/header/header-data';
import Swal from 'sweetalert2';

//Interfaz Principal
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

interface EstadoPedido {
  idEstadoPedido: number;
  estadoPedido: string;
}

interface FechaPedido {
  idFechaPedido: number;
  fechaPedido: string;
}

interface Laboratorio {
  idLaboratorio: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
}

interface Empleado {
  numEmpleado: number;
  nombres: string;
  apellidos: string;
  dirreccion: string;
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

interface FechaExamen {
  idFechaExamen: number;
  fechaExamen: string;
}


@Component({
  selector: 'app-orden-pedido',
  templateUrl: './orden-pedido.component.html',
  styleUrls: ['./orden-pedido.component.css']
})


export class OrdenPedidoComponent {
  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
  myData: any[] = [];
  myData$: any;

  tableColumns: TableColumn[] = []

  ordenPedidoList: OrdenPedido[] = []
  estadoPedidoList: EstadoPedido[] = []
  fechaPedidoList: FechaPedido[] = []
  laboratorioList: Laboratorio[] = []
  empleadoList: Empleado[] = []
  examenVistaList: ExamenVista[] = []
  clienteList: Cliente[] = []
  nombreProductoList: NombreProducto[] = []
  marcaList: Marca[] = []
  productoList: Producto[] = []
  fechaExamenList: FechaExamen[] = []

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

  EstadoPedido: EstadoPedido = {
    idEstadoPedido: 0,
    estadoPedido: ''
  }

  FechaPedido: FechaPedido = {
    idFechaPedido: 0,
    fechaPedido: ''
  }

  Laboratorio: Laboratorio = {
    idLaboratorio: 0,
    nombre: '',
    direccion: '',
    telefono: '',
    correo: ''
  }

  Empleado: Empleado = {
    numEmpleado: 0,
    nombres: '',
    apellidos: '',
    dirreccion: ''
  }

  ExamenVista: ExamenVista = {
    numExamen: 0,
    codCliente: 0,
    idFechaExamen: 0,
    ojoIzquierdo: 0,
    ojoDerecho: 0,
    descripLenteIzq: '',
    descripLenteDer: ''
  }

  Cliente: Cliente = {
    codCliente: 0,
    cedula: '',
    nombres: '',
    apellidos: '',
    direccion: ''
  }

  NombreProducto: NombreProducto = {
    idNombreProducto: 0,
    nombreProducto: ''
  }

  Marca: Marca = {
    idMarca: 0,
    marca: ''
  }

  Producto: Producto = {
    codProducto: 0,
    idMarca: 0,
    idNombreProducto: 0,
    descripcion: '',
    precioActual: 0,
    estadoProducto: false
  }

  FechaExamen: FechaExamen = {
    idFechaExamen: 0,
    fechaExamen: ''
  }

  dataUpdate: any = undefined

  dataTableValidators = false
  private matDialogRef!: MatDialogRef<DialogComponent>;


  constructor(private dataService: MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService) { }

  ngOnInit(): void {

    let objeto = history.state.objeto;

    if (objeto) {
      this.ExamenVista = objeto
      this.dataTableValidators = true
    }

    this.myData$ = forkJoin(
      this.dataService.getData('ordenpedido'),
      this.dataService.getData('estadopedido'),
      this.dataService.getData('fechapedido'),
      this.dataService.getData('laboratorio'),
      this.dataService.getData('empleado'),
      this.dataService.getData('examenvista'),
      this.dataService.getData('cliente'),
      this.dataService.getData('nombreProducto'),
      this.dataService.getData('marca'),
      this.dataService.getData('producto'),
      this.dataService.getData('fechaexamen'),

    ).pipe(
      map((data: any[]) => {
        //Definimos las variables donde se van a guardar cada array de datos consultados
        this.ordenPedidoList = data[0];
        this.estadoPedidoList = data[1];
        this.fechaPedidoList = data[2];
        this.laboratorioList = data[3];
        this.empleadoList = data[4];
        this.examenVistaList = data[5];
        this.clienteList = data[6];
        this.nombreProductoList = data[7];
        this.marcaList = data[8];
        this.productoList = data[9]
        this.fechaExamenList = data[10]

        console.log(this.estadoPedidoList)


        this.myData = this.ordenPedidoList.map(element => {
          const estadoPedido = this.estadoPedidoList.find(e => e.idEstadoPedido == element.idEstadoPedido)?.estadoPedido;
          const fechaPedidoF = this.fechaPedidoList.find(e => e.idFechaPedido == element.idFechaPedido)?.fechaPedido;
          const laboratorioF = this.laboratorioList.find(e => e.idLaboratorio == element.idLaboratorio)?.nombre;
          const empleadorF = this.empleadoList.find(e => e.numEmpleado == element.numEmpleado)?.nombres;
          let date: Date = new Date(fechaPedidoF ? fechaPedidoF : '')
          let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

          return {
            //Aqui se tiene que especificar los elementos a mostrar 
            numOrden: element.numOrden,
            numExamen: element.numExamen,
            descripcion: element.descripcion,
            costo: element.costo,
            codProducto: element.codProducto,
            // estadopedido:estadopedidoF[0].estadoPedido,
            estadoPedido: estadoPedido,
            fechaPedido: formatoFecha,
            laboratorio: laboratorioF,
            empleado: empleadorF,
          }
        })
        // console.log(this.myData)
        return this.myData;
      })
    )

    this.setTableColumns();
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Número de Pedido', def: 'numOrden', dataKey: 'numOrden' },
      { label: 'Número de Examen', def: 'numExamen', dataKey: 'numExamen' },
      { label: 'Descripción', def: 'descripcion', dataKey: 'descripcion' },
      { label: 'Costo', def: 'costo', dataKey: 'costo' },
      { label: 'Código del Producto', def: 'codProducto', dataKey: 'codProducto' },
      { label: 'Estado del Pedido', def: 'estadoPedido', dataKey: 'estadoPedido' },
      { label: 'Fecha del Pedido', def: 'fechaPedido', dataKey: 'fechaPedido' },
      { label: 'Laboratorio', def: 'laboratorio', dataKey: 'laboratorio' },
      { label: 'Empleado', def: 'numEmpleado', dataKey: 'empleado' },
    ]
  }

  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick) {
      this.dataUpdate = undefined
      if (!this.tableDataExamenVista) {
        console.log('entro')
        this.loadDataCreate()
      }
    }
    return HeaderData.eventBtnClick;
  }


  /////////////////////////////////////////////////////////////////////////////////////////
  // codigo de actualizar informacion



  setDataUpdate(data: any) {
    this.dataUpdate = data
    if (data) {
      let ordenPedido = this.ordenPedidoList.find(e => e.numOrden == data.numOrden)
      let examenVista = this.examenVistaList.find(e => e.numExamen == data.numExamen)
      let producto = this.productoList.find(e => e.codProducto = data.codProducto)
      let estadoPedido = this.estadoPedidoList.find(e => e.estadoPedido == data.estadoPedida)
      let nombrePrducto = this.nombreProductoList.find(e => e.idNombreProducto == producto?.idNombreProducto)
      let marca = this.marcaList.find(e => e.idMarca == producto?.idMarca)
      let fechaPedida = this.fechaPedidoList.find(e => e.idFechaPedido == ordenPedido?.idFechaPedido)
      let laboratorio = this.laboratorioList.find(e => e.idLaboratorio == ordenPedido?.idLaboratorio)
      let empleado = this.empleadoList.find(e => e.numEmpleado == ordenPedido?.numEmpleado)
      let cliente = this.clienteList.find(e => e.codCliente == examenVista?.codCliente)

      if (ordenPedido && examenVista && producto && estadoPedido && nombrePrducto && marca && fechaPedida && laboratorio && empleado && cliente) {
        this.OrdenPedido = ordenPedido
        this.ExamenVista = examenVista
        this.Producto = producto
        this.EstadoPedido = estadoPedido
        this.NombreProducto = nombrePrducto
        this.Marca = marca
        this.FechaPedido = fechaPedida
        this.Laboratorio = laboratorio
        this.Empleado = empleado
        this.Cliente = cliente
      }
    }
  }

  resetData() {
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

    this.EstadoPedido = {
      idEstadoPedido: 0,
      estadoPedido: ''
    }

    this.FechaPedido = {
      idFechaPedido: 0,
      fechaPedido: ''
    }

    this.Laboratorio = {
      idLaboratorio: 0,
      nombre: '',
      direccion: '',
      telefono: '',
      correo: ''
    }

    this.Empleado = {
      numEmpleado: 0,
      nombres: '',
      apellidos: '',
      dirreccion: ''
    }

    this.ExamenVista = {
      numExamen: 0,
      codCliente: 0,
      idFechaExamen: 0,
      ojoIzquierdo: 0,
      ojoDerecho: 0,
      descripLenteIzq: '',
      descripLenteDer: ''
    }

    this.Cliente = {
      codCliente: 0,
      cedula: '',
      nombres: '',
      apellidos: '',
      direccion: ''
    }

    this.NombreProducto = {
      idNombreProducto: 0,
      nombreProducto: ''
    }

    this.Marca = {
      idMarca: 0,
      marca: ''
    }

    this.Producto = {
      codProducto: 0,
      idMarca: 0,
      idNombreProducto: 0,
      descripcion: '',
      precioActual: 0,
      estadoProducto: false
    }

    this.tableDataExamenVista = undefined
    this.tableDataProducto = undefined
  }

  formDataUpdate: FormGroup = this.formBuilder.group(
    {
      'estadoPedido ': [this.EstadoPedido, Validators.required],
    }
  )

  formGetDataUpdate(fr: string) {
    return this.formDataUpdate.get(fr) as FormControl;
  }

  loadConfirmationDataUpdate() {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea actualizar el estado del pedido?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveDataUpdate()
        this.formDataUpdate.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'El estado sigue igual :)',
          'error'
        )
      }
    });
  }

  saveDataUpdate() {
    if (this.OrdenPedido.idEstadoPedido !== this.EstadoPedido.idEstadoPedido) {

      let ordenPedido = {
        numOrden: this.OrdenPedido.numOrden,
        numExamen: this.OrdenPedido.numExamen,
        numEmpleado: this.OrdenPedido.numEmpleado,
        idLaboratorio: this.OrdenPedido.idLaboratorio,
        codProducto: this.OrdenPedido.codProducto,
        idEstadoPedido: this.EstadoPedido.idEstadoPedido,
        idFechaPedido: this.OrdenPedido.idFechaPedido,
        costo: this.OrdenPedido.costo,
        descripcion: this.OrdenPedido.descripcion,
      }

      this.dataService.updateData('ordenpedido', ordenPedido, this.OrdenPedido.numOrden).then((success) => {
        if (success) {
          Swal.fire(
            'Exito!',
            'El estado del pedido a sido actualizado con exito',
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

  loadDataCreate() {
    this.EstadoPedido = {
      idEstadoPedido: 2,
      estadoPedido: 'Pendiente'
    }

    this.FechaPedido = {
      idFechaPedido: -1,
      fechaPedido: new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(new Date())
    }

    this.tableDataExamenVista = this.examenVistaList.map((element) => {
      let client = this.clienteList.find(e => e.codCliente == element.codCliente)
      let fecha = this.fechaExamenList.find(e => e.idFechaExamen == element.idFechaExamen)

      let date: Date = new Date(fecha?.fechaExamen ? fecha.fechaExamen : '')
      let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
      return {
        numExamen: element.numExamen,
        cliente: client?.nombres,
        fechaExamen: formatoFecha,
        // ojoIzquierdo: element.ojoIzquierdo,
        // ojoDerecho: element.ojoDerecho,
        descripLenteIzq: element.descripLenteIzq,
        descripLenteDer: element.descripLenteDer
      }
    })

    this.EstadoPedido.idEstadoPedido

    this.tableDataProducto = this.productoList.map((element) => {
      let marca = this.marcaList.find(e => e.idMarca == element.idMarca)
      let nombre = this.nombreProductoList.find(e => e.idNombreProducto == element.idNombreProducto)

      return {
        codProducto: element.codProducto,
        marca: marca?.marca,
        nombre: nombre?.nombreProducto,
        descripcion: element.descripcion,
        precioActual: element.precioActual,
        // estadoProducto: element.estadoProducto ? 'Inactivo' : 'Activo'
      }
    })
  }

  formDataCreate: FormGroup = this.formBuilder.group(
    {
      'examenVista': [this.ExamenVista, Validators.required],
      'descripcion': [this.OrdenPedido.descripcion, Validators.required],
      'costo': [this.OrdenPedido.costo, Validators.required],
      'producto': [this.Producto, Validators.required],
      'estadoPedido': [this.EstadoPedido.estadoPedido, Validators.required],
      'fechaPedido': [this.FechaPedido, Validators.required],
      'laboratorio': [this.Laboratorio, Validators.required],
      'empleado': [this.Empleado, Validators.required]
    }
  )

  formGetDataCreate(fr: string) {
    return this.formDataCreate.get(fr) as FormControl;
  }

  tableColumnsExamenVista: TableColumn[] = [
    { label: 'Número Examen', def: 'numExamen', dataKey: 'numExamen' },
    { label: 'Cliente', def: 'cliente', dataKey: 'cliente' },
    { label: 'Fecha del Examen', def: 'fechaExamen', dataKey: 'fechaExamen' },
    // { label: 'Ojo Izquierdo', def: 'ojoIzquierdo', dataKey: 'ojoIzquierdo' },
    // { label: 'Ojo Derecho', def: 'ojoDerecho', dataKey: 'ojoDerecho' },
    { label: 'Descripción Lente Izquierdo', def: 'descripLenteIzq', dataKey: 'descripLenteIzq' },
    { label: 'Descripción Lente Derecho', def: 'descripLenteDer', dataKey: 'descripLenteDer' }
  ]

  tableDataExamenVista: any = undefined

  resultDataTableExamenVista(data: any) {
    let examenVista = this.examenVistaList.find(e => e.numExamen == data.numExamen)

    if (examenVista) {
      this.ExamenVista = examenVista
    }
    this.cancelDialogResult()
  }

  tableColumnsProducto: TableColumn[] = [
    { label: 'Código del Producto', def: 'codProducto', dataKey: 'codProducto' },
    { label: 'Marca', def: 'marca', dataKey: 'marca' },
    { label: 'Nombre', def: 'Nombre', dataKey: 'nombre' },
    { label: 'Descripción', def: 'Descripcion', dataKey: 'descripcion' },
    { label: 'Precio Actual', def: 'precioActual', dataKey: 'precioActual' },
    // {label:'Estado Producto', def:'estadoProducto', dataKey:'estadoProducto'}
  ]

  tableDataProducto: any = undefined

  resultDataTableProducto(data: any) {
    let producto = this.productoList.find(e => e.codProducto == data.codProducto)

    if (producto) {
      this.Producto = producto
    }
    this.cancelDialogResult()
  }

  tableColumnsLaboratorio = [
    { label: 'Código de Laboratorio', def: 'idLaboratorio', dataKey: 'idLaboratorio' },
    { label: 'Nombre', def: 'nombre', dataKey: 'nombre' },
    { label: 'Correo', def: 'correo', dataKey: 'correo' },
    { label: 'Telefono', def: 'telefono', dataKey: 'telefono' },
    { label: 'Dirección', def: 'direccion', dataKey: 'direccion' }
  ]

  // tableDataLaboratorio: any = []
  resultDataTableLaboratorio(data: any) {
    let laboratorio = this.laboratorioList.find(e => e.idLaboratorio == data.idLaboratorio)

    if (laboratorio) {
      this.Laboratorio = laboratorio
    }
    this.cancelDialogResult()
  }

  tableColumnsEmpleado = [
    { label: 'Número de Empleado', def: 'NumEmpleado', dataKey: 'numEmpleado' },
    { label: 'Nombres', def: 'nombres', dataKey: 'nombres' },
    { label: 'Apellidos', def: 'apellidos', dataKey: 'apellidos' },
    { label: 'Dirección', def: 'direccion', dataKey: 'direccion' }
  ]

  // tableDataEmpleado: any = []
  resultDataTableEmpleado(data: any) {
    let empleado = this.empleadoList.find(e => e.numEmpleado == data.numEmpleado)

    if (empleado) {
      this.Empleado = empleado
    }
    this.cancelDialogResult()
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

        if(
          this.ExamenVista.numExamen == 0 ||
          this.Laboratorio.idLaboratorio == 0 ||
          this.Producto.codProducto  == 0 
        ){

          Swal.fire(
            'Cancelado',
            'Error al ingresar los datos',
            'error'
          )

        }else{
  
          this.saveDataCreate();
        }
        //this.formUpdateData.reset()
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
    
    let fecha1 = new Date();
    fecha1.setHours(0, 0, 0, 0)
    console.log(fecha1)

    let fecha = this.fechaPedidoList.find(e => new Date(e.fechaPedido).toString() == fecha1.toString())

    let idFecha = -1;

    if (!fecha) {

      let fech = {
        fechaPedido: fecha1
      }

      this.dataService.postData('fechapedido', fech).then((success) => {
        console.log(success);
        if (success) {
          
          const numeros = this.fechaPedidoList.map(objeto => objeto.idFechaPedido);
          idFecha = Math.max(...numeros) + 1 // se le suma 1 y se guarda

          let ordenPedido = {
            numExamen: this.ExamenVista.numExamen,
            numEmpleado: this.Empleado.numEmpleado,
            idLaboratorio: this.Laboratorio.idLaboratorio,
            codProducto: this.Producto.codProducto,
            idEstadoPedido: this.EstadoPedido.idEstadoPedido,
            idFechaPedido: idFecha !== -1 ? idFecha : this.FechaExamen.idFechaExamen,
            costo: this.OrdenPedido.costo,
            descripcion: this.OrdenPedido.descripcion
          }

          this.dataService.postData('ordenpedido', ordenPedido).then((success) => {
            if (success) {
              Swal.fire(
                'Exito!',
                'La informacion a sido agregada con exito',
                'success'
              )
              this.resetData();
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
        else {
          Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'Error al insertar datos de fecha',
            footer: '<a href="">¿Por qué tengo este problema??</a>'
          })
        }
      }
      )
    } else {

      console.log(this.fechaPedidoList);
      console.log(fecha);

      idFecha = fecha.idFechaPedido
      console.log(idFecha);

      let ordenPedido = {
        numExamen: this.ExamenVista.numExamen,
        numEmpleado: this.Empleado.numEmpleado,
        idLaboratorio: this.Laboratorio.idLaboratorio,
        codProducto: this.Producto.codProducto,
        idEstadoPedido: this.EstadoPedido.idEstadoPedido,
        idFechaPedido: idFecha === -1 ? this.FechaExamen.idFechaExamen : idFecha,
        costo: this.OrdenPedido.costo,
        descripcion: this.OrdenPedido.descripcion
      }

      console.log(ordenPedido)

      this.dataService.postData('ordenpedido', ordenPedido).then((success) => {
        if (success) {
          Swal.fire(
            'Exito!',
            'La informacion a sido agregada con exito',
            'success'
          )
          this.resetData()
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

  formDataUpdateDialog: FormGroup = this.formBuilder.group(
    {
      'estadoPedido': [this.EstadoPedido.estadoPedido, Validators.required],
    }
  )

  // getDataUpdate(){
  //   this.openDialogWithTemplate()
  // }

  getDataUpdateDialog(data: any, template: TemplateRef<any>) {

    this.dataUpdate = data
    if (data) {
      let ordenPedido = this.ordenPedidoList.find(e => e.numOrden == data.numOrden)
      let estadoPedido = this.estadoPedidoList.find(e => e.idEstadoPedido == ordenPedido?.idEstadoPedido)

      if (estadoPedido && ordenPedido) {
        if (ordenPedido.idEstadoPedido !== 3) {
          this.OrdenPedido = ordenPedido
          this.EstadoPedido = estadoPedido
          this.openDialogWithTemplate(template)
        } else {
          Swal.fire(
            'Lo siento...',
            'Los pedidos anulados ya no se pueden actualizar',
            'error'
          )
        }

      }
    }

  }

  loadConfirmationDataUpdateDialog() {


    if (this.EstadoPedido.idEstadoPedido == 3) {
      Swal.fire({
        title: 'Confirmar',
        text: 'Si cambia el estado del pedido a anulado, no se podra cambiar despues ¿seguro que desea continuar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // this.saveDataCreate()
          // this.formUpdateData.reset()
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'Los datos no se actualizaron :)',
            'error'
          )
        }
      });
    } else {
      Swal.fire({
        title: 'Confirmar',
        text: '¿Estás seguro que desea cambiar el estado del pedido?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveDataUpdateDialog()
          // this.formUpdateData.reset()
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'Los datos siguen igual :)',
            'error'
          )
        }
      });
    }
  }

  saveDataUpdateDialog() {

    this.OrdenPedido.idEstadoPedido = this.EstadoPedido.idEstadoPedido

    this.dataService.updateData('ordenpedido', this.OrdenPedido, this.OrdenPedido.numOrden).then((success) => {
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
