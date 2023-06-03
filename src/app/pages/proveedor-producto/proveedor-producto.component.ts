import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { elementAt, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HeaderData } from 'src/app/header/header-data';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';

import * as moment from 'moment';
import {default as _rollupMoment} from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_NATIVE_DATE_FORMATS, MatDateFormats } from '@angular/material/core';




interface ProveedorProducto{
  idProveedor_Producto:number;
  idProveedor:number;
  codProducto:number;
  idFechaObtencion:number;
  cantidad:number;
  costo:number;
}

interface FechaObtencion{
  idFechaObtencion:number;
  fechaObtencion:string;
}

interface Producto{
  codProducto:number;
  idMarca:number;
  idNombreProducto:number;
  descripcion:string;
  precioActual:number;
  estadoProducto:boolean
}

interface ProductoV{
  codProducto:number;
  idMarca:number;
  NombreProducto:string;
  descripcion:string;
  precioActual:number;
  estadoProducto:boolean;
}

interface NombreProducto{
  idNombreProducto:number;
  nombreProducto:string;
}

interface Proveedor{
  idProveedor:number;
  nombre:string;
  direccion:string;
  propietario:string;
}

interface Data{
  id:number;
  nombreProveedor:string;
  nombreProducto:string;
  descripProducto:string;
  fechaObtencion:Date;
  cantidad:number;
  costo:number;
}


// id:element.idProveedor_Producto,
// nombreProveedor:prov[0].nombre,
// nombreProducto:nameProduct[0].nombreProducto,
// descripProducto:product[0].descripcion,
// fechaObtencion:formatoFecha,
// cantidad:element.cantidad,
// costo:element.costo
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
  maxDate= new Date()

  fechaObtencionList: FechaObtencion[] = []
  productoList: Producto[] = []
  productoListV: ProductoV[] = []
  proveedorList: Proveedor[] = []
  proveedorProductoList:ProveedorProducto[] = []
  nombreProductoList:NombreProducto[] = []

  selectedValue: string = '';

  Producto: Producto = {
    codProducto: 0,
    idMarca: 0,
    idNombreProducto: 0,
    descripcion: '',
    precioActual: 0,
    estadoProducto: false
  }

  Proveedor:Proveedor ={
    idProveedor: 0,
    nombre: '',
    direccion: '',
    propietario: ''
  }

  ProductoV: ProductoV = {
    codProducto: 0,
    idMarca: 0,
    NombreProducto: '',
    descripcion: '',
    precioActual: 0,
    estadoProducto: false
  }

  cantidad:number = 0;
  costo:number = 0;

  


  formCreate: FormGroup= this.formBuilder.group(
    {
      'proveedor': [this.Proveedor, Validators.required],
      'producto': [this.ProductoV, Validators.required],
      'fechaObtencion': [this.formattedDate, ],
      'cantidad': [this.cantidad, Validators.required],
      'costo': [this.costo, Validators.required]
    }
  );

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

  ngOnInit(): void{

    this.myData$ =forkJoin(
      this.dataService.getData('proveedorproducto'),
      this.dataService.getData('fechaobtencion'),
      this.dataService.getData('producto'),
      this.dataService.getData('nombreproducto'),
      this.dataService.getData('proveedor'),
    ).pipe(
      map((data:any[])=>{
        this.proveedorProductoList = data[0];
        this.fechaObtencionList = data[1];
        this.productoList = data[2];
        this.nombreProductoList = data[3];
        this.proveedorList = data[4];

        this.productoList.forEach(e => {
          let name = this.nombreProductoList.filter(f => f.idNombreProducto == e.idNombreProducto)
          this.productoListV.push({
            codProducto: e.codProducto,
            idMarca: e.idMarca,
            NombreProducto: name[0].nombreProducto,
            descripcion: e.descripcion,
            precioActual: e.precioActual,
            estadoProducto: e.estadoProducto
          })
        })

        
        this.proveedorProductoList.forEach(element =>{
          let fecha = this.fechaObtencionList.filter(e => e.idFechaObtencion == element.idFechaObtencion);
          let product = this.productoList.filter(e => e.codProducto == element.codProducto);
          let nameProduct = this.nombreProductoList.filter(e => e.idNombreProducto == product[0].idNombreProducto);
          let prov = this.proveedorList.filter(e => e.idProveedor == element.idProveedor);


 
          let date:Date = new Date(fecha[0].fechaObtencion)
          const formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);

          this.myData.push(
            {
              id:element.idProveedor_Producto,
              nombreProveedor:prov[0].nombre,
              nombreProducto:nameProduct[0].nombreProducto,
              descripProducto:product[0].descripcion,
              fechaObtencion:formatoFecha,
              cantidad:element.cantidad,
              costo:element.costo
            }
          )
        })
        return this.myData
      })
    )

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'ID', def:'id', dataKey:'id'},
      {label:'Nombre Proveedor', def:'nombreProveedor', dataKey:'nombreProveedor'},
      {label:'Nombre Producto', def:'nombreProducto', dataKey:'nombreProducto'},
      {label:'Descripción Producto', def:'descripProducto', dataKey:'descripProducto'},
      {label:'Fecha Obtención', def:'fechaObtencion', dataKey:'fechaObtencion'},
      {label:'Cantidad', def:'cantidad', dataKey:'cantidad'},
      {label:'Costo', def:'costo', dataKey:'costo'}
    ]
  }

  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick){
      this.dataUpdate = undefined
      // this.Cliente = {
      //   codCliente: 0,
      //   cedula: '',
      //   nombres: '',
      //   apellidos: '',
      //   direccion: ''
      // }

      // this.Proveedor={
      //   idProveedor: 0,
      //   nombre: '',
      //   direccion: '',
      //   propietario: ''
      // }
    
      // this.ProductoV = {
      //   codProducto: 0,
      //   idMarca: 0,
      //   NombreProducto: '',
      //   descripcion: '',
      //   precioActual: 0,
      //   estadoProducto: false
      // }
      // this.formCreate = this.formBuilder.group(
      //   {
      //     'proveedor': ['', Validators.required],
      //     'producto': ['', Validators.required],
      //     'fechaObtencion': ['', ],
      //     'cantidad': ['', Validators.required],
      //     'costo': ['', Validators.required]
      //   }
      // );
      this.formattedDate = new Intl.DateTimeFormat('es', this.opcionesFormato).format(new Date());
      this.cantidad = 0;
      this.costo = 0;        
    }
    this.inputFormDataPitcker = HeaderData.eventBtnClick
    return HeaderData.eventBtnClick;
  }

  setFormUpdate(data: Data | undefined) {
    this.dataUpdate = data
    if (data) {
      let f = data.fechaObtencion
      let p = this.proveedorProductoList.filter(e => e.idProveedor_Producto == data.id)
      let pr = this.productoListV.filter(e => e.codProducto == p[0].codProducto)
      let proveedor = this.proveedorList.filter(e => e.idProveedor == p[0].idProveedor)
      // let c = this.productoList.filter(f => data. == f.nombres)
      // this.Cliente=c[0]
      this.formattedDate = data.fechaObtencion.toString()
      this.ProductoV = pr[0]
      this.Proveedor = proveedor[0]
      // this.formattedDate = data.fechaObtencion.toString()
      this.cantidad = data.cantidad;
      this.costo = data.costo;
      
    }
  }

  formGet(fr: string) {
    return this.formCreate.get(fr) as FormControl;
  }

  onDateSelected(event: any) {}
}
