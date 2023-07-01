import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import Swal from 'sweetalert2';
import { FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { EventBtnClick, HeaderData } from 'src/app/header/header-data';

interface Empleado {
  numEmpleado: number;
  apellidos: string;
  direccion: string;
  nombres: string;
}


@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent {
  myData: Empleado[] = [];
  myData$: any;
  dataUpdate: any = undefined;

  tableColumns: TableColumn[] = []

  Empleado: Empleado = {
    numEmpleado: 0,
    apellidos: '',
    direccion: '',
    nombres: ''
  }

  constructor(private dataService: MyDataServices, private router: Router) { }

  ngOnInit(): void {

    this.myData$ = this.dataService
      .getData('empleado')
      .pipe(tap((data) => {
        this.myData = data
      }))

    this.setTableColumns();
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Número de Empleado', def: 'NumEmpleado', dataKey: 'numEmpleado' },
      { label: 'Nombres', def: 'nombres', dataKey: 'nombres' },
      { label: 'Apellidos', def: 'apellidos', dataKey: 'apellidos' },
      { label: 'Dirección', def: 'direccion', dataKey: 'direccion' }
    ]
  }

  initDataTable() {
    this.myData$ = this.dataService
      .getData('empleado')
      .pipe(tap((data) => {
        this.myData = data
      }))
  }

  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick) {
      if (this.dataUpdate || this.Empleado.numEmpleado !== 0) {
        this.resetData()
      }
    }

    return HeaderData.eventBtnClick;
  }


  confirmeDeleteData(data: any) {
    // console.log()
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea eliminar el empleado?',
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

  deleteData(data: any) {
    this.dataService.deleteData('empleado', data.numEmpleado).then((success) => {
      if (success) {
        Swal.fire({
          title: 'Exito!',
          text: 'El empleado fue eliminado',
          icon: 'success',
          confirmButtonText: 'OK!',
        })
        this.initDataTable()
      } else {
        Swal.fire(
          'Eliminado!',
          'El empleado no puede ser eliminado, ya que tiene registro a su nombre',
          'error'
        )
      }
    })
  }





  formCreate: FormData[] = [
    {
      label: 'Nombre',
      type: 'text',
      placeholder: 'Ingrese el nombre del cliente',
      alert: 'El nombre es obligatorio',
      icon: '',
      formControlName: 'nombres',
      formValidators: { 'nombres': [this.Empleado.nombres, [Validators.required]] }
    },
    {
      label: 'Apellido',
      type: 'text',
      placeholder: 'Ingrese el apellido del cliente',
      alert: 'El apellido es obligatorio',
      icon: '',
      formControlName: 'apellidos',
      formValidators: { 'apellidos': [this.Empleado.apellidos, [Validators.required]] }
    },
    {
      label: 'Dirección',
      type: 'text',
      placeholder: 'Ingrese la dirección del cliente',
      alert: 'La dirección es obligatorio',
      icon: 'fa-solid fa-map-location-dot',
      formControlName: 'direccion',
      formValidators: { 'direccion': [this.Empleado.direccion,] }
    }]


  form: FormData[] = [
    {
      label: 'Nombre',
      type: 'text',
      placeholder: 'Ingrese el nombre del empleado',
      alert: 'El nombre es obligatorio',
      icon: '',
      formControlName: 'nombres',
      formValidators: { 'nombres': [this.Empleado.nombres, [Validators.required]] }
    },
    {
      label: 'Apellido',
      type: 'text',
      placeholder: 'Ingrese el apellido del empleado',
      alert: 'El apellido es obligatorio',
      icon: '',
      formControlName: 'apellidos',
      formValidators: { 'apellidos': [this.Empleado.apellidos, [Validators.required]] }
    },
    {
      label: 'Dirección',
      type: 'text',
      placeholder: 'Ingrese la dirección del empleado',
      alert: 'La dirección es obligatorio',
      icon: 'fa-solid fa-map-location-dot',
      formControlName: 'direccion',
      formValidators: { 'direccion': [this.Empleado.direccion, [Validators.required]] }
    }]

  resultTableDataUpdate(data: Empleado) {
    this.dataUpdate = data
    if (data) {
      let empleado = this.myData.find(e => e.numEmpleado == data.numEmpleado)
      // console.log(empleado)
      if (empleado) {
        this.Empleado = empleado
        console.log(this.Empleado)
      }
      this.form = [
        {
          label: 'Nombre',
          type: 'text',
          placeholder: 'Ingrese el nombre del empleado',
          alert: 'El nombre es obligatorio',
          icon: '',
          formControlName: 'nombres',
          formValidators: { 'nombres': [this.Empleado.nombres, [Validators.required]] },
          value: this.Empleado.nombres
        },
        {
          label: 'Apellido',
          type: 'text',
          placeholder: 'Ingrese el apellido del empleado',
          alert: 'El apellido es obligatorio',
          icon: '',
          formControlName: 'apellidos',
          formValidators: { 'apellidos': [this.Empleado.apellidos, [Validators.required]] },
          value: this.Empleado.apellidos
        },
        {
          label: 'Dirección',
          type: 'text',
          placeholder: 'Ingrese la dirección del empleado',
          alert: 'La dirección es obligatorio',
          icon: 'fa-solid fa-map-location-dot',
          formControlName: 'direccion',
          formValidators: { 'direccion': [this.Empleado.direccion, [Validators.required]] },
          value: this.Empleado.direccion
        }]
    }
  }

  loadConfirmationDataUpdate(form: FormGroup) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea actualizar la informacion?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveDataUpdate(form.value)
        form.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen asalvo:)',
          'error'
        )
      }
    });
  }

  saveDataUpdate(data: any) {
    let empleado = {
      numEmpleado: this.dataUpdate.numEmpleado,
      apellidos: data.apellidos,
      direccion: data.direccion,
      nombres: data.nombres
    }

    this.dataService.updateData('empleado', empleado, this.dataUpdate.numEmpleado).then((success) => {
      if (success) {
        Swal.fire({
          title: 'Exito!',
          text: 'La informacion a sido guardada',
          icon: 'success',
          confirmButtonText: 'OK!',
        })
        this.resetData()

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ups...',
          text: 'Algo salió mal!',
          //footer: '<a href="">¿Por qué tengo este problema??</a>'
        })
      }
    })
  }

  cancelFormUpdate() {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea cerrar el formulario?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cerrar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataUpdate = undefined
        this.resetData()
        // this.formUpdateData.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen asalvo:)',
          'error'
        )
      }
    });
  }

  resetData() {
    this.dataUpdate = undefined
    this.Empleado = {
      numEmpleado: 0,
      apellidos: '',
      direccion: '',
      nombres: ''
    }
    this.form = [
      {
        label: 'Nombre',
        type: 'text',
        placeholder: 'Ingrese el nombre del empleado',
        alert: 'El nombre es obligatorio',
        icon: '',
        formControlName: 'nombres',
        formValidators: { 'nombres': [this.Empleado.nombres, [Validators.required]] },
        value: this.Empleado.nombres
      },
      {
        label: 'Apellido',
        type: 'text',
        placeholder: 'Ingrese el apellido del empleado',
        alert: 'El apellido es obligatorio',
        icon: '',
        formControlName: 'apellidos',
        formValidators: { 'apellidos': [this.Empleado.apellidos, [Validators.required]] },
        value: this.Empleado.apellidos
      },
      {
        label: 'Dirección',
        type: 'text',
        placeholder: 'Ingrese la dirección del empleado',
        alert: 'La dirección es obligatorio',
        icon: 'fa-solid fa-map-location-dot',
        formControlName: 'direccion',
        formValidators: { 'direccion': [this.Empleado.direccion, [Validators.required]] },
        value: this.Empleado.direccion
      }]
  }

  sendDataContactClient(parametro: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        objeto: parametro
      }
    };

    this.router.navigate(['empleado/contacto-empleado'], navigationExtras)
  }

  loadConfirmationDataCreate(form: FormGroup) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea guardar la informacion?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveDataCreate(form.value)
        // this.formUpdateData.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen asalvo:)',
          'error'
        )
      }
    });
  }

  saveDataCreate(data: any) {
    let empleado = {
      apellidos: data.apellidos,
      direccion: data.direccion,
      nombres: data.nombres
    }

    this.dataService.postData('empleado', empleado).then((success) => {
      if (success) {
        Swal.fire({
          title: 'Exito!',
          text: 'La informacion a sido guardada',
          icon: 'success',
          confirmButtonText: 'OK!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.resetData()
            Swal.fire({
              title: 'Confirmar',
              text: '¿Desea agregar un contacto al nuevo empleado?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Agregar',
              cancelButtonText: 'Despues',
              reverseButtons: true
            }).then((result) => {
              if (result.isConfirmed) {
                this.sendDataContactClient(this.dataUpdate)
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                  'Cancelado',
                  'Todo bien :)',
                  'error'
                )
                EventBtnClick.setMiVariable(true);
              }
            });
          }
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ups...',
          text: 'Algo salió mal!',
          footer: '<a href="">¿Por qué tengo este problema??</a>'
        })
      }
    })
  }



}
