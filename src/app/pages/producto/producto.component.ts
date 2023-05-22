import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { HeaderData } from 'src/app/header/header-data';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormData } from 'src/app/modules/form/components/form/form-data';

interface Product{
  codProducto:number;
  idMarca:number;
  idNombreProducto:number;
  descripcion:string;
  precioActual:number;
  estadoProducto:boolean
}

interface Marca{
  idMarca:number;
  marca:string;
}

interface NombreProducto{
  idNombreProducto:number;
  nombreProducto:string;
}

interface Data{
  codProducto:number;
  marca:string;
  nombre:string;
  descripcion:string;
  precioActual:number;
  estadoProducto:string;
}



@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {
  myData: any[] = [];
  myData$:any;
  dataUpdate:any = undefined;


  // formulario actualizar
  Marcas:Marca[] = []
  NombresProductos: NombreProducto[] = []
  EstadoProducto: string[] = [ 'Activo' , 'Inactivo' ]

  marca:string = ''
  nombreProducto:string = ''
  estadoProducto:string = ''
  precioActual:number = 0


  form!: FormGroup;
  
  formProducto:FormData[]=[{
    label:'Cedula',
    type:'text',
    placeholder:'Ingrese la cedula del cliente',
    alert:'La cedula es obligatorio',
    icon:'',
    formControlName:'cedula',
    formValidators:{'cedula':['',[Validators.required]]}
  },
  {
    label:'Nombre',
    type:'text',
    placeholder:'Ingrese el nombre del cliente',
    alert:'El nombre es obligatorio',
    icon:'',
    formControlName:'name',
    formValidators:{'name':['',[Validators.required]]}
  },
  {
    label:'Apellido',
    type:'text',
    placeholder:'Ingrese el apellido del cliente',
    alert:'El apellido es obligatorio',
    icon:'',
    formControlName:'apellido',
    formValidators:{'apellido':['',[Validators.required]]}
  },
  {
    label:'Dirección',
    type:'text',
    placeholder:'Ingrese la dirección del cliente',
    alert:'La dirección es obligatorio',
    icon:'',
    formControlName:'direccion',
    formValidators:{'direccion':['',[Validators.required]]}
  }]


  formProductoUpdate:FormData[] = []
  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices, private formBuilder:FormBuilder){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('nombreProducto'),
      this.dataService.getData('marca'),
      this.dataService.getData('producto'),
    ).pipe(
      map((data:any[])=>{
        this.NombresProductos = data[0]
        this.Marcas= data[1]
        let producto:Product[] = data[2]
        
         producto.forEach(element => {

          this.myData.push({
            codProducto:element.codProducto,
            marca: this.Marcas[element.idMarca - 1].marca,
            nombre: this.NombresProductos[element.idNombreProducto - 1].nombreProducto,
            descripcion: element.descripcion,
            precioActual: element.precioActual,
            estadoProducto : element.estadoProducto? 'Inactivo' : 'Activo'
          })
        });
        return this.myData
      })
    )

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'Codigo Producto', def:'codProducto', dataKey:'codProducto'},
      {label:'Marca', def:'marca', dataKey:'marca'},
      {label:'Nombre', def:'Nombre', dataKey:'nombre'},
      {label:'Descripcion', def:'Descripcion', dataKey:'descripcion'},
      {label:'Precio Actual', def:'precioActual', dataKey:'precioActual'},
      {label:'Estado Producto', def:'estadoProducto', dataKey:'estadoProducto'}
    ]
  }

  getEventBtnClickHeader(){
    if(!HeaderData.eventBtnClick)
      this.dataUpdate = undefined
    return HeaderData.eventBtnClick;
  }

  setFormUpdate(data:Data | undefined){
    this.dataUpdate = data

    if(data){
      this.marca = data.marca;
      this.estadoProducto = data.estadoProducto;
      this.nombreProducto = data.nombre;
      this.precioActual = data.precioActual;
      
      this.form = this.formBuilder.group(
        {
          'marca':[this.marca,Validators.required],
          'nombre':[this.nombreProducto,Validators.required],
          'precioActual':[this.precioActual,Validators.required],
          'estadoProducto':[this.estadoProducto,Validators.required]
        }
        
      );  
    }
    
    
  
  }

  formGet(fr:string){
    return this.form.get(fr) as FormControl;
  }

}
