import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { tap } from 'rxjs';
import { FormGroup, Validators } from '@angular/forms';
import { HeaderData } from 'src/app/header/header-data';
import Swal from 'sweetalert2';

interface Data {
  idProveedor: number;
  nombre: string;
  propietario: string;
  direccion: string;
}

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent {


  myData: Array<object> = [];
  myData$: any;

  tableColumns: TableColumn[] = []

  dataUpdate: any = undefined
  formUpdate: FormData[] = []

  formCreate: FormData[] = [{
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ingrese el nombre del proveedor',
    alert: 'El nombre es obligatorio',
    icon: '',
    formControlName: 'nombre',
    formValidators: { 'nombre': ['', [Validators.required]] }
  },
  {
    label: 'Propietario',
    type: 'text',
    placeholder: 'Ingrese el propietario',
    alert: 'El propietario es obligatorio',
    icon: 'fa-solid fa-user-lock',
    formControlName: 'propietario',
    formValidators: { 'propietario': ['', [Validators.required]] }
  },
  {
    label: 'Dirección',
    type: 'text',
    placeholder: 'Ingrese la dirección',
    alert: 'La dirección es obligatorio',
    icon: 'fa-solid fa-map-location-dot',
    formControlName: 'direccion',
    formValidators: { 'direccion': ['', [Validators.required]] }
  }]
  // <i class=""></i>

  constructor(private dataService: MyDataServices) { }
  ngOnInit(): void {

    this.myData$ = this.dataService
      .getData('proveedor')
      .pipe(tap((data) => {
        console.log(data)
        this.myData = data
      }))

    this.setTableColumns();
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Identificador', def: 'idProveedor', dataKey: 'idProveedor' },
      { label: 'Nombre', def: 'nombre', dataKey: 'nombre' },
      { label: 'Propietario', def: 'propietario', dataKey: 'propietario' },
      { label: 'Direccion', def: 'direccion', dataKey: 'direccion' }
    ]
  }

  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick)
      this.dataUpdate = undefined
    return HeaderData.eventBtnClick;
  }

  setFormUpdate(data: Data) {
    this.dataUpdate = data;
    if (data) {
      this.formUpdate = [{
        label: 'Nombre',
        type: 'text',
        placeholder: 'Ingrese el nombre del proveedor',
        alert: 'El nombre es obligatorio',
        icon: '',
        formControlName: 'nombre',
        formValidators: { 'nombre': [data.nombre, [Validators.required]] },
        value: data.nombre
      },
      {
        label: 'Propietario',
        type: 'text',
        placeholder: 'Ingrese el propietario',
        alert: 'El propietario es obligatorio',
        icon: 'fa-solid fa-user-lock',
        formControlName: 'propietario',
        formValidators: { 'propietario': [data.propietario, [Validators.required]] },
        value: data.propietario
      },
      {
        label: 'Dirección',
        type: 'text',
        placeholder: 'Ingrese la dirección',
        alert: 'La dirección es obligatorio',
        icon: 'fa-solid fa-map-location-dot',
        formControlName: 'direccion',
        formValidators: { 'direccion': [data.direccion, [Validators.required]] },
        value: data.direccion
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

  saveDataUpdate(data:any){
    let proveedor:Data = {
      idProveedor: this.dataUpdate.idProveedor,
      nombre: data.nombre,
      propietario: data.propietario,
      direccion: data.direccion
    }

    this.dataService.updateData('proveedor',proveedor,this.dataUpdate.idProveedor).then((success) => {
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
          footer: '<a href="">¿Por qué tengo este problema??</a>'
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
    let proveedor = {
      nombre: data.nombre,
      propietario: data.propietario,
      direccion: data.direccion
    }

    this.dataService.postData('proveedor', proveedor).then((success) => {
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
              text: '¿Desea agregar un contacto al nuevo proveedor?',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Agregar',
              cancelButtonText: 'Despues',
              reverseButtons: true
            }).then((result) => {
              if (result.isConfirmed) {
                // this.sendDataContactClient(this.dataUpdate)
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
