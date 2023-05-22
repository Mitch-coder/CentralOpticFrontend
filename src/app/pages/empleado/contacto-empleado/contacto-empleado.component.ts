import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { forkJoin, map, tap } from 'rxjs';
import { FormData, FormDataVal } from 'src/app/modules/form/components/form/form-data';
import { HeaderData } from 'src/app/header/header-data';
import { Validators } from '@angular/forms';

interface Empleado{
  numEmpleado:number;
  nombres:string;
  apellidos:string;
  direccion:string;
}

interface TelefonoEmpleado{
  idTelefonoEmpleado:number;
  numEmpleado:number;
  telefono:string;
}

interface CorreoEmpleado{
  idCorreoCliente:number;
  numEmpleado:number;
  correo:string;
}

interface Data{
  numEmpleado:number;
  nombre:string;
  apellido:string;
  telefono:string[];
  correo:string[];
}


@Component({
  selector: 'app-contacto-empleado',
  templateUrl: './contacto-empleado.component.html',
  styleUrls: ['./contacto-empleado.component.css']
})
export class ContactoEmpleadoComponent {
  myData: Data[] = [];
  myData$:any;
  dataUpdate:any = undefined;
 
  tableColumns: TableColumn[] =[]

  formTelefonoEmpleado:FormData[]=[]
  formCorreoEmpleado:FormData[]=[]

  formEmpleadoUpdate:FormData[] = []

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('empleado'),
      this.dataService.getData('telefonoempleado'),
      this.dataService.getData('correoempleado')
    ).pipe(
      map((data:any[])=>{
        let empleado:Empleado[] = data[0];
        let telefonoEmpleado:TelefonoEmpleado[] = data[1];
        let correoEmpleado:CorreoEmpleado[] = data[2];

        empleado.forEach(element =>{
          let telefono = telefonoEmpleado.filter(e => e.numEmpleado == element.numEmpleado);
          let correo = correoEmpleado.filter(e => e.numEmpleado == element.numEmpleado);

          let tel:FormDataVal[] = [];
          for(let t of telefono){
            tel.push( 
              {
                id:t.numEmpleado,
                value:t.telefono
              }
             )
          }
          let t :string[] = [];
          for(let c of telefono){
            t.push(c.telefono)
          }

          let cor :string[] = [];
          for(let c of correo){
            cor.push(c.correo)
          }

          this.myData.push(
            {
              numEmpleado:element.numEmpleado,
              nombre:(element.nombres + ' ' + element.apellidos),
              apellido:element.apellidos,
              telefono:t,
              correo:cor
            }
          )
        })
        console.log(this.myData)
        // console.log(this.myData[0].nombre.replace(this.myData[0].apellido,''))

        this.setFormTelefonoEmpleado(this.myData);
        this.setFormCorreoEmpleado(this.myData)

        return this.myData
      })
    )
    this.setTableColumns()
  }

setTableColumns(){
  this.tableColumns=[
    {label:'Identificador', def:'NumEmpleado', dataKey:'numEmpleado'},
    {label:'Nombre', def:'Nombre', dataKey:'nombre'},
    {label:'Telefono', def:'telefono', dataKey:'telefono'},
    {label:'Correo', def:'correo', dataKey:'correo'},
  ]
}

getEventBtnClickHeader(){
if(!HeaderData.eventBtnClick)
  this.dataUpdate = undefined
return HeaderData.eventBtnClick;
}

setFormTelefonoEmpleado(data:Data[]){
let client:string[] = []

for(let d of data){
  if(d.telefono.length !== 2){
    client.push('Cedula: '+d.numEmpleado + "  Empleado: " + d.nombre)
  }
}
//  <i class="fa-solid fa-key"></i> <i class=""></i><i class=""></i>

this.formTelefonoEmpleado = [{
  label:'Seleccione el Empleado',
  type:'select',
  placeholder:'seleccione un Empleado',
  alert:'',
  icon:'',
  formControlName:'selectTelefono',
  formValidators:{'selectTelefono':['',[Validators.required]]},
  class:'',
  option:client
},
{
  label:'Telefono',
  type:'tel',
  placeholder:'Ingrese el Telefono del Empleado',
  alert:'El Telefono es obligatorio',
  icon:'',
  formControlName:'name',
  formValidators:{'name':['',[Validators.required,Validators.minLength(8),Validators.maxLength(8)]]}
}]

}

setFormCorreoEmpleado(data:Data[]){
    let email:string[] = []

    for(let d of data){
      if(d.correo.length !== 2){
        email.push(d.numEmpleado + " " + d.nombre)
      }
    }


    this.formCorreoEmpleado = [{
      label:'Seleccione el Empleado',
      type:'select',
      placeholder:'seleccione un Empleado',
      alert:'',
      icon:'',
      formControlName:'selectTelefono',
      formValidators:{'selectTelefono':['',[Validators.required]]},
      class:'',
      option:email
    },
    {
      label:'Correo',
      type:'email',
      placeholder:'Ingrese el Correo del Empleado',
      alert:'El Correo es obligatorio',
      icon:'',
      formControlName:'correoEmpleado',
      formValidators:{'correoEmpleado':['',[Validators.required,Validators.email]]}
    }]
  }

  setFormUpdate(data:Data){
    this.dataUpdate = data
    if(this.dataUpdate){
      this.formEmpleadoUpdate = [{
        label:'Nombre',
        type:'text',
        placeholder:'Nuevo nombre del cliente',
        alert:'El Nombre no puede estar vacio',
        icon:'',
        formControlName:'NameUpdate',
        formValidators:{'NameUpdate':[data.nombre.replace(data.apellido,''),[Validators.required]]},
        value:data.nombre.replace(data.apellido,'')
      },
      {
        label:'Apellido',
        type:'text',
        placeholder:'Nuevo apellido del cliente',
        alert:'El apellido no puede estar vacio',
        icon:'',
        formControlName:'LastNameUpdate',
        formValidators:{'LastNameUpdate':[data.apellido,[Validators.required]]},
        value:data.apellido
      }]
      
      this.formEmpleadoUpdate.push(
        {
          label:'Telefonos',
          type:'text',
          placeholder:'Telefono 1',
          alert:'El telefono no puede estar vacio',
          icon:'',
          formControlName:'TelUpdate1',
          formValidators:{'TelUpdate1':[data.telefono[0],[Validators.required,Validators.minLength(8),Validators.maxLength(8)]]},
          value:data.telefono[0]
        }
      )

      if(data.telefono.length > 1){
        this.formEmpleadoUpdate.push(
          {
            label:'',
            type:'text',
            placeholder:'Telefono 2',
            alert:'El telefono no puede estar vacio',
            icon:'',
            formControlName:'TelUpdate2',
            formValidators:{'TelUpdate2':[data.telefono[1],[Validators.required,Validators.minLength(8),Validators.maxLength(8)]]},
            value:data.telefono[1]
          }
        )
      }

      this.formEmpleadoUpdate.push(
        {
          label:'Correos',
          type:'email',
          placeholder:'correo 1',
          alert:'El correo no puede estar vacio',
          icon:'',
          formControlName:'EmailUpdate1',
          formValidators:{'EmailUpdate1':[data.correo[0],[Validators.required,Validators.email]]},
          value:data.correo[0]
        }
      )

      if(data.correo.length > 1){
        this.formEmpleadoUpdate.push(
          {
            label:'',
            type:'email',
            placeholder:'correo 2',
            alert:'El correo no puede estar vacio',
            icon:'',
            formControlName:'EmailUpdate2',
            formValidators:{'EmailUpdate2':[data.correo[1],[Validators.required,Validators.email]]},
            value:data.correo[1]
          }
        )
      }
    }
  }
  
}
