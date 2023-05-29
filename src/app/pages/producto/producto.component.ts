import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { HeaderData } from 'src/app/header/header-data';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';

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

interface EstadoProducto{
  value:string;
  icon:string
}

interface Proveedor {
  idProveedor: number;
  nombre: string;
  propietario: string;
  direccion: string;
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
  EstadoProducto:EstadoProducto[] = [ 
    {value:'Activo', icon:'fa-regular fa-square-check text-success'} , 
    {value:'Inactivo',icon:'fa-regular fa-circle-xmark text-danger'} ]

  // <i class=""></i>

  marca:string = ''
  nombreProducto:string = ''
  estadoProducto:EstadoProducto = {value:'Activo', icon:'fa-regular fa-square-check text-success'} 
  precioActual:number = 0

  //Proveedor
  Proveedor:Proveedor[] = []
  proveedorSelect:string[] = [] 
  marcaSelect:string[] = []


  private matDialogRef!: MatDialogRef<DialogComponent>;
    

  form!: FormGroup;

  formMarcas:FormData[] = [
  {
    label:'Nombre de la Marca',
    type:'text',
    placeholder:'Ingrese la nueva Marca del producto',
    alert:'La Marca es obligatorio',
    icon:'',
    formControlName:'marca',
    formValidators:{'marca':['',[Validators.required]]}
  }]
  

  formProducto:FormData[]=[{
    label:'Nombre del producto',
    type:'text',
    placeholder:'Ingrese el nombre del producto',
    alert:'El nombre es obligatorio',
    icon:'fa-solid fa-pencil',
    formControlName:'nombre',
    formValidators:{'nombre':['',[Validators.required]]}
  },
  {
    label:'Proveedor',
    type:'select',
    placeholder:'',
    alert:'El proveedor es obligatorio',
    icon:'',
    formControlName:'proveedor',
    formValidators:{'proveedor':['',[Validators.required]]},
    option:this.proveedorSelect
  },
  {
    label:'Marcas',
    type:'select',
    placeholder:'',
    alert:'La marca es obligatorio',
    icon:'',
    formControlName:'marca',
    formValidators:{'marca':['',[Validators.required]]},
    option:this.marcaSelect
  },
  {
    label:'Cantidad',
    type:'number',
    placeholder:'Ingrese la cantidad de productos',
    alert:'La Cantidad de productos es obligatoria',
    icon:'fa-solid fa-arrow-up-9-1',
    formControlName:'cantidad',
    formValidators:{'cantidad':['',[Validators.required]]}
  },
  {
    label:'Precio',
    type:'number',
    placeholder:'Ingrese el precio de los productos',
    alert:'El precio de los productos es obligatoria',
    icon:'fa-solid fa-coins',
    formControlName:'precio',
    formValidators:{'precio':['',[Validators.required]]}
  },
  {
    label:'Estado del producto',
    type:'select',
    placeholder:'',
    alert:'el estado producto es obligatorio',
    icon:'',
    formControlName:'estadoProducto',
    formValidators:{'estadoProducto':['Activo',[Validators.required]]},
    option:['Activo', 'Inactivo']
  }]

  formProductoUpdate:FormData[] = []
  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices, 
    private formBuilder:FormBuilder,
    private dialogService: DialogService){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('nombreProducto'),
      this.dataService.getData('marca'),
      this.dataService.getData('producto'),
      this.dataService.getData('proveedor'),
    ).pipe(
      map((data:any[])=>{
        this.NombresProductos = data[0]
        this.Marcas= data[1]
        let producto:Product[] = data[2]
        this.Proveedor = data[3];


        this.Proveedor.forEach(d => {
          this.proveedorSelect.push('Nombre: '+d.nombre + '  |  ' +' Propietario: '+ d.propietario);
        })

        this.Marcas.forEach(d=>{
          this.marcaSelect.push(d.marca);
        })
        
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
      let t = this.EstadoProducto.filter(f => f.value == data.estadoProducto)
      this.estadoProducto = {value: t[0].value, icon: t[0].icon}
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

  onChangeOption(option: string) {
    console.log(option)
    let c = this.EstadoProducto.filter(p => p.icon == option)
    this.estadoProducto = c[0]
  }

  openDialogWithTemplate(template: TemplateRef<any>) {
    // console.log('entra')
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template, 
    });

    this.matDialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog With Template Close', res);
    });
  }

  onSave(marca:any) {
    this.Marcas.push({idMarca:-1,marca:marca.marca})
    this.marca = marca.marca
    this.matDialogRef.close();
  }


}


