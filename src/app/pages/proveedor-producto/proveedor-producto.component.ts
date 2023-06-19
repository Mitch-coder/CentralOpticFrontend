import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { Observable, elementAt, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HeaderData } from 'src/app/header/header-data';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';

import * as moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import Swal from 'sweetalert2';




interface ProveedorProducto {
  idProveedor_Producto: number;
  idProveedor: number;
  codProducto: number;
  idFechaObtencion: number;
  cantidad: number;
  costo: number;
}

interface FechaObtencion {
  idFechaObtencion: number;
  fechaObtencion: string;
}

interface Producto {
  codProducto: number;
  idMarca: number;
  idNombreProducto: number;
  descripcion: string;
  precioActual: number;
  estadoProducto: boolean
}

interface NombreProducto {
  idNombreProducto: number;
  nombreProducto: string;
}

interface Proveedor {
  idProveedor: number;
  nombre: string;
  direccion: string;
  propietario: string;
}

interface Marca {
  idMarca: number;
  marca: string;
}

interface RegistroBodega {
  idRegistro_Bodega: number;
  idBodega: number;
  codProducto: number;
  cantidad: number;
}

interface Bodega {
  idBodega: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
}



interface Data {
  id: number;
  nombreProveedor: string;
  nombreProducto: string;
  descripProducto: string;
  fechaObtencion: Date;
  cantidad: number;
  costo: number;
}

@Component({
  selector: 'app-proveedor-producto',
  templateUrl: './proveedor-producto.component.html',
  styleUrls: ['./proveedor-producto.component.css'],
  providers: []
})
export class ProveedorProductoComponent {
  myData: any[] = [];
  myData$: any;

  tableColumns: TableColumn[] = []

  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
  selectedDate: Date = new Date();
  formattedDate: string = '00 de 00 de 0000'
  // datePattern = /^(0[1-9]|1\d|2\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  maxDate = new Date()

  fechaObtencionList: FechaObtencion[] = []
  productoList: Producto[] = []
  // productoListV: ProductoV[] = []
  proveedorList: Proveedor[] = []
  proveedorProductoList: ProveedorProducto[] = []
  nombreProductoList: NombreProducto[] = []
  marcaList: Marca[] = []
  bodegaList: Bodega[] = []
  registroBodegaList: RegistroBodega[] = []

  selectedValue: string = '';

  Producto: Producto = {
    codProducto: 0,
    idMarca: 0,
    idNombreProducto: 0,
    descripcion: '',
    precioActual: 0,
    estadoProducto: false
  }

  Proveedor: Proveedor = {
    idProveedor: 0,
    nombre: '',
    direccion: '',
    propietario: ''
  }

  ProveedorProducto: ProveedorProducto = {
    idProveedor_Producto: 0,
    idProveedor: 0,
    codProducto: 0,
    idFechaObtencion: 0,
    cantidad: 0,
    costo: 0
  }

  FechaObtencion: FechaObtencion = {
    idFechaObtencion: 0,
    fechaObtencion: ''
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
    direccion: '',
    telefono: '',
    correo: ''
  }

  RegistroBodega: RegistroBodega = {
    idRegistro_Bodega: 0,
    idBodega: 0,
    codProducto: 0,
    cantidad: 0
  }

  filteredOptionsMarca!: Observable<Marca[]>;
  filteredOptionsNombreProducto!: Observable<NombreProducto[]>;



  // ProductoV: ProductoV = {
  //   codProducto: 0,
  //   idMarca: 0,
  //   NombreProducto: '',
  //   descripcion: '',
  //   precioActual: 0,
  //   estadoProducto: false
  // }

  // cantidad: number = 0;
  // costo: number = 0;




  // formCreate: FormGroup = this.formBuilder.group(
  //   {
  //     'proveedor': [this.Proveedor, Validators.required],
  //     'producto': [this.ProductoV, Validators.required],
  //     'fechaObtencion': [this.formattedDate,],
  //     'cantidad': [this.cantidad, Validators.required],
  //     'costo': [this.costo, Validators.required],
  //     'precio': [this.Producto.precioActual]
  //   }
  // );

  dataUpdate: any = undefined
  formUpdate: any;

  inputFormDataPitcker = true;

  form!: FormGroup

  //cliente
  private matDialogRef!: MatDialogRef<DialogComponent>;

  constructor(private dataService: MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    /*private datePipe: DatePipe*/) { }

  ngOnInit(): void {

    this.myData$ = forkJoin(
      this.dataService.getData('proveedorproducto'),
      this.dataService.getData('fechaobtencion'),
      this.dataService.getData('producto'),
      this.dataService.getData('nombreproducto'),
      this.dataService.getData('proveedor'),
      this.dataService.getData('marca'),
      this.dataService.getData('registrobodega'),
      this.dataService.getData('bodega')
    ).pipe(
      map((data: any[]) => {
        this.proveedorProductoList = data[0];
        this.fechaObtencionList = data[1];
        this.productoList = data[2];
        this.nombreProductoList = data[3];
        this.proveedorList = data[4];
        this.marcaList = data[5];
        this.registroBodegaList = data[6];
        this.bodegaList = data[7];
        // this.productoList.forEach(e => {
        //   let name = this.nombreProductoList.filter(f => f.idNombreProducto == e.idNombreProducto)
        //   this.productoListV.push({
        //     codProducto: e.codProducto,
        //     idMarca: e.idMarca,
        //     NombreProducto: name[0].nombreProducto,
        //     descripcion: e.descripcion,
        //     precioActual: e.precioActual,
        //     estadoProducto: e.estadoProducto
        //   })
        // })

        this.myData = this.proveedorProductoList.map((element) => {
          let fecha = this.fechaObtencionList.find(e => e.idFechaObtencion === element.idFechaObtencion)
          let proveedor = this.proveedorList.find(e => e.idProveedor === element.idProveedor)
          let producto = this.productoList.find(e => e.codProducto === element.codProducto)
          let nombreProducto = this.nombreProductoList.find(e => e.idNombreProducto === producto?.idNombreProducto)

          let date: Date = new Date(fecha?.fechaObtencion ? fecha.fechaObtencion : '')
          let formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
          return {
            idProveedor_Producto: element.idProveedor_Producto,
            proveedor: proveedor?.nombre,
            nombreProducto: nombreProducto?.nombreProducto,
            descripcion: producto?.descripcion,
            fechaObtencion: formatoFecha,
            cantidad: element.cantidad,
            costo: element.costo
          }
        })


        // this.proveedorProductoList.forEach(element =>{
        //   let fecha = this.fechaObtencionList.filter(e => e.idFechaObtencion == element.idFechaObtencion);
        //   let product = this.productoList.filter(e => e.codProducto == element.codProducto);
        //   let nameProduct = this.nombreProductoList.filter(e => e.idNombreProducto == product[0].idNombreProducto);
        //   let prov = this.proveedorList.filter(e => e.idProveedor == element.idProveedor);



        //   let date:Date = new Date(fecha[0].fechaObtencion)
        //   const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

        //   this.myData.push(
        //     {
        //       id:element.idProveedor_Producto,
        //       nombreProveedor:prov[0].nombre,
        //       nombreProducto:nameProduct[0].nombreProducto,
        //       descripProducto:product[0].descripcion,
        //       fechaObtencion:formatoFecha,
        //       cantidad:element.cantidad,
        //       costo:element.costo
        //     }
        //   )
        // })
        return this.myData
      })
    )

    this.setTableColumns();
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'ID', def: 'idProveedor_Producto', dataKey: 'idProveedor_Producto' },
      { label: 'Proveedor', def: 'proveedor', dataKey: 'proveedor' },
      { label: 'Nombre Producto', def: 'nombreProducto', dataKey: 'nombreProducto' },
      { label: 'Descripción del Producto', def: 'descripcion', dataKey: 'descripcion' },
      { label: 'Fecha Obtención', def: 'fechaObtencion', dataKey: 'fechaObtencion' },
      { label: 'Cantidad', def: 'cantidad', dataKey: 'cantidad' },
      { label: 'Costo', def: 'costo', dataKey: 'costo' }
    ]
  }

  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick) {
      if (this.tableDataProducto.length <= 0) {
        this.loadDataCreate()
      }
      this.dataUpdate = undefined
    }
    // this.inputFormDataPitcker = HeaderData.eventBtnClick
    return HeaderData.eventBtnClick;
  }


  formCreateData: FormGroup = this.formBuilder.group(
    {
      'proveedor': [this.Proveedor.nombre, Validators.required],
      'producto': [this.NombreProducto.nombreProducto, Validators.required],
      'bodega': [this.Bodega.nombre, Validators.required],
      'fechaObtencion': [this.FechaObtencion.fechaObtencion, Validators.required],
      'cantidad': [this.ProveedorProducto.cantidad, Validators.required],
      'costo': [this.ProveedorProducto.costo, Validators.required],
      'precio': [this.Producto.precioActual, Validators.nullValidator]
    }
  );

  formGetDataCreate(fr: string) {
    return this.formCreateData.get(fr) as FormControl;
  }

  loadDataCreate() {
    this.setFormatDataProducto()
    let date: Date = new Date()
    let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
    this.FechaObtencion.fechaObtencion = formatoFecha
  }

  tableColumnsProducto = [
    { label: 'Codigo Producto', def: 'codProducto', dataKey: 'codProducto' },
    { label: 'Marca', def: 'marca', dataKey: 'marca' },
    { label: 'Nombre', def: 'Nombre', dataKey: 'nombre' },
    { label: 'Descripcion', def: 'Descripcion', dataKey: 'descripcion' },
    { label: 'Precio Actual', def: 'precioActual', dataKey: 'precioActual' },
    { label: 'Estado Producto', def: 'estadoProducto', dataKey: 'estadoProducto' }
  ]

  tableDataProducto: any[] = []

  setFormatDataProducto() {
    this.tableDataProducto = this.productoList.map((element) => {
      let marca = this.marcaList.find(e => e.idMarca === element.idMarca)
      let nombre = this.nombreProductoList.find(e => e.idNombreProducto === element.idNombreProducto)

      return {
        codProducto: element.codProducto,
        marca: marca?.marca,
        nombre: nombre?.nombreProducto,
        descripcion: element.descripcion,
        precioActual: element.precioActual,
        estadoProducto: element.estadoProducto
      }
    })
  }

  resultTableDataProducto(data: any) {
    if (data) {
      let producto = this.productoList.find(e => e.codProducto == data.codProducto)
      if (producto) {
        this.Producto = producto
      }
      this.cancelDialogResult()
    }
  }

  tableColumnsProveedor = [
    { label: 'IdProveedor', def: 'idProveedor', dataKey: 'idProveedor' },
    { label: 'Nombre', def: 'nombre', dataKey: 'nombre' },
    { label: 'Propietario', def: 'propietario', dataKey: 'propietario' },
    { label: 'Direccion', def: 'direccion', dataKey: 'direccion' }
  ]

  resultTableDataProveedor(data: any) {
    if (data) {
      this.Proveedor = data
      this.cancelDialogResult()
    }
  }

  formColumnsTableBodega = [
    { label: 'IdBodega', def: 'idBodega', dataKey: 'idBodega' },
    { label: 'Nombre', def: 'nombre', dataKey: 'nombre' },
    { label: 'Direccion', def: 'direccion', dataKey: 'direccion' },
    { label: 'Telefono', def: 'telefono', dataKey: 'telefono' },
    { label: 'Correo', def: 'correo', dataKey: 'correo' }
  ]

  getDataTableBodega(data: any) {
    this.Bodega = data
    this.cancelDialogResult()
  }

  loadConfirmationDataCreate() {

    if (!this.Producto.estadoProducto) {
      Swal.fire({
        title: 'Confirmar',
        text: '¿Está seguro que desea guardar la informacion?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // this.saveDataUpdate(form.value)
          // form.reset()
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelado',
            'Los datos siguen asalvo:)',
            'error'
          )
        }
      });
    } else {
      Swal.fire({
        title: 'Confirmar',
        text: '¿El producto esta inactivo, seguro que desea registrar mas productos?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'registrar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.saveDataCreate()
          // form.reset()
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

  saveDataCreate() {
    let proveedorProducto = this.proveedorProductoList.find(e => e.codProducto === this.Producto.codProducto &&
      e.idProveedor === this.Proveedor.idProveedor)


    let fecha = new Date();
    fecha.setHours(0, 0, 0, 0)
    let fechaV = this.fechaObtencionList.find(e => new Date(e.fechaObtencion).toString() == fecha.toString())

    let F = -1
    if (!fechaV) {
      let fe = {
        fechaObtencion: fecha
      }
      this.dataService.postData('fechaobtencion', fe).then((success) => {
        if (success) {
          const numeros = this.fechaObtencionList.map(objeto => objeto.idFechaObtencion);
          F = Math.max(...numeros) + 1

          let pp = {
            idProveedor: this.Proveedor.idProveedor,
            codProducto: this.Producto.codProducto,
            idFechaObtencion: F,
            cantidad: this.ProveedorProducto.cantidad,
            costo: this.ProveedorProducto.costo
          }
          this.dataService.postData('proveedorproducto', pp).then((success) => {
            if (success) {
              Swal.fire({
                title: 'Exito!',
                text: 'La informacion a sido guardada',
                icon: 'success',
                confirmButtonText: 'OK!',
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
          Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'Algo salió mal!',
            footer: '<a href="">¿Por qué tengo este problema??</a>'
          })
        }
      })
    } else {
      F = fechaV.idFechaObtencion
      let pp = {
        idProveedor: this.Proveedor.idProveedor,
        codProducto: this.Producto.codProducto,
        idFechaObtencion: F,
        cantidad: this.ProveedorProducto.cantidad,
        costo: this.ProveedorProducto.costo
      }
      this.dataService.postData('proveedorproducto', pp).then((success) => {
        if (success) {
          Swal.fire({
            title: 'Exito!',
            text: 'La informacion a sido guardada',
            icon: 'success',
            confirmButtonText: 'OK!',
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
    }

    let registroBodega = this.registroBodegaList.find(e => e.idBodega === this.Bodega.idBodega && e.codProducto === this.Producto.codProducto)
    if (registroBodega) {
      let rb: RegistroBodega = {
        idBodega: this.Bodega.idBodega,
        codProducto: this.Producto.codProducto,
        cantidad: this.ProveedorProducto.cantidad + registroBodega.cantidad,
        idRegistro_Bodega: registroBodega.idRegistro_Bodega
      }
      this.dataService.updateData('registrobodega', rb, registroBodega.idRegistro_Bodega).then((success) => {
        if (success) {
          Swal.fire({
            title: 'Exito!',
            text: 'La informacion a sido guardada',
            icon: 'success',
            confirmButtonText: 'OK!',
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
      let rb = {
        idBodega: this.Bodega.idBodega,
        codProducto: this.Producto.codProducto,
        cantidad: this.ProveedorProducto.cantidad
      }
      this.dataService.postData('registrobodega', rb).then((success) => {
        if (success) {
          Swal.fire({
            title: 'Exito!',
            text: 'La informacion a sido guardada',
            icon: 'success',
            confirmButtonText: 'OK!',
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
    }

    let producto = this.productoList.find(e => e.codProducto == this.Producto.codProducto)
    if (producto) {
      if (producto.precioActual !== this.Producto.precioActual) {
        this.Producto.precioActual = producto.precioActual
        this.dataService.updateData('producto', this.Producto, this.Producto.codProducto).then((success) => {
          if (success) {
            Swal.fire({
              title: 'Exito!',
              text: 'La informacion a sido guardada',
              icon: 'success',
              confirmButtonText: 'OK!',
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
      }
    }

  }

  resetData() {
    this.tableDataProducto = []
    this.Producto = {
      codProducto: 0,
      idMarca: 0,
      idNombreProducto: 0,
      descripcion: '',
      precioActual: 0,
      estadoProducto: false
    }

    this.Proveedor = {
      idProveedor: 0,
      nombre: '',
      direccion: '',
      propietario: ''
    }

    this.ProveedorProducto = {
      idProveedor_Producto: 0,
      idProveedor: 0,
      codProducto: 0,
      idFechaObtencion: 0,
      cantidad: 0,
      costo: 0
    }

    this.FechaObtencion = {
      idFechaObtencion: 0,
      fechaObtencion: ''
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
      direccion: '',
      telefono: '',
      correo: ''
    }

    this.RegistroBodega = {
      idRegistro_Bodega: 0,
      idBodega: 0,
      codProducto: 0,
      cantidad: 0
    }

    this.dataUpdate = undefined
  }

  openDialogWithTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });

    this.matDialogRef.afterClosed().subscribe((res) => {
    });
  }

  cancelDialogResult() {
    this.matDialogRef.close()
  }

  formDataUpdate: FormData[] = []

  resultUpdateData(data: any) {
    this.dataUpdate = data
    if (data) {
      let proveedorProducto = this.proveedorProductoList.find(e => e.idProveedor_Producto === data.idProveedor_Producto)
      if (proveedorProducto) {
        this.ProveedorProducto = proveedorProducto
        this.formDataUpdate = [{
          label: 'Cantidad de producto',
          type: 'number',
          placeholder: 'Nueva Cantidad de productos',
          alert: 'La cantidad no puede estar vacia',
          icon: 'fa-solid fa-arrow-up-short-wide',
          formControlName: 'cantidad',
          formValidators: { 'cantidad': [proveedorProducto.cantidad.toString(), [Validators.required]] },
          value: proveedorProducto.cantidad.toString()
        },
        {
          label: 'Costo del producto',
          type: 'number',
          placeholder: 'Nuevo costo de productos',
          alert: 'El costo no puede estar vacio',
          icon: 'fa-solid fa-circle-dollar-to-slot',
          formControlName: 'costo',
          formValidators: { 'costo': [proveedorProducto.costo.toString(), [Validators.required]] },
          value: proveedorProducto.costo.toString()
        }]
      }
    }
  }

  cancelFormUpdate() {
    this.dataUpdate = undefined
  }

  loadConfirmationDataUpdate(form: FormGroup) {
    let data = form.value

    if (data.cantidad < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Ups...',
        text: 'La cantidad del producto no puede ser negativa!'
      })
    } else if (data.costo < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Ups...',
        text: 'La cantidad del producto no puede ser negativa!'
      })
    } else {
      let registroProducto = this.registroBodegaList
        .find(e=>e.codProducto === this.ProveedorProducto.codProducto)
      if(registroProducto){
        
      }
      Swal.fire({
        title: 'Confirmar',
        text: '¿Está seguro que desea guardar la informacion?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // this.saveDataUpdate(form.value)
          // form.reset()
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
}
