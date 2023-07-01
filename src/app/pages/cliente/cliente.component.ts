import { Component, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { tap } from 'rxjs';
import { EventBtnClick, HeaderData, HeaderSearch } from 'src/app/header/header-data';
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
    label: 'Cédula',
    type: 'text',
    placeholder: 'Ingrese la cédula del cliente',
    alert: 'La cédula es obligatorio',
    icon: 'fa-regular fa-address-card',
    formControlName: 'cedula',
    formValidators: { 'cedula': [this.cliente.cedula, [Validators.required]] }
  },
  {
    label: 'Nombres',
    type: 'text',
    placeholder: 'Ingrese el nombre del cliente',
    alert: 'El nombre es obligatorio',
    icon: '',
    formControlName: 'nombres',
    formValidators: { 'nombres': [this.cliente.nombres, [Validators.required]] }
  },
  {
    label: 'Apellidos',
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
    // console.log('')
    this.myData$ = this.dataService
      .getData('cliente')
      .pipe(tap((data: Cliente[]) => (this.myData = data)))
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Número de Cliente', def: 'codCliente', dataKey: 'codCliente' },
      { label: 'Cédula', def: 'Cedula', dataKey: 'cedula' },
      { label: 'Nombres', def: 'Nombre', dataKey: 'nombres' },
      { label: 'Apellidos', def: 'Apellido', dataKey: 'apellidos' },
      { label: 'Dirección', def: 'Direccion', dataKey: 'direccion' }
    ]
  }

  getEventBtnClickHeader() {
    return HeaderData.eventBtnClick;
  }

  

  confirmeDeleteData(data: any) {
    // console.log()
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea eliminar el cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteData(data)
        // data.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen a salvo :)',
          'error'
        )
      }
    });
  }

  deleteData(data:any){
    this.dataService.deleteData('cliente',data.codCliente).then((success)=>{
      if(success){
        Swal.fire({
          title: 'Exito!',
          text: 'El cliente fue eliminado',
          icon: 'success',
          confirmButtonText: 'OK!',
        })
        this.initDataTable()
      }else{
        Swal.fire(
          'Eliminado!',
          'El cliente no puede ser eliminado',
          'error'
        )
      }
    })
  }


  // Probardelete(){

  //   this.dataService.deleteData('cliente',1086).then( success =>{

  //     if(success){

  //       console.log('exito');
  //     }else{

  //       console.log('no exito');

  //     }
  //   })

  // }

  setFormUpdate(data: Cliente) {
    this.dataUpdate = data
    if (this.dataUpdate) {
      this.formClientUpdate = [{
        label: 'Nombres',
        type: 'text',
        placeholder: 'Nuevo nombre del cliente',
        alert: 'El nombre no puede estar vacío',
        icon: '',
        formControlName: 'nombres',
        formValidators: { 'nombres': [data.nombres, [Validators.required]] },
        value: data.nombres
      },
      {
        label: 'Apellidos',
        type: 'text',
        placeholder: 'Nuevo apellido del cliente',
        alert: 'El apellido no puede estar vacío',
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
      text: '¿Estás seguro que deseas actualizar la información?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
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
              text: 'La información a sido guardada',
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
          text: 'La información a sido guardada',
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
                EventBtnClick.setMiVariable(true);
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
      text: '¿Estás seguro que deseas actualizar la información del cliente?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
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
      text: '¿Estás seguro que deseas guardar la información del cliente?',
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
