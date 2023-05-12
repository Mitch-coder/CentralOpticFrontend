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

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  providers: [HeaderSearch]
})
export class ClienteComponent {
  myData:any ;
  myData$:any;

  tableColumns: TableColumn[] =[]

  form:FormData[]=[{
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
    label:'select 1',
    type:'select',
    placeholder:'seleccione una opcion',
    alert:'',
    icon:'',
    formControlName:'select',
    formValidators:{'select':['',[Validators.required]]},
    class:'',
    option:['option 1','option 2','option 3']
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
      {label:'IdCliente', def:'IdCliente', dataKey:'codCliente'},
      {label:'Cedula', def:'Cedula', dataKey:'cedula'},
      {label:'Nombre', def:'Nombre', dataKey:'nombres'},
      {label:'Apellido', def:'Apellido', dataKey:'apellidos'},
      {label:'Direccion', def:'Direccion', dataKey:'direccion'}
    ]
  }

  getEventBtnClickHeader(){
    return HeaderData.eventBtnClick;
  }

  // getHeaderText(){
  //   console.log(HeaderData.headerText)
  //   return true
  // }

  // setDataTable(data:any){
  //   if(HeaderData.headerText !== ''){
  //     return data.filter((e: { nombre: any; }) => e.nombre == HeaderData.headerText)
  //   }
  //   return data;
  // }

  // applyFilter() {
  //   if(HeaderData.headerText){
  //     const filterValue = (HeaderData.headerText.target as HTMLInputElement).value;
  //     this.myData$.filter = filterValue.trim().toLowerCase();
  //     return this.myData$
  //   }
  //   return this.myData$
  // }
}
