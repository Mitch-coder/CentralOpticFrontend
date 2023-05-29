import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { FormData, FormDataVal } from 'src/app/modules/form/components/form/form-data';
import { forkJoin, map, tap } from 'rxjs';
import { Validators } from '@angular/forms';
import { HeaderData } from 'src/app/header/header-data';

interface Proveedor{
  idProveedor: number;
  nombre: string;
  propietario: string;
  direccion: string;
}

interface TelefonoProveedor{
  idTelefonoProveedor:number;
  idProveedor:number;
  telefono:string;
}

interface CorreoProveedor{
  idTelefonoCliente:number;
  idProveedor:number;
  correo:string;
}

interface Data{
  idProveedor: number;
  nombre: string;
  telefono:string[];
  correo:string[];
}


@Component({
  selector: 'app-contacto-proveedor',
  templateUrl: './contacto-proveedor.component.html',
  styleUrls: ['./contacto-proveedor.component.css']
})
export class ContactoProveedorComponent {
  myData: Data[] = [];
  myData$:any;
  dataUpdate:any = undefined;
 
  tableColumns: TableColumn[] =[]

  formTelefonoCliente:FormData[]=[]
  formCorreoCliente:FormData[]=[]

  formClientUpdate:FormData[] = []

  ProveedorList:Proveedor[] = [];
  TelefonoProveedorList:TelefonoProveedor[] = [];
  CorreoProveedorList:CorreoProveedor[] =[];

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('proveedor'),
      this.dataService.getData('telefonoproveedor'),
      this.dataService.getData('correoproveedor')
    ).pipe(
      map((data:any[])=>{
        this.ProveedorList = data[0];
        this.TelefonoProveedorList = data[1];
        this.CorreoProveedorList = data[2];

        // console.log(this.ProveedorList)
        this.ProveedorList.forEach(element =>{
          let telefono = this.TelefonoProveedorList.filter(e => e.idProveedor == element.idProveedor);
          let correo = this.CorreoProveedorList.filter(e => e.idProveedor == element.idProveedor);

          let tel:FormDataVal[] = [];
          for(let t of telefono){
            tel.push( 
              {
                id:t.idTelefonoProveedor,
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
          // console.log(element.idProveedor)
          this.myData.push(
            {
              idProveedor:element.idProveedor,
              nombre:(element.nombre + ' | ' + element.propietario),
              telefono:t,
              correo:cor
            }
          )
        })
        this.setFormTelefonoCliente(this.myData);
        this.setFormCorreoCliente(this.myData);
        return this.myData
      })


    )

   

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'ID', def:'idProveedor', dataKey:'idProveedor'},
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

  setFormTelefonoCliente(data:Data[]){
    let client:string[] = []

    for(let d of data){
      if(d.telefono.length !== 2){
        client.push(d.nombre)
      }
    }
    //  <i class=""></i>

    this.formTelefonoCliente = [{
      label:'Seleccione el proveedor',
      type:'select',
      placeholder:'',
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
      placeholder:'Ingrese el Telefono del proveedor',
      alert:'El Telefono es obligatorio',
      icon:'fa-solid fa-mobile-screen',
      formControlName:'name',
      formValidators:{'name':['',[Validators.required,Validators.minLength(8),Validators.maxLength(8)]]}
    }]
    
  }

  // <i class=""></i>

  setFormCorreoCliente(data:Data[]){
    let client:string[] = []

    for(let d of data){
      if(d.correo.length !== 2){
        client.push(d.nombre)
      }
    }

    
    this.formCorreoCliente = [{
      label:'Seleccione el proveedor',
      type:'select',
      placeholder:'',
      alert:'',
      icon:'',
      formControlName:'selectTelefono',
      formValidators:{'selectTelefono':['',[Validators.required]]},
      class:'',
      option:client
    },
    {
      label:'Correo',
      type:'email',
      placeholder:'Ingrese el Correo del cliente',
      alert:'El Correo es obligatorio',
      icon:'fa-regular fa-envelope',
      formControlName:'correoCliente',
      formValidators:{'correoCliente':['',[Validators.required,Validators.email]]}
    }]
  
  }

  setFormUpdate(data:Data){
    this.dataUpdate = data
    if(this.dataUpdate){
      this.formClientUpdate = [{
        label:'Propietario',
        type:'text',
        placeholder:'Nuevo nombre del propietario',
        alert:'El Nombre no puede estar vacio',
        icon:'fa-regular fa-user',
        formControlName:'NameUpdate',
        formValidators:{'NameUpdate':[
          this.ProveedorList.find(e => e.idProveedor == data.idProveedor)?.propietario,[Validators.required]]},
        value:this.ProveedorList.find(e => e.idProveedor == data.idProveedor)?.propietario
      },
      {
        label:'Nombre',
        type:'text',
        placeholder:'Nuevo nombre del proveedor',
        alert:'El nombre no puede estar vacio',
        icon:'fa-solid fa-shop',
        formControlName:'NombreUpdate',
        formValidators:{'NombreUpdate':[this.ProveedorList.find(e => e.idProveedor == data.idProveedor)?.nombre,[Validators.required]]},
        value:this.ProveedorList.find(e => e.idProveedor == data.idProveedor)?.nombre
      }]
      
      this.formClientUpdate.push(
        {
          label:'Telefonos',
          type:'text',
          placeholder:'Telefono 1',
          alert:'El telefono no puede estar vacio',
          icon:'fa-solid fa-mobile-screen',
          formControlName:'TelUpdate1',
          formValidators:{'TelUpdate1':[data.telefono[0],[Validators.required,Validators.minLength(8),Validators.maxLength(8)]]},
          value:data.telefono[0]
        }
      )

      if(data.telefono.length > 1){
        this.formClientUpdate.push(
          {
            label:'',
            type:'text',
            placeholder:'Telefono 2',
            alert:'El telefono no puede estar vacio',
            icon:'fa-solid fa-mobile-screen',
            formControlName:'TelUpdate2',
            formValidators:{'TelUpdate2':[data.telefono[1],[Validators.required,Validators.minLength(8),Validators.maxLength(8)]]},
            value:data.telefono[1]
          }
        )
      }

      this.formClientUpdate.push(
        {
          label:'Correos',
          type:'email',
          placeholder:'correo 1',
          alert:'El correo no puede estar vacio',
          icon:'fa-regular fa-envelope',
          formControlName:'EmailUpdate1',
          formValidators:{'EmailUpdate1':[data.correo[0],[Validators.required,Validators.email]]},
          value:data.correo[0]
        }
      )
        // <i class=""></i>
      if(data.correo.length > 1){
        this.formClientUpdate.push(
          {
            label:'',
            type:'email',
            placeholder:'correo 2',
            alert:'El correo no puede estar vacio',
            icon:'fa-regular fa-envelope',
            formControlName:'EmailUpdate2',
            formValidators:{'EmailUpdate2':[data.correo[1],[Validators.required,Validators.email]]},
            value:data.correo[1]
          }
        )
      }
    }
  }
}
