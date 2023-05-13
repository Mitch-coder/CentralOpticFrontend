import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, map, tap } from 'rxjs';
import { HeaderData } from 'src/app/header/header-data';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { FormData } from 'src/app/modules/form/components/form/form-data';

interface Cliente{
  codCliente:number;
  cedula:string;
  nombres:string;
  apellidos:string;
  direccion:string;
}

interface TelefonoCliente{
  idTelefonoCliente:number;
  codCliente:number;
  telefono:string;
}

interface CorreoCliente{
  idTelefonoCliente:number;
  codCliente:number;
  correo:string;
}

interface Data{
  codCliente:number;
  cedula:string;
  nombre:string;
  apellido:string;
  telefono:string[];
  correo:string[];
}

@Component({
  selector: 'app-contacto-cliente',
  templateUrl: './contacto-cliente.component.html',
  styleUrls: ['./contacto-cliente.component.css']
})
export class ContactoClienteComponent {
  myData: Data[] = [];
  myData$:any;
  dataUpdate:any = undefined;

  tableColumns: TableColumn[] =[]

  formTelefonoCliente:FormData[]=[]
  formCorreoCliente:FormData[]=[]

  formClientUpdate:FormData[] = []



  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('cliente'),
      this.dataService.getData('telefonocliente'),
      this.dataService.getData('correocliente')
    ).pipe(
      map((data:any[])=>{
        let cliente:Cliente[] = data[0];
        let telefonoCliente:TelefonoCliente[] = data[1];
        let correoCliente:CorreoCliente[] = data[2];

        cliente.forEach(element =>{
          let telefono = telefonoCliente.filter(e => e.codCliente == element.codCliente);
          let correo = correoCliente.filter(e => e.codCliente == element.codCliente);

          let tel:string[] = [];
          for(let t of telefono){
            tel.push( t.telefono )
          }

          let cor :string[] = [];
          for(let c of correo){
            cor.push(c.correo)
          }

          this.myData.push(
            {
              codCliente:element.codCliente,
              cedula:element.cedula,
              nombre:(element.nombres + ' ' + element.apellidos),
              apellido:element.apellidos,
              telefono:tel,
              correo:cor
            }
          )
        })

        // console.log(this.myData[0].nombre.replace(this.myData[0].apellido,''))

        this.setFormTelefonoCliente(this.myData);
        this.setFormCorreoCliente(this.myData)

        return this.myData
      })


    )

    
    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'Cedula', def:'Cedula', dataKey:'cedula'},
      {label:'Nombre', def:'Nombre', dataKey:'nombre'},
      {label:'Telefono', def:'telefono', dataKey:'telefono'},
      {label:'Correo', def:'correo', dataKey:'correo'},
    ]
  }

  getEventBtnClickHeader(){
    return HeaderData.eventBtnClick;
  }

  setFormTelefonoCliente(data:Data[]){
    let client:string[] = []

    for(let d of data){
      if(d.telefono.length !== 2){
        client.push(d.cedula + " " + d.nombre)
      }
    }

    this.formTelefonoCliente = [{
      label:'Seleccione el Cliente',
      type:'select',
      placeholder:'seleccione un Cliente',
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
      placeholder:'Ingrese el Telefono del cliente',
      alert:'El Telefono es obligatorio',
      icon:'',
      formControlName:'name',
      formValidators:{'name':['',[Validators.required,Validators.minLength(8),Validators.maxLength(8)]]}
    }]
    
  }

  setFormCorreoCliente(data:Data[]){
    let email:string[] = []

    for(let d of data){
      if(d.correo.length !== 2){
        email.push(d.cedula + " " + d.nombre)
      }
    }

    
    this.formCorreoCliente = [{
      label:'Seleccione el Cliente',
      type:'select',
      placeholder:'seleccione un Cliente',
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
      placeholder:'Ingrese el Correo del cliente',
      alert:'El Correo es obligatorio',
      icon:'',
      formControlName:'correoCliente',
      formValidators:{'correoCliente':['',[Validators.required,Validators.email]]}
    }]
  
  }

  setFormUpdate(data:Data){
    return [{
      label:'Nombre',
      type:'text',
      placeholder:'Nuevo nombre del cliente',
      alert:'El Nombre no puede estar vacio',
      icon:'',
      formControlName:'NameUpdate',
      formValidators:{'NameUpdate':['',[Validators.required]]},
      value:data.nombre.replace(data.apellido,'')
    },
    {
      label:'Apellido',
      type:'text',
      placeholder:'Nuevo apellido del cliente',
      alert:'El apellido no puede estar vacio',
      icon:'',
      formControlName:'LastNameUpdate',
      formValidators:{'LastNameUpdate':['',[Validators.required]]},
      value:data.apellido
    },
    {
      label:'Telefonos',
      type:'tel',
      placeholder:'Telefono 1',
      alert:'El telefono no puede estar vacio',
      icon:'',
      formControlName:'TelUpdate1',
      formValidators:{'TelUpdate1':['',[Validators.required,Validators.minLength(8),Validators.maxLength(8)]]},
      value:data.telefono[0]
    },
    {
      label:'',
      type:'tel',
      placeholder:'Telefono 2',
      alert:'El telefono no es valido',
      icon:'',
      formControlName:'TelUpdate2',
      formValidators:{'TelUpdate2':['',[Validators.minLength(8),Validators.maxLength(8)]]},
      value: data.telefono.length > 1? data.telefono[1] : undefined
    },
    {
      label:'Correos',
      type:'email',
      placeholder:'correo 1',
      alert:'El correo no puede estar vacio',
      icon:'',
      formControlName:'EmailUpdate1',
      formValidators:{'EmailUpdate1':['',[Validators.required,Validators.email]]},
      value:data.correo[0]
    },
    {
      label:'',
      type:'email',
      placeholder:'Correo 2',
      alert:'El correo no puede estar vacio',
      icon:'',
      formControlName:'EmailUpdate2',
      formValidators:{'EmailUpdate2':['',[Validators.email]]},
      value:data.correo.length > 1? data.correo[1] : undefined
    }]
  }
}
