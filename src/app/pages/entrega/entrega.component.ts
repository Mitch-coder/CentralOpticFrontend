import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { forkJoin, map, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { EventBtnClick, HeaderData } from 'src/app/header/header-data';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { Location } from '@angular/common';

interface Entrega {
  codEntrega: number;
  idEstadoEntrega: number;
  fechaEntrega: string;
  descripcion: string;
}
interface EstadoEntrega {
  idEstadoEntrega: number;
  estadoEntrega: string;
}

interface OrdenPedidoEntrega {
  idOrdenPedido_Entrega: number;
  numOrden: number;
  codEntrega: number;
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


@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrls: ['./entrega.component.css']
})


export class EntregaComponent {
  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
  myData: any[] = [];
  myData$: any;

  tableColumns: TableColumn[] = []
  constructor(private dataService: MyDataServices,private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private location: Location) { }

  entregaList: Entrega[] = []
  estadoEntregaList: EstadoEntrega[] = []
  ordenPedidoList: OrdenPedido[] = []
  estadoPedidoList: EstadoPedido[] = []
  fechaPedidoList: FechaPedido[] = []
  laboratorioList: Laboratorio[] = []
  empleadoList: Empleado[] = []
  ordenPedidoEntregaList: OrdenPedidoEntrega[] = []

  Entrega: Entrega = {
    codEntrega: 0,
    idEstadoEntrega: 0,
    fechaEntrega: '',
    descripcion: ''
  }

  EstadoEntrega: EstadoEntrega = {
    idEstadoEntrega: 0,
    estadoEntrega: ''
  }

  EstadoPedido: EstadoPedido = {
    idEstadoPedido: 0,
    estadoPedido: ''
  }

  FechaPedido: FechaPedido = {
    idFechaPedido: 0,
    fechaPedido: ''
  }

  Laboratio: Laboratorio = {
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

  OrdenPedidoEntrega: OrdenPedidoEntrega = {
    idOrdenPedido_Entrega: 0,
    numOrden: 0,
    codEntrega: 0
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

  dataUpdate: any = undefined
  private matDialogRef!: MatDialogRef<DialogComponent>;



  ngOnInit(): void {

    this.myData$ = forkJoin(
      this.dataService.getData('entrega'),
      this.dataService.getData('estadoentrega'),
      this.dataService.getData('ordenpedido'),
      this.dataService.getData('estadopedido'),
      this.dataService.getData('fechapedido'),
      this.dataService.getData('laboratorio'),
      this.dataService.getData('empleado'),
      this.dataService.getData('ordenpedidoentrega')
    ).pipe(
      map((data: any[]) => {
        this.entregaList = data[0];
        this.estadoEntregaList = data[1];
        this.ordenPedidoList = data[2];
        this.estadoPedidoList = data[3];
        this.fechaPedidoList = data[4]
        this.laboratorioList = data[5];
        this.empleadoList = data[6];
        this.ordenPedidoEntregaList = data[7]

        console.log(this.estadoPedidoList)

        this.myData = []

        this.entregaList.forEach(element => {
          let estado = this.estadoEntregaList.find(e => e.idEstadoEntrega == element.idEstadoEntrega)
          let ordenPedido = this.ordenPedidoList.
            find(e => this.ordenPedidoEntregaList.
              find(o => o.numOrden == e.numOrden && o.codEntrega == element.codEntrega))
          let laboratorio = this.laboratorioList.find(e => e.idLaboratorio == ordenPedido?.idLaboratorio)
          let date: Date = new Date(element.fechaEntrega)
          let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);


          this.myData.push(
            {
              numPedido: ordenPedido?.numOrden,
              codEntrega: element.codEntrega,
              laboratorio: laboratorio?.nombre,
              fechaEntrega: formatoFecha,
              estadoEntrega: estado?.estadoEntrega,
              descripcion: element.descripcion
            }
          )
        })
        return this.myData
      })
    )

    this.setTableColumns();
    this.setDataTableDialog();
  }

  init() {
    this.myData$ = forkJoin(
      this.dataService.getData('entrega'),
      this.dataService.getData('estadoentrega'),
      this.dataService.getData('ordenpedido'),
      this.dataService.getData('estadopedido'),
      this.dataService.getData('fechapedido'),
      this.dataService.getData('laboratorio'),
      this.dataService.getData('empleado'),
      this.dataService.getData('ordenpedidoentrega')
    ).pipe(
      map((data: any[]) => {
        this.entregaList = data[0];
        this.estadoEntregaList = data[1];
        this.ordenPedidoList = data[2];
        this.estadoPedidoList = data[3];
        this.fechaPedidoList = data[4]
        this.laboratorioList = data[5];
        this.empleadoList = data[6];
        this.ordenPedidoEntregaList = data[7]

        console.log(this.estadoPedidoList)

        this.myData = []

        this.entregaList.forEach(element => {
          let estado = this.estadoEntregaList.find(e => e.idEstadoEntrega == element.idEstadoEntrega)
          let ordenPedido = this.ordenPedidoList.
            find(e => this.ordenPedidoEntregaList.
              find(o => o.numOrden == e.numOrden && o.codEntrega == element.codEntrega))
          let laboratorio = this.laboratorioList.find(e => e.idLaboratorio == ordenPedido?.idLaboratorio)
          let date: Date = new Date(element.fechaEntrega)
          let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);


          this.myData.push(
            {
              numPedido: ordenPedido?.numOrden,
              codEntrega: element.codEntrega,
              laboratorio: laboratorio?.nombre,
              fechaEntrega: formatoFecha,
              estadoEntrega: estado?.estadoEntrega,
              descripcion: element.descripcion
            }
          )
        })
        return this.myData
      })
    )
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Código de Entrega', def: 'codEntrega', dataKey: 'codEntrega' },
      { label: 'Número de pedido', def: 'numPedido', dataKey: 'numPedido' },
      { label: 'Laboratorio', def: 'laboratorio', dataKey: 'laboratorio' },
      { label: 'Fecha de Entrega', def: 'fechaEntrega', dataKey: 'fechaEntrega' },
      { label: 'Estado de Entrega', def: 'estadoEntrega', dataKey: 'estadoEntrega' },
      { label: 'Descripción', def: 'descripcion', dataKey: 'descripcion' }
    ]
  }

  openDialogWithTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });

    this.matDialogRef.afterClosed().subscribe((res) => {
    });
  }



  myDataTableDialog: any[] = [];
  myColumnTableDialog: TableColumn[] = [];

  setDataTableDialog() {

    this.ordenPedidoList.forEach(element => {
      console.log(element)
      if (element.idEstadoPedido === 2) {
        let fecha = this.fechaPedidoList.find(e => e.idFechaPedido == element.idFechaPedido)
        let date: Date = new Date(fecha?.fechaPedido ? fecha.fechaPedido : '')
        let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
        let empleado = this.empleadoList.find(e => e.numEmpleado == element.numEmpleado)
        let laboratorio = this.laboratorioList.find(e => e.idLaboratorio == element.idLaboratorio)

        this.myDataTableDialog.push(
          {
            numOrden: element.numOrden,
            empleado: empleado?.nombres,
            laboratorio: laboratorio?.nombre,
            fechaPedido: formatoFecha,
            descripcion: element.descripcion
          }
        )
      }
    })

    this.myColumnTableDialog = [
      { label: 'Número de Pedido', def: 'numOrden', dataKey: 'numOrden' },
      { label: 'Empleado', def: 'empleado', dataKey: 'empleado' },
      { label: 'Laboratorio', def: 'laboratorio', dataKey: 'laboratorio' },
      { label: 'Fecha del Pedido', def: 'fechaPedido', dataKey: 'fechaPedido' },
      { label: 'Descripción', def: 'descripcion', dataKey: 'descripcion' }
    ]
  }

  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick) {
      this.dataUpdate = undefined
      if(this.myDataTableDialogCreate.length === 0){
        this.loadDataCreate()
      }
      // this.resetData()
    }

    return HeaderData.eventBtnClick;
  }
  // poner una parte donde diga si se confundio porFavor marque seleccione el pedido q
  ordenPedidoListAuxiliar: OrdenPedido[] = []

  getDataUpdate(data: any) {
    this.dataUpdate = data
    this.ordenPedidoListAuxiliar = this.ordenPedidoList.filter(e => e.idEstadoPedido == 2)
    if (this.dataUpdate) {
      let ordenPedido = this.ordenPedidoList.find(e => e.numOrden == data.numPedido)
      let estado = this.estadoEntregaList.find(e => e.estadoEntrega == data.estadoEntrega)
      let entrega = this.entregaList.find(e => e.codEntrega == data.codEntrega)
      let ordenPedidoEntrega = this.ordenPedidoEntregaList.find(e => e.numOrden == ordenPedido?.numOrden &&
        e.codEntrega == entrega?.codEntrega)
      if (ordenPedido) {
        this.OrdenPedido = ordenPedido
      }

      if (estado && entrega) {
        this.EstadoEntrega = estado
        this.Entrega = entrega
        this.Entrega.descripcion = data.descripcion
      }

      if (ordenPedidoEntrega) {
        this.OrdenPedidoEntrega = ordenPedidoEntrega
      }
    }

    this.setTableDataAuxiliar()
    this.setDataTableDialog();

  }

  formUpdateData: FormGroup = this.formBuilder.group(
    {
      'ordenPedido': [this.OrdenPedido, Validators.required],
      'estado': [this.EstadoEntrega, Validators.required],
      'descripcion': [this.Entrega, Validators.required]
    }
  )

  formGetDataUpdate(fr: string) {
    // console.log(this.formCreate.get(fr) as FormControl)
    return this.formUpdateData.get(fr) as FormControl;
  }

  loadConfirmationDataUpdate() {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas guardar los datos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveDataUpdate()
        this.dataUpdate = undefined
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen a salvo :)',
          'error'
        )
      }
    });
  }

  saveDataUpdate() {
    if (this.OrdenPedidoEntrega.idOrdenPedido_Entrega !== 0) {
      let ordenPedidoEntrega = {
        idOrdenPedido_Entrega: this.OrdenPedidoEntrega.idOrdenPedido_Entrega,
        numOrden: this.OrdenPedido.numOrden,
        codEntrega: this.Entrega.codEntrega,
      }
      this.dataService.updateData('ordenpedidoentrega',
        ordenPedidoEntrega,
        this.OrdenPedidoEntrega.idOrdenPedido_Entrega).then(success => {
          if (success) {
            this.OrdenPedido.idEstadoPedido = 1
            this.dataService.updateData('ordenpedido',this.OrdenPedido,this.OrdenPedido.numOrden)
          }
        })
    } else {

      /* aqui se pondria el codigo para eliminar la union en ordenPedidoEntrega */

      let ordenPedidoEntrega = {
        numOrden: this.OrdenPedido.numOrden,
        codEntrega: this.Entrega.codEntrega,
      }
      this.dataService.postData('ordenpedidoentrega',
        ordenPedidoEntrega).then((success)=>{
          if(success){
            this.OrdenPedido.idEstadoPedido = 1
            this.dataService.updateData('ordenpedido',this.OrdenPedido,this.OrdenPedido.numOrden)
          }
        })
    }



    if (this.dataUpdate.descripcion !== this.Entrega.descripcion ||
      this.Entrega.idEstadoEntrega !== this.EstadoEntrega.idEstadoEntrega) {
      this.Entrega.idEstadoEntrega = this.EstadoEntrega.idEstadoEntrega
      console.log(this.Entrega)
      this.dataService.updateData('entrega', this.Entrega, this.Entrega.codEntrega)
    }


    Swal.fire(
      'Exito!',
      'La información ha sido actualizado con exito',
      'success'
    )
    this.init()
  }


  //codigo para si se confundio pendejo XD

  myDataTableAuxiliar: any[] = []
  myColumnTableAuxiliar: TableColumn[] = [
    { label: 'Número de Pedido', def: 'numOrden', dataKey: 'numOrden' },
    { label: 'Empleado', def: 'empleado', dataKey: 'empleado' },
    { label: 'Laboratorio', def: 'laboratorio', dataKey: 'laboratorio' },
    { label: 'Fecha del Pedido', def: 'fechaPedido', dataKey: 'fechaPedido' },
    { label: 'Descripción', def: 'descripcion', dataKey: 'descripcion' }
  ]

  setTableDataAuxiliar() {
    // this.ordenPedidoListAuxiliar = this.ordenPedidoList.filter(e => e.idEstadoPedido == 2);
    let dataVal = this.ordenPedidoList.filter(e => e.idEstadoPedido == 1)

    this.myDataTableAuxiliar = []
    dataVal.forEach(element => {
      let fechaPedido = this.fechaPedidoList.find(e => e.idFechaPedido === element.idFechaPedido)
      let date: Date = new Date(fechaPedido?.fechaPedido ? fechaPedido.fechaPedido : '')
      let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
      let laboratorio = this.laboratorioList.find(e => e.idLaboratorio == element.idLaboratorio)
      let empleado = this.empleadoList.find(e => e.numEmpleado == element.numEmpleado)

      this.myDataTableAuxiliar.push(
        {
          numOrden: element.numOrden,
          descripcion: element.descripcion,
          fechaPedido: formatoFecha,
          laboratorio: laboratorio?.nombre,
          empleado: empleado?.nombres
        }
      )
    })
  }

  loadConfirmationDataAuxiliar(data: any) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas cambiar el estado del pedido?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateDataList(data)
        // this.formUpdateData.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Ninguna acción de aplico sobre los datos :)',
          'error'
        )
      }
    });
  }

  updateDataList(data: any) {
    let dataVal = this.ordenPedidoList.find(e => e.numOrden == data.numOrden)
    // console.log(dataVal)
    let fecha = this.fechaPedidoList.find(e => e.idFechaPedido == dataVal?.idFechaPedido)
    let date: Date = new Date(fecha?.fechaPedido ? fecha.fechaPedido : '')
    let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
    let empleado = this.empleadoList.find(e => e.numEmpleado == dataVal?.numEmpleado)
    let laboratorio = this.laboratorioList.find(e => e.idLaboratorio == dataVal?.idLaboratorio)

    if (dataVal) {
      this.myDataTableDialog.push({
        numOrden: dataVal?.numOrden,
        empleado: empleado?.nombres,
        laboratorio: laboratorio?.nombre,
        fechaPedido: formatoFecha,
        descripcion: dataVal?.descripcion
      })
    }

    Swal.fire(
      'Exito!',
      'Los cambios que se han realizado se guardaran una ves actualice los datos, si cierra el formulario los datos no se guardaran',
      'success'
    )
    this.cancelDialogResult()
  }

  resultTableUpdateList(data: any) {
    let dataVal = this.ordenPedidoList.find(e => e.numOrden == data.numOrden)

    if (dataVal) {
      this.OrdenPedido = dataVal
    }

    this.cancelDialogResult()
  }

  cancelUpdate() {
    this.dataUpdate = undefined
    this.init()
  }
  cancelDialogResult() {
    this.matDialogRef.close()
  }

  ///////////////////////////////////////////////////////////////////
  // Codigo para agregar informacion

  myDataTableDialogCreate: any[] = [];
  myColumnTableDialogCreate: TableColumn[] = [
    { label: 'Número de Pedido', def: 'numOrden', dataKey: 'numOrden' },
    { label: 'Empleado', def: 'empleado', dataKey: 'empleado' },
    { label: 'Laboratorio', def: 'laboratorio', dataKey: 'laboratorio' },
    { label: 'Fecha del Pedido', def: 'fechaPedido', dataKey: 'fechaPedido' },
    { label: 'Descripción', def: 'descripcion', dataKey: 'descripcion' }
  ];

  formUpdateCreate: FormGroup = this.formBuilder.group(
    {
      'ordenPedido': [this.OrdenPedido, Validators.required],
      'estado': [this.EstadoEntrega, Validators.required],
      'descripcion': [this.Entrega, Validators.required]
    }
  )

  formGetDataCreate(fr: string) {
    return this.formUpdateCreate.get(fr) as FormControl;
  }

  loadDataCreate() {
    this.myDataTableDialogCreate = []
    console.log(this.ordenPedidoList)
    this.ordenPedidoList.forEach(element => {
      if (element.idEstadoPedido === 2) {
        let fecha = this.fechaPedidoList.find(e => e.idFechaPedido == element.idFechaPedido)
        let date: Date = new Date(fecha?.fechaPedido ? fecha.fechaPedido : '')
        let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
        let empleado = this.empleadoList.find(e => e.numEmpleado == element.numEmpleado)
        let laboratorio = this.laboratorioList.find(e => e.idLaboratorio == element.idLaboratorio)

        this.myDataTableDialogCreate.push(
          {
            numOrden: element.numOrden,
            empleado: empleado?.nombres,
            laboratorio: laboratorio?.nombre,
            fechaPedido: formatoFecha,
            descripcion: element.descripcion
          }
        )

      }
    })
    console.log(this.myDataTableDialogCreate)

    let date: Date = new Date()
    let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

    this.Entrega.fechaEntrega = formatoFecha
  }

  getInfoTableDialogCreate(data: any) {
    let ordenPedido = this.ordenPedidoList.find(e => e.numOrden == data.numOrden)
    let laboratorio = this.laboratorioList.find(e => e.idLaboratorio == ordenPedido?.idLaboratorio)
    let empleado = this.empleadoList.find(e => e.numEmpleado == ordenPedido?.numEmpleado)
    let fecha = this.fechaPedidoList.find(e => e.idFechaPedido == ordenPedido?.idFechaPedido)

    if (ordenPedido && laboratorio && empleado && fecha) {
      this.OrdenPedido = ordenPedido
      this.Empleado = empleado
      this.Laboratio = laboratorio

      // let date: Date = new Date(fecha.fechaPedido.toString())
      // let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

      // fecha.fechaPedido = formatoFecha
      this.FechaPedido = fecha

      this.cancelDialogResult()
    }
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


        if(this.OrdenPedido.numOrden == 0 || this.EstadoEntrega.idEstadoEntrega == 0 ){
          Swal.fire(
            'Cancelado',
            'Error al ingresar los datos',
            'error'
          )
        }
        else{
          this.saveDataCreate();
        }

        
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

  saveDataCreate() {

    let entrega = {
      idEstadoEntrega: this.EstadoEntrega.idEstadoEntrega,
      fechaEntrega: new Date(),
      descripcion: this.Entrega.descripcion
    }

    console.log(entrega)

    this.dataService.postData('entrega', entrega).then((success) => {
      if (success) {
        // console.log(success)
        const numeros = this.entregaList.map(objeto => objeto.codEntrega);
        let dataV = Math.max(...numeros) + 1

        console.log(dataV)
        let ordenPedidoEntrega = {
          numOrden: this.OrdenPedido.numOrden,
          codEntrega: dataV
        }
        this.dataService.postData('ordenpedidoentrega', ordenPedidoEntrega).then((success)=>{
          if(success){
            Swal.fire(
              'Exito!',
              'La información ha sido actualizado con exito',
              'success'
            )
            this.resetData();
            EventBtnClick.setMiVariable(true);
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Ups...',
              text: 'Algo salió mal!',
              footer: '<a href="">¿Por qué tengo este problema??</a>'
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
    })
  }

  convertDateFormat(Date: any) {
    if(Date){
      let date: Date = new Date(Date.toString())
      new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date)
      return 
    }
    return
  }

  valDataContent(){
    return this.OrdenPedido.numOrden !== 0? true:false;
  }

  resetData(){
    this.myDataTableDialogCreate = []
    this.myDataTableAuxiliar = []
    this.myDataTableDialog = []
    this.init()

    this.Entrega = {
      codEntrega: 0,
      idEstadoEntrega: 0,
      fechaEntrega: '',
      descripcion: ''
    }
  
    this.EstadoEntrega = {
      idEstadoEntrega: 0,
      estadoEntrega: ''
    }
  
    this.EstadoPedido = {
      idEstadoPedido: 0,
      estadoPedido: ''
    }
  
    this.FechaPedido = {
      idFechaPedido: 0,
      fechaPedido: ''
    }
  
    this.Laboratio = {
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
  
    this.OrdenPedidoEntrega = {
      idOrdenPedido_Entrega: 0,
      numOrden: 0,
      codEntrega: 0
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
  }

  cancelFormUpdate(){
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












}
