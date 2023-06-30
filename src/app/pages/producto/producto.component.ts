import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { Observable, elementAt, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { EventBtnClick, HeaderData } from 'src/app/header/header-data';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';
import Swal from 'sweetalert2';
import { startWith } from 'rxjs/operators';

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

interface EstadoProducto {
  value: string;
  icon: string
}

interface Proveedor {
  idProveedor: number;
  nombre: string;
  propietario: string;
  direccion: string;
}

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

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {
  myData: any[] = [];
  myData$: any;
  dataUpdate: any = undefined;

  private matDialogRef!: MatDialogRef<DialogComponent>;


  // form!: FormGroup;

  // formMarcas:FormData[] = [
  // {
  //   label:'Nombre de la Marca',
  //   type:'text',
  //   placeholder:'Ingrese la nueva Marca del producto',
  //   alert:'La Marca es obligatorio',
  //   icon:'',
  //   formControlName:'marca',
  //   formValidators:{'marca':['',[Validators.required]]}
  // }]


  // formProducto:FormData[]=[{
  //   label:'Nombre del producto',
  //   type:'text',
  //   placeholder:'Ingrese el nombre del producto',
  //   alert:'El nombre es obligatorio',
  //   icon:'fa-solid fa-pencil',
  //   formControlName:'nombre',
  //   formValidators:{'nombre':['',[Validators.required]]}
  // },
  // {
  //   label:'Proveedor',
  //   type:'select',
  //   placeholder:'',
  //   alert:'El proveedor es obligatorio',
  //   icon:'',
  //   formControlName:'proveedor',
  //   formValidators:{'proveedor':['',[Validators.required]]},
  //   option:this.proveedorSelect
  // },
  // {
  //   label:'Marcas',
  //   type:'select',
  //   placeholder:'',
  //   alert:'La marca es obligatorio',
  //   icon:'',
  //   formControlName:'marca',
  //   formValidators:{'marca':['',[Validators.required]]},
  //   option:this.marcaSelect
  // },
  // {
  //   label:'Cantidad',
  //   type:'number',
  //   placeholder:'Ingrese la cantidad de productos',
  //   alert:'La Cantidad de productos es obligatoria',
  //   icon:'fa-solid fa-arrow-up-9-1',
  //   formControlName:'cantidad',
  //   formValidators:{'cantidad':['',[Validators.required]]}
  // },
  // {
  //   label:'Precio',
  //   type:'number',
  //   placeholder:'Ingrese el precio de los productos',
  //   alert:'El precio de los productos es obligatoria',
  //   icon:'fa-solid fa-coins',
  //   formControlName:'precio',
  //   formValidators:{'precio':['',[Validators.required]]}
  // },
  // {
  //   label:'Estado del producto',
  //   type:'select',
  //   placeholder:'',
  //   alert:'el estado producto es obligatorio',
  //   icon:'',
  //   formControlName:'estadoProducto',
  //   formValidators:{'estadoProducto':['Activo',[Validators.required]]},
  //   option:['Activo', 'Inactivo']
  // }]

  // formProductoUpdate:FormData[] = []
  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
  tableColumns: TableColumn[] = []

  productoList: Producto[] = []
  nombreProductoList: NombreProducto[] = []
  marcaList: Marca[] = []
  proveedorList: Proveedor[] = []
  proveedorProductoList: ProveedorProducto[] = []
  fechaObtencionList: FechaObtencion[] = []
  bodegaList: Bodega[] = []
  registroBodegaList: RegistroBodega[] = []

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

  ProveedorProducto: ProveedorProducto = {
    idProveedor_Producto: 0,
    idProveedor: 0,
    codProducto: 0,
    idFechaObtencion: 0,
    cantidad: 0,
    costo: 0
  }

  Proveedor: Proveedor = {
    idProveedor: 0,
    nombre: '',
    propietario: '',
    direccion: ''
  }

  FechaObtencion: FechaObtencion = {
    idFechaObtencion: 0,
    fechaObtencion: ''
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

  filteredOptionsMarca!: Observable<Marca[]>;
  filteredOptionsNombreProducto!: Observable<NombreProducto[]>;


  constructor(private dataService: MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService) { }

  ngOnInit(): void {


    this.filteredOptionsMarca = (this.formCreateData.get('marca') as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.filteredOptionsNombreProducto = (this.formCreateData.get('nombreProducto') as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => this._filterNombreProducto(value || '')),
    );

    this.myData$ = forkJoin(
      this.dataService.getData('producto'),
      this.dataService.getData('nombreProducto'),
      this.dataService.getData('marca'),
      this.dataService.getData('proveedor'),
      this.dataService.getData('proveedorproducto'),
      this.dataService.getData('fechaobtencion'),
      this.dataService.getData('bodega'),
      this.dataService.getData('registrobodega'),
    ).pipe(
      map((data: any[]) => {
        this.productoList = data[0]
        this.nombreProductoList = data[1]
        this.marcaList = data[2]
        this.proveedorList = data[3]
        this.proveedorProductoList = data[4]
        this.fechaObtencionList = data[5]
        this.bodegaList = data[6]
        this.registroBodegaList = data[7]
        this.myData = this.productoList.map((element) => {
          let nombreProducto = this.nombreProductoList.find(e => e.idNombreProducto == e.idNombreProducto)
          let marca = this.marcaList.find(e => e.idMarca == element.idMarca)
          // console.log(element)
          return {
            codProducto: element.codProducto,
            marca: marca?.marca,
            nombre: nombreProducto?.nombreProducto,
            descripcion: element.descripcion,
            precioActual: element.precioActual,
            estadoProducto: element.estadoProducto ? 'Activo' : 'Inactivo'
          }
        })
        return this.myData
      })
    )

    this.setTableColumns();
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Código del Producto', def: 'codProducto', dataKey: 'codProducto' },
      { label: 'Marca', def: 'marca', dataKey: 'marca' },
      { label: 'Nombre', def: 'Nombre', dataKey: 'nombre' },
      { label: 'Descripción', def: 'Descripcion', dataKey: 'descripcion' },
      { label: 'Precio Actual', def: 'precioActual', dataKey: 'precioActual' },
      { label: 'Estado del Producto', def: 'estadoProducto', dataKey: 'estadoProducto' }
    ]
  }

  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick) {
      this.dataUpdate = undefined
      if (this.Bodega.idBodega == 0) {
        this.loadDataCreate()
      }
    }
    return HeaderData.eventBtnClick;
  }

  // proveedor, bodega, nombre, marca, descripcion, precio, cantidad, fecha actual, 

  formCreateData: FormGroup = this.formBuilder.group(
    {
      'proveedor': [this.Proveedor, Validators.required],
      'bodega': [this.Bodega, Validators.required],
      'nombreProducto': [this.NombreProducto.nombreProducto, Validators.required],
      'marca': [this.Marca.marca, Validators.required],
      'descripcion': [this.Producto.descripcion, Validators.required],
      'precio': [this.Producto.precioActual, Validators.required],
      'cantidad': [this.ProveedorProducto.cantidad, Validators.required],
      'costo': [this.ProveedorProducto.costo, Validators.required],
      'fechaObtencion': [this.FechaObtencion.fechaObtencion, Validators.required]
    }
  )

  private _filter(value: string): Marca[] {
    const filterValue = value.toLowerCase();

    return this.marcaList.filter(option => option.marca.toLowerCase().includes(filterValue));
  }

  private _filterNombreProducto(value: string): NombreProducto[] {
    const filterValue = value.toLowerCase();

    return this.nombreProductoList.filter(option => option.nombreProducto.toLowerCase().includes(filterValue));
  }

  formGetDataCreate(fr: string) {
    return this.formCreateData.get(fr) as FormControl;
  }

  loadDataCreate() {
    let date: Date = new Date()
    let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
    this.FechaObtencion.fechaObtencion = formatoFecha

    this.Bodega = this.bodegaList[0]
  }

  formColumnsTableBodega = [
    { label: 'Número de Bodega', def: 'idBodega', dataKey: 'idBodega' },
    { label: 'Nombre', def: 'nombre', dataKey: 'nombre' },
    { label: 'Dirección', def: 'direccion', dataKey: 'direccion' },
    { label: 'Teléfono', def: 'telefono', dataKey: 'telefono' },
    { label: 'Correo', def: 'correo', dataKey: 'correo' }
  ]

  getDataTableBodega(data: any) {
    this.Bodega = data
    this.cancelDialogResult()
  }

  formColumnsTableProveedor = [
    { label: 'Código de Proovedor', def: 'idProveedor', dataKey: 'idProveedor' },
    { label: 'Nombre', def: 'Nombre', dataKey: 'nombre' },
    { label: 'Propietario', def: 'propietario', dataKey: 'propietario' },
    { label: 'Dirección', def: 'direccion', dataKey: 'direccion' }
  ]

  getDataTableProveedor(data: any) {
    this.Proveedor = data
    this.cancelDialogResult()
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

  loadConfirmationDataCreate() {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea guardar la información?',
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
    let marca = this.marcaList.find(e => e.marca == this.Marca.marca)
    let nombreProducto = this.nombreProductoList.find(e => e.nombreProducto == this.NombreProducto.nombreProducto)

    let M = -1

    if (!marca) {
      let marcaV = {
        marca: this.Marca.marca
      }
      this.dataService.postData('marca', marcaV).then((success) => {
        if (success) {
          const numeros = this.marcaList.map(objeto => objeto.idMarca);
          M = Math.max(...numeros) + 1
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'Algo salió mal!',
            footer: '<a href="">¿Por qué tengo este problema??</a>'
          })
          return
        }
      })
    }

    let N = -1
    if (!nombreProducto) {
      let nombreProductoV = {
        nombreProducto: ''
      }
      this.dataService.postData('nombrepedido', nombreProductoV).then((success) => {
        if (success) {
          const numeros = this.nombreProductoList.map(objeto => objeto.idNombreProducto);
          N = Math.max(...numeros) + 1
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'Algo salió mal!',
            footer: '<a href="">¿Por qué tengo este problema??</a>'
          })
          return
        }
      })
    }

    let producto = {
      idMarca: M == -1 ? marca?.idMarca : M,
      idNombreProducto: N == -1 ? nombreProducto?.idNombreProducto : N,
      descripcion: this.Producto.descripcion,
      precioActual: this.Producto.precioActual,
      estadoProducto: true
    }
    let P = -1
    this.dataService.postData('producto', producto).then((success) => {
      if (success) {
        const numeros = this.productoList.map(objeto => objeto.codProducto);
        P = Math.max(...numeros) + 1

        let fecha1 = new Date();
        fecha1.setHours(0, 0, 0, 0)
        let fechaObtencion = this.fechaObtencionList.find(e => new Date(e.fechaObtencion).toString() == fecha1.toString())

        let F = -1
        if (!fechaObtencion) {
          let fecha = {
            fechaObtencion: fecha1
          }

          // console.log(fecha)
          this.dataService.postData('fechaobtencion', fecha).then((success) => {
            if (success) {
              const numeros = this.fechaObtencionList.map(objeto => objeto.idFechaObtencion);
              F = Math.max(...numeros) + 1
              
              console.log(F);
              console.log(fechaObtencion);

              let proveedorProducto = {
                idProveedor: this.Proveedor.idProveedor,
                codProducto: P,
                idFechaObtencion: F == -1 ? fechaObtencion?.idFechaObtencion : F,
                cantidad: this.ProveedorProducto.cantidad,
                costo: this.ProveedorProducto.costo
              }
  
              console.log(proveedorProducto)
      
              this.dataService.postData('proveedorproducto', proveedorProducto).then((success) => {
                if (success) {
                  // const numeros = this.fechaObtencionList.map(objeto => objeto.idFechaObtencion);
                  // Math.max(...numeros) + 1
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Ups...',
                    text: 'Algo salió mal!',
                    // footer: '<a href="">¿Por qué tengo este problema??</a>'
                  })
                  return
                }
              })
      
              let registroBodega = {
                idBodega: this.Bodega.idBodega,
                codProducto: P,
                cantidad: this.ProveedorProducto.cantidad
              }
      
              console.log(registroBodega)
      
              this.dataService.postData('registrobodega', registroBodega).then((success) => {
                if (success) {
                  Swal.fire(
                    'Exito!',
                    'La informacion a sido actualizado con exito',
                    'success'
                  )
                  this.resetData();
                  EventBtnClick.setMiVariable(true);
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Ups...',
                    text: 'Algo salió mal!',
                    // footer: '<a href="">¿Por qué tengo este problema??</a>'
                  })
                  return
                }
              })
              
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Ups...',
                text: 'Algo salió mal!',
                // footer: '<a href="">¿Por qué tengo este problema??</a>'
              })
              return
            }
          })
        } else {

          let proveedorProducto = {
            idProveedor: this.Proveedor.idProveedor,
            codProducto: P,
            idFechaObtencion: F == -1 ? fechaObtencion?.idFechaObtencion : F,
            cantidad: this.ProveedorProducto.cantidad,
            costo: this.ProveedorProducto.costo
          }
  
          console.log(proveedorProducto)
  
          this.dataService.postData('proveedorproducto', proveedorProducto).then((success) => {
            if (success) {
              // const numeros = this.fechaObtencionList.map(objeto => objeto.idFechaObtencion);
              // Math.max(...numeros) + 1
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Ups...',
                text: 'Algo salió mal!',
                // footer: '<a href="">¿Por qué tengo este problema??</a>'
              })
              return
            }
          })
  
          let registroBodega = {
            idBodega: this.Bodega.idBodega,
            codProducto: P,
            cantidad: this.ProveedorProducto.cantidad
          }
  
          console.log(registroBodega)
  
          this.dataService.postData('registrobodega', registroBodega).then((success) => {
            if (success) {
              Swal.fire(
                'Exito!',
                'La informacion a sido actualizado con exito',
                'success'
              )
              this.resetData();
              HeaderData.eventBtnClick = true
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Ups...',
                text: 'Algo salió mal!',
                // footer: '<a href="">¿Por qué tengo este problema??</a>'
              })
              return
            }
          })

        }

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ups...',
          text: 'Algo salió mal!',
          // footer: '<a href="">¿Por qué tengo este problema??</a>'
        })
        return
      }
    })


  }

  formUpdateData: FormGroup = this.formBuilder.group(
    {
      'nombreProducto': [this.NombreProducto.nombreProducto, Validators.required],
      'marca': [this.Marca.marca, Validators.required],
      'descripcion': [this.Producto.descripcion, Validators.required],
      'precio': [this.Producto.precioActual, Validators.required],
      'estado': [this.Producto.estadoProducto, Validators.required]
    }
  )

  formGetDataUpdate(fr: string) {
    return this.formUpdateData.get(fr) as FormControl;
  }

  estado: any[] = [
    {
      valor: false,
      label: 'Inactivo'
    },
    {
      valor: true,
      label: 'Activo'
    }]

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

  getDataUpdate(data: any) {
    // console.log(data)
    this.dataUpdate = data
    if (data) {
      let producto = this.productoList.find(e => e.codProducto == data.codProducto)
      let nombreProducto = this.nombreProductoList.find(e => e.idNombreProducto == producto?.idNombreProducto)
      let marca = this.marcaList.find(e => e.idMarca == producto?.idMarca)

      console.log(producto)
      // console.log(nombreProducto)
      // console.log(marca)
      if (producto && nombreProducto && marca) {
        this.Producto = producto
        this.NombreProducto = nombreProducto
        this.Marca = marca
      }
    }
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

    let marca = this.marcaList.find(e => e.marca == this.Marca.marca)
    let nombreProducto = this.nombreProductoList.find(e => e.nombreProducto == this.NombreProducto.nombreProducto)

    let M = -1

    if (!marca) {
      let marcaV = {
        marca: this.Marca.marca
      }
      this.dataService.postData('marca', marcaV).then((success) => {
        if (success) {
          const numeros = this.marcaList.map(objeto => objeto.idMarca);
          M = Math.max(...numeros) + 1
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'Algo salió mal!',
            //footer: '<a href="">¿Por qué tengo este problema??</a>'
          })
          return
        }
      })
    }

    let N = -1
    if (!nombreProducto) {
      let nombreProductoV = {
        nombreProducto: ''
      }
      this.dataService.postData('nombrepedido', nombreProductoV).then((success) => {
        if (success) {
          const numeros = this.nombreProductoList.map(objeto => objeto.idNombreProducto);
          N = Math.max(...numeros) + 1
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'Algo salió mal!',
            //footer: '<a href="">¿Por qué tengo este problema??</a>'
          })
          return
        }
      })
    }

    let producto = {
      codProducto: this.Producto.codProducto,
      idMarca: M == -1 ? this.Marca.idMarca : M,
      idNombreProducto: N == -1 ? this.NombreProducto.idNombreProducto : N,
      descripcion: this.Producto.descripcion,
      precioActual: this.Producto.precioActual,
      estadoProducto: this.Producto.estadoProducto
    }

    console.log(producto)

    this.dataService.updateData('producto', producto, this.Producto.codProducto).then((success) => {
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
          //footer: '<a href="">¿Por qué tengo este problema??</a>'
        })
      }
    })
  }


  resetData() {

    this.dataUpdate = undefined
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

    this.ProveedorProducto = {
      idProveedor_Producto: 0,
      idProveedor: 0,
      codProducto: 0,
      idFechaObtencion: 0,
      cantidad: 0,
      costo: 0
    }

    this.Proveedor = {
      idProveedor: 0,
      nombre: '',
      propietario: '',
      direccion: ''
    }

    this.FechaObtencion = {
      idFechaObtencion: 0,
      fechaObtencion: ''
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
  }



}