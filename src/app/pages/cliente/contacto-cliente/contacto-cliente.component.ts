import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map, tap } from 'rxjs';
import { HeaderData } from 'src/app/header/header-data';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { FormData, FormDataVal } from 'src/app/modules/form/components/form/form-data';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ClienteComponent } from '../cliente.component';



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
export class ContactoClienteComponent implements OnInit {
  myData: Data[] = [];
  myData$: any;
  dataUpdate: any = undefined;

  tableColumns: TableColumn[] = []

  formTelefonoCliente: FormData[] = []
  formCorreoCliente: FormData[] = []

  formClientUpdate: FormData[] = []

  cliente: Cliente[] = []

  telefonoCliente: TelefonoCliente[] = []
  correoCliente: CorreoCliente[] = []

  parametro: any;



  constructor(private dataService: MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    let objeto = history.state.objeto;

    if (objeto) {
      this.clienteEmail = objeto
      this.clientePhone = objeto

      // console.log(this.clienteEmail)
      // console.log(this.clientePhone)
    }
    // this.route.params.subscribe(params => {
    //   let parametro = params['cliente'];


    //   console.log(parametro)
    //   if(this.parametro){
    //     this.initial()
    //     this.clienteEmail = this.parametro
    //     this.clientePhone = this.parametro
    //     // HeaderData.eventBtnClick = false
    //   }
    // });

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
          let telefono = this.telefonoCliente.filter(e => e.codCliente == element.codCliente);
          let correo = this.correoCliente.filter(e => e.codCliente == element.codCliente);

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

        // this.setFormTelefonoCliente(this.myData);
        // this.setFormCorreoCliente(this.myData)

        this.ClientePhoneList

        return this.myData
      })


    )


    this.setTableColumns();
  }

  initial() {
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
          let telefono = this.telefonoCliente.filter(e => e.codCliente == element.codCliente);
          let correo = this.correoCliente.filter(e => e.codCliente == element.codCliente);

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

        // this.setFormTelefonoCliente(this.myData);
        // this.setFormCorreoCliente(this.myData)

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

  // setFormTelefonoCliente(data: Data[]) {
  //   let client: string[] = []

  //   for (let d of data) {
  //     if (d.telefono.length !== 2) {
  //       client.push('Cedula: ' + d.cedula + "  Cliente: " + d.nombre)
  //     }
  //   }
  //   //  <i class="fa-solid fa-key"></i> <i class=""></i><i class=""></i>

  //   this.formTelefonoCliente = [{
  //     label: 'Seleccione el Cliente',
  //     type: 'select',
  //     placeholder: 'seleccione un Cliente',
  //     alert: '',
  //     icon: '',
  //     formControlName: 'selectCliente',
  //     formValidators: { 'selectCliente': ['', [Validators.required]] },
  //     class: '',
  //     option: client
  //   },
  //   {
  //     label: 'Telefono',
  //     type: 'tel',
  //     placeholder: 'Ingrese el Telefono del cliente',
  //     alert: 'El Telefono es obligatorio',
  //     icon: '',
  //     formControlName: 'data',
  //     formValidators: { 'data': ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]] }
  //   }]

  // }

  // setFormCorreoCliente(data: Data[]) {
  //   let email: string[] = []

  //   for (let d of data) {
  //     if (d.correo.length !== 2) {
  //       email.push(d.cedula + " " + d.nombre)
  //     }
  //   }


  //   this.formCorreoCliente = [{
  //     label: 'Seleccione el Cliente',
  //     type: 'select',
  //     placeholder: 'seleccione un Cliente',
  //     alert: '',
  //     icon: '',
  //     formControlName: 'selectCliente',
  //     formValidators: { 'selectCliente': ['', [Validators.required]] },
  //     class: '',
  //     option: email
  //   },
  //   {
  //     label: 'Correo',
  //     type: 'email',
  //     placeholder: 'Ingrese el Correo del cliente',
  //     alert: 'El Correo es obligatorio',
  //     icon: '',
  //     formControlName: 'data',
  //     formValidators: { 'data': ['', [Validators.required, Validators.email]] }
  //   }]

  // }

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

      if (data.telefono.length !== 0) {
        this.formClientUpdate.push(
          {
            label: 'Telefonos',
            type: 'text',
            placeholder: 'Telefono 1',
            alert: 'El telefono no puede estar vacio',
            icon: 'fa-solid fa-mobile-screen',
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
              icon: 'fa-solid fa-mobile-screen',
              formControlName: 'telefono2',
              formValidators: { 'telefono2': [data.telefono[1], [Validators.required, Validators.minLength(8), Validators.maxLength(8)]] },
              value: data.telefono[1]
            }
          )
        }

      }


      if (data.correo.length !== 0) {
        this.formClientUpdate.push(
          {
            label: 'Correos',
            type: 'email',
            placeholder: 'correo 1',
            alert: 'El correo no puede estar vacio',
            icon: 'fa-regular fa-envelope',
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
              icon: 'fa-regular fa-envelope',
              formControlName: 'correo2',
              formValidators: { 'correo2': [data.correo[1], [Validators.required, Validators.email]] },
              value: data.correo[1]
            }
          )
        }
      }
    }
  }

  // dataCreateTelefonoBD(data:any){
  //   let d = data.selectCliente.split(' ');
  //   let cliente = this.cliente.filter(e => e.cedula == d[1])
  //   console.log(this.cliente)
  //   // let telefono =  this.telefonoCliente.filter(e => e.codCliente == cliente[0].codCliente)

  //   let tel = {
  //     codCliente:cliente[0].codCliente,
  //     telefono:data.data
  //   }
  //   this.dataService.postData('telefonocliente',tel)
  // }

  // dataCreateCorreoBD(data:any){
  //   let d = data.selectCliente.split(' ');
  //   let cliente = this.cliente.filter(e => e.cedula == d[0])
  //   // let telefono =  this.telefonoCliente.filter(e => e.codCliente == cliente[0].codCliente)

  //   let tel = {
  //     codCliente:cliente[0].codCliente,
  //     correo:data.data
  //   }
  //   this.dataService.postData('correocliente',tel)
  // }

  eventCancelFormUpdate(data: any) {
    this.swalWithBootstrapButtons.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea cerrar el formulario, se perderan todos los datos que haya actualizado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cerrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataUpdate = undefined
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.swalWithBootstrapButtons.fire(
          'Cancelado',
          'Los datos siguen a salvo :)',
          'error'
        )
      }
    });
  }

  loadDataConfirmationUpdate(data: any) {
    this.swalWithBootstrapButtons.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas actualizar la informacion?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'actualizar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataUpdateDB(data)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.swalWithBootstrapButtons.fire(
          'Cancelado',
          'Los datos siguen a salvo :)',
          'error'
        )
      }
    });
  }

  dataUpdateDB(data: DataV) {
    let cliente = this.cliente.filter(e => e.cedula == this.dataUpdate.cedula)
    let telefono = this.telefonoCliente.filter(e => e.codCliente == cliente[0].codCliente)
    let correo = this.correoCliente.filter(e => e.codCliente == cliente[0].codCliente)
    console.log('')
    if (data.nombre !== data.nombre.replace(' ' + data.apellido, '')
      || data.apellido !== data.apellido) {

      cliente[0].nombres = data.nombre;
      cliente[0].apellidos = data.apellido

      this.dataService.updateData('cliente', cliente[0], cliente[0].codCliente)
    }

    if (data.telefono1 !== telefono[0].telefono) {
      let c = {
        idTelefonoCliente: telefono[0].idTelefonoCliente,
        codCliente: cliente[0].codCliente,
        telefono: data.telefono1
      }

      this.dataService.updateData('telefonocliente', c, c.idTelefonoCliente)
    }

    if (data.telefono2 && data.telefono2 !== telefono[1].telefono) {
      let c = {
        idTelefonoCliente: telefono[1].idTelefonoCliente,
        codCliente: cliente[0].codCliente,
        telefono: data.telefono2
      }

      this.dataService.updateData('telefonocliente', c, c.idTelefonoCliente)
    }

    if (data.correo1 && data.correo1 !== correo[0].correo) {
      let c = {
        idCorreoCliente: correo[0].idCorreoCliente,
        codCliente: cliente[0].codCliente,
        correo: data.correo1
      }

      this.dataService.updateData('correocliente', c, c.idCorreoCliente)
    }

    if (data.correo2 && data.correo2 !== correo[1].correo) {
      let c = {
        idCorreoCliente: correo[1].idCorreoCliente,
        codCliente: cliente[0].codCliente,
        correo: data.correo2
      }

      this.dataService.updateData('correocliente', c, c.idCorreoCliente)
    }


    this.initial()

    this.dataUpdate = undefined
    // this.initial()

  }



  //////////////////////////////////////////////////////////////

  clientePhone: Cliente = {
    codCliente: 0,
    cedula: '',
    nombres: '',
    apellidos: '',
    direccion: ''
  }

  clienteEmail: Cliente = {
    codCliente: 0,
    cedula: '',
    nombres: '',
    apellidos: '',
    direccion: ''
  }

  phone: string = ''
  email: string = ''

  ClientePhoneList: Cliente[] = []
  ClienteEmailList: Cliente[] = []

  tableColumnsCliente = [
    // {label:'Identificador', def:'IdCliente', dataKey:'codCliente'},
    { label: 'Cedula', def: 'Cedula', dataKey: 'cedula' },
    { label: 'Nombre', def: 'Nombre', dataKey: 'nombres' },
    { label: 'Apellido', def: 'Apellido', dataKey: 'apellidos' }
    // {label:'Direccion', def:'Direccion', dataKey:'direccion'}
  ]

  formCreatePhone: FormGroup = this.formBuilder.group(
    {
      'cliente': [this.clientePhone, Validators.required],
      'telefono': [this.phone, Validators.required]
    }
  )

  formCreateEmail: FormGroup = this.formBuilder.group(
    {
      'cliente': [this.clienteEmail, Validators.required],
      'correo': [this.email, Validators.required]
    }
  );

  private matDialogRef!: MatDialogRef<DialogComponent>;


  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  valTable = true;

  formGetPhone(fr: string) {
    // console.log(this.formCreate.get(fr) as FormControl)
    return this.formCreatePhone.get(fr) as FormControl;
  }

  formGetEmail(fr: string) {
    // console.log(this.formCreate.get(fr) as FormControl)
    return this.formCreateEmail.get(fr) as FormControl;
  }

  clienteFilterPhone() {
    this.ClientePhoneList = this.cliente.filter(c => this.telefonoCliente.filter(t => t.codCliente == c.codCliente).length !== 2)
  }

  clienteFilterEmail() {
    this.ClienteEmailList = this.cliente.filter(c => this.correoCliente.filter(e => e.codCliente == c.codCliente).length !== 2)
  }

  openDialogWithTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });

    this.matDialogRef.afterClosed().subscribe((res) => {
    });
  }

  btnClickPhone(template: TemplateRef<any>) {
    this.clienteFilterPhone()
    this.openDialogWithTemplate(template);
  }

  btnClickEmail(template: TemplateRef<any>) {
    this.clienteFilterEmail()
    this.openDialogWithTemplate(template);
  }

  resultDataTablePhone(cliente: Cliente) {
    this.clientePhone = cliente
    this.matDialogRef.close()
  }

  resultDataTableEmail(cliente: Cliente) {
    this.clienteEmail = cliente
    this.matDialogRef.close()
  }

  cancelDialogResult() {
    this.matDialogRef.close()
  }

  loadDataConfirmationPhone(data: any) {
    // console.log(this.cliente)
    this.valTable = false
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas guardar el telefono del cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.addDataPhone(data.value)
        data.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.swalWithBootstrapButtons.fire(
          'Cancelado',
          'Los datos siguen a salvo :)',
          'error'
        )
      }
    });
  }

  addDataPhone(data: any) {
    let tel: Cliente[] = []

    if (!this.clientePhone.codCliente) {
      tel = this.cliente.filter(e => e.cedula === this.clientePhone.cedula)
      // this.clientePhone = tel[0]
    }else{
      tel.push(this.clientePhone)
    }

    let telefono = {
      codCliente: tel[0].codCliente,
      telefono: data.telefono.toString()
    }

    // console.log(telefono)


    this.dataService.postData('telefonocliente', telefono)
    .then( success => {

      if(success){

        this.swalWithBootstrapButtons.fire(
          'Exito!',
          'La informacion a sido guardada',
          'success'
        )
  
        this.clientePhone = {
          codCliente: 0,
          cedula: '',
          nombres: '',
          apellidos: '',
          direccion: ''
        }
  
        this.phone = ''
        this.valTable = true
        this.initial()


      }
      else{

        this.swalWithBootstrapButtons.fire({
          icon: 'error',
          title: 'Ups...',
          text: 'Algo salió mal!',
          footer: '<a href="">¿Por qué tengo este problema??</a>'
        })


      }


    })
    
  }

  loadDataConfirmationEmail(data: FormGroup) {
    this.valTable = false
    this.swalWithBootstrapButtons.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas guardar el Correo del cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.addDataPhone(data.value)
        data.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.swalWithBootstrapButtons.fire(
          'Cancelado',
          'Los datos siguen a salvo :)',
          'error'
        )
      }
    });
  }

  addDataEmail(data: any) {
    let tel:Cliente[] = []
    if (!this.clienteEmail.codCliente) {
      tel = this.cliente.filter(e => e.cedula === this.clienteEmail.cedula)
      // this.clienteEmail = tel[0]
    }else{
      tel.push( this.clienteEmail)
    }

    let contact = {
      codCliente: tel[0].codCliente,
      telefono: data.telefono
    }

    this.dataService.postData('correocliente', contact)
    .then( success => {

      if(success){

        this.swalWithBootstrapButtons.fire(
          'Exito!',
          'La informacion a sido guardada',
          'success'
        )
        this.clienteEmail = {
          codCliente: 0,
          cedula: '',
          nombres: '',
          apellidos: '',
          direccion: ''
        }
  
        this.email = ''
        this.valTable = true
        this.initial()

      }
      else{

        this.swalWithBootstrapButtons.fire({
          icon: 'error',
          title: 'Ups...',
          text: 'Algo salió mal!',
          footer: '<a href="">¿Por qué tengo este problema??</a>'
        })

      }
      
    })
  }

}

