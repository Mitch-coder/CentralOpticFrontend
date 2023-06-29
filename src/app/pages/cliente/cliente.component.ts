import { Component, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { tap } from 'rxjs';
import { HeaderData, HeaderSearch } from 'src/app/header/header-data';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import Swal from 'sweetalert2';


interface Cliente {
  codCliente: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  direccion: string;
}

interface Data {
  // codCliente:number;
  cedula: string;
  nombres: string;
  apellidos: string;
  direccion: string;
}

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  providers: [HeaderSearch]
})
export class ClienteComponent {
  myData: Cliente[] = [];
  myData$: any;
  dataUpdate: any = undefined;

  tableColumns: TableColumn[] = []
  formClientUpdate: FormData[] = []

  cliente: Cliente = {
    codCliente: 0,
    cedula: '',
    nombres: '',
    apellidos: '',
    direccion: ''
  }

  form: FormData[] = [{
    label: 'Cedula',
    type: 'text',
    placeholder: 'Ingrese la cedula del cliente',
    alert: 'La cedula es obligatorio',
    icon: 'fa-regular fa-address-card',
    formControlName: 'cedula',
    formValidators: { 'cedula': [this.cliente.cedula, [Validators.required]] }
  },
  {
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ingrese el nombre del cliente',
    alert: 'El nombre es obligatorio',
    icon: '',
    formControlName: 'nombres',
    formValidators: { 'nombres': [this.cliente.nombres, [Validators.required]] }
  },
  {
    label: 'Apellido',
    type: 'text',
    placeholder: 'Ingrese el apellido del cliente',
    alert: 'El apellido es obligatorio',
    icon: '',
    formControlName: 'apellidos',
    formValidators: { 'apellidos': [this.cliente.apellidos, [Validators.required]] }
  },
  {
    label: 'Dirección',
    type: 'text',
    placeholder: 'Ingrese la dirección del cliente',
    alert: 'La dirección es obligatorio',
    icon: 'fa-solid fa-map-location-dot',
    formControlName: 'direccion',
    formValidators: { 'direccion': [this.cliente.direccion, [Validators.nullValidator]] }
  }]

  constructor(private dataService: MyDataServices, private router: Router) {

  }

  ngOnInit(): void {
    this.myData$ = this.dataService
      .getData('cliente')
      .pipe(tap((data: Cliente[]) => (this.myData = data)))

    this.setTableColumns();
  }

  initDataTable() {
    console.log('')
    this.myData$ = this.dataService
      .getData('cliente')
      .pipe(tap((data: Cliente[]) => (this.myData = data)))
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Identificador', def: 'IdCliente', dataKey: 'codCliente' },
      { label: 'Cedula', def: 'Cedula', dataKey: 'cedula' },
      { label: 'Nombre', def: 'Nombre', dataKey: 'nombres' },
      { label: 'Apellido', def: 'Apellido', dataKey: 'apellidos' },
      { label: 'Direccion', def: 'Direccion', dataKey: 'direccion' }
    ]
  }

  getEventBtnClickHeader() {
    return HeaderData.eventBtnClick;
  }

  setFormUpdate(data: Cliente) {
    this.dataUpdate = data
    if (this.dataUpdate) {
      this.formClientUpdate = [{
        label: 'Nombre',
        type: 'text',
        placeholder: 'Nuevo nombre del cliente',
        alert: 'El Nombre no puede estar vacio',
        icon: '',
        formControlName: 'nombres',
        formValidators: { 'nombres': [data.nombres, [Validators.required]] },
        value: data.nombres
      },
      {
        label: 'Apellido',
        type: 'text',
        placeholder: 'Nuevo apellido del cliente',
        alert: 'El apellido no puede estar vacio',
        icon: '',
        formControlName: 'apellidos',
        formValidators: { 'apellidos': [data.apellidos, [Validators.required]] },
        value: data.apellidos
      }]

      this.formClientUpdate.push(
        {
          label: 'Dirección',
          type: 'text',
          placeholder: 'Nueva dirección del cliete',
          alert: 'La dirección no puede estar vacio',
          icon: 'fa-solid fa-map-location-dot',
          formControlName: 'direccion',
          formValidators: { 'direccion': [data.direccion, [data.direccion ? Validators.required : Validators.nullValidator]] },
          value: data.direccion
        }
      )
    }
  }

  loadDataConfirmationUpdate(data: Data) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas actualizar la informacion?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'actualizar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.setDataUpdateDB(data)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen a salvo :)',
          'error'
        )
      }
    });
  }

  setDataUpdateDB(data: Data) {
    // console.log('')
    this.initDataTable()
    if (data.nombres !== this.dataUpdate.nombres
      || data.apellidos !== this.dataUpdate.apellidos
      || data.direccion !== this.dataUpdate.direccion) {
      let dataDB = {
        codCliente: this.dataUpdate.codCliente,
        cedula: this.dataUpdate.cedula,
        nombres: data.nombres,
        apellidos: data.apellidos,
        direccion: data.direccion
      }

      this.dataService.updateData('cliente', dataDB, this.dataUpdate.codCliente)
        .then(success => {

          if (success) {

            Swal.fire({
              title: 'Exito!',
              text: 'La informacion a sido guardada',
              icon: 'success',
              confirmButtonText: 'OK!',
            }
            ).then((result) => {

              if (result.isConfirmed) {
                this.initDataTable();
                this.dataUpdate = undefined
              }
            })

          }
          else {

            Swal.fire({
              icon: 'error',
              title: 'Ups...',
              text: 'Algo salió mal!',
              footer: '<a href="">¿Por qué tengo este problema??</a>'
            })

          }
        })
    }

    this.dataUpdate = undefined
    this.initDataTable();

  }


  sendDataContactClient(parametro: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        objeto: parametro
      }
    };

    this.router.navigate(['cliente/contacto-cliente'], navigationExtras)
  }


  setDataCreateDB(form: FormGroup) {
    let data = form.value
    console.log(data)
    
    
    this.dataService.postData('cliente', data)
    .then(success => {

      if (success) {

        Swal.fire({
          title: 'Exito!',
          text: 'La informacion a sido guardada',
          icon: 'success',
          confirmButtonText: 'OK!',
        }
        ).then((result) => {
  
          if (result.isConfirmed) {
            this.initDataTable()
  
            Swal.fire({
              title: 'Confirmar',
              text: '¿Desea agregar un contacto al nuevo cliente?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Agregar',
              cancelButtonText: 'Despues',
              reverseButtons: true
            }).then((result) => {
              if (result.isConfirmed) {
                // this.setDataUpdateDB(data.value)
                // let cliente = this.myData.filter(e => e.cedula === data.cedula)
                // console.log(cliente[0])
                // let parametro = {
                //   cliente: data,
                //   formCreate: false
                // }
  
                this.sendDataContactClient(data)
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                  'Cancelado',
                  'Todo bien :)',
                  'error'
                )
              }
            });
          }
        })

      }
      else{

        Swal.fire({
          icon: 'error',
          title: 'Ups...',
          text: 'Algo salió mal!',
          footer: '<a href="">¿Por qué tengo este problema??</a>'
        })

      }

    })
  }


  confirmeUpdateData(data: FormGroup) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas actualizar la informacion del cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'actualizar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.setDataUpdateDB(data.value)
        data.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen a salvo :)',
          'error'
        )
      }
    });
  }

  confirmeCreateData(data: FormGroup) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas guardar la informacion del cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.setDataCreateDB(data)
        data.reset();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen a salvo :)',
          'error'
        )
      }
    });
  }

  eventCancelFormUpdate() {
    Swal.fire({
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
        Swal.fire(
          'Cancelado',
          'Los datos siguen a salvo :)',
          'error'
        )
      }
    });
  }
}
