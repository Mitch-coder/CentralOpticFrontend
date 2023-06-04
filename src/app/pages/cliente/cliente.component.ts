import { Component, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { HeaderData, HeaderSearch } from 'src/app/header/header-data';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';


interface Cliente{
  codCliente:number;
  cedula:string;
  nombres:string;
  apellidos:string;
  direccion:string;
}

interface Data{
  // codCliente:number;
  cedula:string;
  nombres:string;
  apellidos:string;
  direccion:string;
}

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  providers: [HeaderSearch]
})
export class ClienteComponent {
  myData:any ;
  myData$:any;
  dataUpdate:any = undefined;

  tableColumns: TableColumn[] =[]
  formClientUpdate:FormData[] = []

  form:FormData[]=[{
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
    formControlName:'nombres',
    formValidators:{'nombres':['',[Validators.required]]}
  },
  {
    label:'Apellido',
    type:'text',
    placeholder:'Ingrese el apellido del cliente',
    alert:'El apellido es obligatorio',
    icon:'',
    formControlName:'apellidos',
    formValidators:{'apellidos':['',[Validators.required]]}
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

  constructor(private dataService:MyDataServices){
    
  }

  ngOnInit(): void{
     this.myData$ = this.dataService
     .getData('cliente')
     .pipe(tap((data:Cliente[]) =>(this.myData = data)))
     
     this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'Identificador', def:'IdCliente', dataKey:'codCliente'},
      {label:'Cedula', def:'Cedula', dataKey:'cedula'},
      {label:'Nombre', def:'Nombre', dataKey:'nombres'},
      {label:'Apellido', def:'Apellido', dataKey:'apellidos'},
      {label:'Direccion', def:'Direccion', dataKey:'direccion'}
    ]
  }

  getEventBtnClickHeader(){
    return HeaderData.eventBtnClick;
  }

  setFormUpdate(data:Cliente){
    this.dataUpdate = data
    if(this.dataUpdate){
      this.formClientUpdate = [{
        label:'Nombre',
        type:'text',
        placeholder:'Nuevo nombre del cliente',
        alert:'El Nombre no puede estar vacio',
        icon:'',
        formControlName:'nombres',
        formValidators:{'nombres':[data.nombres,[Validators.required]]},
        value:data.nombres
      },
      {
        label:'Apellido',
        type:'text',
        placeholder:'Nuevo apellido del cliente',
        alert:'El apellido no puede estar vacio',
        icon:'',
        formControlName:'apellidos',
        formValidators:{'apellidos':[data.apellidos,[Validators.required]]},
        value:data.apellidos
      }]
      
      this.formClientUpdate.push(
        {
          label:'Dirección',
          type:'text',
          placeholder:'Nueva dirección del cliete',
          alert:'La dirección no puede estar vacio',
          icon:'',
          formControlName:'direccion',
          formValidators:{'direccion':[data.direccion,[data.direccion?Validators.required:Validators.nullValidator]]},
          value:data.direccion
        }
      )
    }
  }

  setDataUpdateDB(data:Data){
    // data.codCliente = this.dataUpdate.codCliente
    this.dataService.updateData('cliente',data,this.dataUpdate.codCliente)
  }

  setDataCreateDB(data:Data){
    console.log(data)
    this.dataService.postData('cliente',data)
  }
}
