import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { forkJoin, map, tap } from 'rxjs';
import { HeaderData } from 'src/app/header/header-data';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { FormData, FormDataVal } from 'src/app/modules/form/components/form/form-data';

interface Cliente {
  codCliente: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  direccion: string;
}

interface TelefonoCliente {
  idTelefonoCliente: number;
  codCliente: number;
  telefono: string;
}

interface CorreoCliente {
  idCorreoCliente: number;
  codCliente: number;
  correo: string;
}

interface Data {
  codCliente: number;
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string[];
  correo: string[];
}

interface DataV {
  nombre: string;
  apellido: string;
  telefono1: string;
  correo1: string;
  telefono2?: string;
  correo2?: string;
}

@Component({
  selector: 'app-contacto-cliente',
  templateUrl: './contacto-cliente.component.html',
  styleUrls: ['./contacto-cliente.component.css']
})
export class ContactoClienteComponent {
  myData: Data[] = [];
  myData$: any;
  dataUpdate: any = undefined;

  tableColumns: TableColumn[] = []

  formTelefonoCliente: FormData[] = []
  formCorreoCliente: FormData[] = []

  formClientUpdate: FormData[] = []

  cliente:Cliente[] = []

  telefonoCliente:TelefonoCliente[] = []
  correoCliente:CorreoCliente[] = []



  constructor(private dataService: MyDataServices) { }

  ngOnInit(): void {

    this.myData$ = forkJoin(
      this.dataService.getData('cliente'),
      this.dataService.getData('telefonocliente'),
      this.dataService.getData('correocliente')
    ).pipe(
      map((data: any[]) => {
        this.cliente = data[0];
        this.telefonoCliente = data[1];
        this.correoCliente = data[2];
        this.myData = []
        this.cliente.forEach(element => {
          let telefono =  this.telefonoCliente.filter(e => e.codCliente == element.codCliente);
          let correo =  this.correoCliente.filter(e => e.codCliente == element.codCliente);


          let tel: FormDataVal[] = [];
          for (let t of telefono) {
            tel.push(
              {
                id: t.codCliente,
                value: t.telefono
              }
            )
          }
          let t: string[] = [];
          for (let c of telefono) {
            t.push(c.telefono)
          }

          let cor: string[] = [];
          for (let c of correo) {
            cor.push(c.correo)
          }

          this.myData.push(
            {
              codCliente: element.codCliente,
              cedula: element.cedula,
              nombre: (element.nombres + ' ' + element.apellidos),
              apellido: element.apellidos,
              telefono: t,
              correo: cor
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

  initial(){
    this.myData$ = forkJoin(
      this.dataService.getData('cliente'),
      this.dataService.getData('telefonocliente'),
      this.dataService.getData('correocliente')
    ).pipe(
      map((data: any[]) => {
        this.cliente = data[0];
        this.telefonoCliente = data[1];
        this.correoCliente = data[2];
        this.myData = []
        this.cliente.forEach(element => {
          let telefono =  this.telefonoCliente.filter(e => e.codCliente == element.codCliente);
          let correo =  this.correoCliente.filter(e => e.codCliente == element.codCliente);

          let tel: FormDataVal[] = [];
          for (let t of telefono) {
            tel.push(
              {
                id: t.codCliente,
                value: t.telefono
              }
            )
          }
          let t: string[] = [];
          for (let c of telefono) {
            t.push(c.telefono)
          }

          let cor: string[] = [];
          for (let c of correo) {
            cor.push(c.correo)
          }

          this.myData.push(
            {
              codCliente: element.codCliente,
              cedula: element.cedula,
              nombre: (element.nombres + ' ' + element.apellidos),
              apellido: element.apellidos,
              telefono: t,
              correo: cor
            }
          )
        })

        // console.log(this.myData[0].nombre.replace(this.myData[0].apellido,''))

        this.setFormTelefonoCliente(this.myData);
        this.setFormCorreoCliente(this.myData)

        return this.myData
      })


    )
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Cedula', def: 'Cedula', dataKey: 'cedula' },
      { label: 'Nombre', def: 'Nombre', dataKey: 'nombre' },
      { label: 'Telefono', def: 'telefono', dataKey: 'telefono' },
      { label: 'Correo', def: 'correo', dataKey: 'correo' },
    ]
  }

  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick)
      this.dataUpdate = undefined
    return HeaderData.eventBtnClick;
  }

  setFormTelefonoCliente(data: Data[]) {
    let client: string[] = []

    for (let d of data) {
      if (d.telefono.length !== 2) {
        client.push('Cedula: ' + d.cedula + "  Cliente: " + d.nombre)
      }
    }
    //  <i class="fa-solid fa-key"></i> <i class=""></i><i class=""></i>

    this.formTelefonoCliente = [{
      label: 'Seleccione el Cliente',
      type: 'select',
      placeholder: 'seleccione un Cliente',
      alert: '',
      icon: '',
      formControlName: 'selectCliente',
      formValidators: { 'selectCliente': ['', [Validators.required]] },
      class: '',
      option: client
    },
    {
      label: 'Telefono',
      type: 'tel',
      placeholder: 'Ingrese el Telefono del cliente',
      alert: 'El Telefono es obligatorio',
      icon: '',
      formControlName: 'data',
      formValidators: { 'data': ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]] }
    }]

  }

  setFormCorreoCliente(data: Data[]) {
    let email: string[] = []

    for (let d of data) {
      if (d.correo.length !== 2) {
        email.push(d.cedula + " " + d.nombre)
      }
    }


    this.formCorreoCliente = [{
      label: 'Seleccione el Cliente',
      type: 'select',
      placeholder: 'seleccione un Cliente',
      alert: '',
      icon: '',
      formControlName: 'selectCliente',
      formValidators: { 'selectCliente': ['', [Validators.required]] },
      class: '',
      option: email
    },
    {
      label: 'Correo',
      type: 'email',
      placeholder: 'Ingrese el Correo del cliente',
      alert: 'El Correo es obligatorio',
      icon: '',
      formControlName: 'data',
      formValidators: { 'data': ['', [Validators.required, Validators.email]] }
    }]

  }

  setFormUpdate(data: Data) {
    this.dataUpdate = data
    if (this.dataUpdate) {
      this.formClientUpdate = [{
        label: 'Nombre',
        type: 'text',
        placeholder: 'Nuevo nombre del cliente',
        alert: 'El Nombre no puede estar vacio',
        icon: '',
        formControlName: 'nombre',
        formValidators: { 'nombre': [data.nombre.replace(' ' + data.apellido, ''), [Validators.required]] },
        value: data.nombre.replace(' ' + data.apellido, '')
      },
      {
        label: 'Apellido',
        type: 'text',
        placeholder: 'Nuevo apellido del cliente',
        alert: 'El apellido no puede estar vacio',
        icon: '',
        formControlName: 'apellido',
        formValidators: { 'apellido': [data.apellido, [Validators.required]] },
        value: data.apellido
      }]

      this.formClientUpdate.push(
        {
          label: 'Telefonos',
          type: 'text',
          placeholder: 'Telefono 1',
          alert: 'El telefono no puede estar vacio',
          icon: '',
          formControlName: 'telefono1',
          formValidators: { 'telefono1': [data.telefono[0], [Validators.required, Validators.minLength(8), Validators.maxLength(8)]] },
          value: data.telefono[0]
        }
      )

      if (data.telefono.length > 1) {
        this.formClientUpdate.push(
          {
            label: '',
            type: 'text',
            placeholder: 'Telefono 2',
            alert: 'El telefono no puede estar vacio',
            icon: '',
            formControlName: 'telefono2',
            formValidators: { 'telefono2': [data.telefono[1], [Validators.required, Validators.minLength(8), Validators.maxLength(8)]] },
            value: data.telefono[1]
          }
        )
      }

      this.formClientUpdate.push(
        {
          label: 'Correos',
          type: 'email',
          placeholder: 'correo 1',
          alert: 'El correo no puede estar vacio',
          icon: '',
          formControlName: 'correo1',
          formValidators: { 'correo1': [data.correo[0], [Validators.required, Validators.email]] },
          value: data.correo[0]
        }
      )

      if (data.correo.length > 1) {
        this.formClientUpdate.push(
          {
            label: '',
            type: 'email',
            placeholder: 'correo 2',
            alert: 'El correo no puede estar vacio',
            icon: '',
            formControlName: 'correo2',
            formValidators: { 'correo2': [data.correo[1], [Validators.required, Validators.email]] },
            value: data.correo[1]
          }
        )
      }
    }
  }

  dataCreateTelefonoBD(data:any){
    let d = data.selectCliente.split(' ');
    let cliente = this.cliente.filter(e => e.cedula == d[1])
    console.log(this.cliente)
    // let telefono =  this.telefonoCliente.filter(e => e.codCliente == cliente[0].codCliente)

    let tel = {
      codCliente:cliente[0].codCliente,
      telefono:data.data
    }
    this.dataService.postData('telefonocliente',tel)
  }

  dataCreateCorreoBD(data:any){
    let d = data.selectCliente.split(' ');
    let cliente = this.cliente.filter(e => e.cedula == d[0])
    // let telefono =  this.telefonoCliente.filter(e => e.codCliente == cliente[0].codCliente)

    let tel = {
      codCliente:cliente[0].codCliente,
      correo:data.data
    }
    this.dataService.postData('correocliente',tel)
  }

  dataUpdateDB(data:DataV){
    let cliente = this.cliente.filter(e => e.cedula == this.dataUpdate.cedula)
    let telefono = this.telefonoCliente.filter(e => e.codCliente == cliente[0].codCliente)
    let correo = this.correoCliente.filter(e => e.codCliente == cliente[0].codCliente)
    console.log('')
    if(data.nombre !== data.nombre.replace(' ' + data.apellido, '') 
      || data.apellido !== data.apellido){

        cliente[0].nombres = data.nombre;
        cliente[0].apellidos = data.apellido

        this.dataService.updateData('cliente',cliente[0],cliente[0].codCliente)
    }

    if(data.telefono1 !== telefono[0].telefono){
      let c = {
        idTelefonoCliente:telefono[0].idTelefonoCliente,
        codCliente:cliente[0].codCliente,
        telefono:data.telefono1
      }

      this.dataService.updateData('telefonocliente',c,c.idTelefonoCliente)
    }

    if(data.telefono1 !== telefono[0].telefono){
      let c = {
        idTelefonoCliente:telefono[0].idTelefonoCliente,
        codCliente:cliente[0].codCliente,
        telefono:data.telefono1
      }

      this.dataService.updateData('telefonocliente',c,c.idTelefonoCliente)
    }

    if(data.correo1 !== correo[0].correo){
      let c = {
        idCorreoCliente:correo[0].idCorreoCliente,
        codCliente:cliente[0].codCliente,
        correo:data.correo1
      }

      this.dataService.updateData('correocliente',c,c.idCorreoCliente)
    }

    if(data.correo2 !== correo[1].correo){
      let c = {
        idCorreoCliente:correo[1].idCorreoCliente,
        codCliente:cliente[0].codCliente,
        correo:data.correo2
      }
      
      this.dataService.updateData('correocliente',c,c.idCorreoCliente)
    }
    

    this.initial()

    this.dataUpdate = undefined
    // this.initial()
    
  }

}

