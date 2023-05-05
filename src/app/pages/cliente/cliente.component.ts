import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent {
  myData:any ;
  myData$:any;

  tableColumns: TableColumn[] =[]

  form:FormData[]=[{
    label:'Nombre',
    type:'text',
    placeholder:'Ingrese su nombre',
    alert:'El nombre es obligatorio',
    icon:'',
    formControlName:'name',
    formValidators:{'name':['',[Validators.required]]}
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

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{
     this.myData$ = this.dataService
     .getData('cliente')
     .pipe(tap((data) =>(this.myData = data)))



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
}
