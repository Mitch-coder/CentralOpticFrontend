import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { tap } from 'rxjs';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { FormGroup, Validators } from '@angular/forms';
import { HeaderData } from 'src/app/header/header-data';
import Swal from 'sweetalert2';


interface Data {
  idLaboratorio: number;
  nombre: string;
  telefono: string;
  direccion: string;
  correo: string;
}

@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.css']
})
export class LaboratorioComponent {

  myData: Array<object> = [];
  myData$: any;

  tableColumns: TableColumn[] = []

  dataUpdate: any = undefined

  formCreate: FormData[] = [{
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ingrese el nombre del Laboratorio',
    alert: 'El nombre del Laboratorio es obligatorio',
    icon: '',
    formControlName: 'nombre',
    formValidators: { 'nombre': ['', [Validators.required]] }
  },
  {
    label: 'Dirección',
    type: 'text',
    placeholder: 'Ingrese la dirección del Laboratorio',
    alert: 'La dirección del Laboratorio es obligatorio',
    icon: 'fa-solid fa-map-location-dot',
    formControlName: 'direccion',
    formValidators: { 'direccion': ['', [Validators.required]] }
  },
  {
    label: 'Correo',
    type: 'email',
    placeholder: 'Ingrese el correo del Laboratorio',
    alert: 'El correo del Laboratorio es obligatorio',
    icon: 'fa-regular fa-envelope',
    formControlName: 'correo',
    formValidators: { 'correo': ['', [Validators.nullValidator, Validators.email]] }
  },
  {
    label: 'Telefono',
    type: 'tel',
    placeholder: 'Ingrese el telefono del Laboratorio',
    alert: 'El telefono del Laboratorio es obligatorio',
    icon: 'fa-solid fa-mobile-screen',
    formControlName: 'telefono',
    formValidators: { 'telefono': ['', [Validators.nullValidator]] }
  }]

  formUpdate: FormData[] = []

  constructor(private dataService: MyDataServices) { }
  ngOnInit(): void {

    this.myData$ = this.dataService
      .getData('laboratorio')
      .pipe(tap((data) => {
        // console.log(data)
        this.myData = data
      }))

    this.setTableColumns();
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Identificador', def: 'idLaboratorio', dataKey: 'idLaboratorio' },
      { label: 'Nombre', def: 'nombre', dataKey: 'nombre' },
      { label: 'Correo', def: 'correo', dataKey: 'correo' },
      { label: 'Telefono', def: 'telefono', dataKey: 'telefono' },
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
        placeholder: 'Ingrese el nombre del Laboratorio',
        alert: 'El nombre del Laboratorio es obligatorio',
        icon: '',
        formControlName: 'nombre',
        formValidators: { 'nombre': [data.nombre, [Validators.required]] },
        value: data.nombre
      },
      {
        label: 'Dirección',
        type: 'text',
        placeholder: 'Ingrese la dirección del Laboratorio ',
        alert: 'La dirección del Laboratorio es obligatorio',
        icon: 'fa-solid fa-map-location-dot',
        formControlName: 'direccion',
        formValidators: { 'direccion': [data.direccion, [Validators.required]] },
        value: data.direccion
      },
      {
        label: 'Correo',
        type: 'email',
        placeholder: 'Ingrese el correo del Laboratorio',
        alert: 'El correo del Laboratorio es obligatorio',
        icon: 'fa-regular fa-envelope',
        formControlName: 'correo',
        formValidators: { 'correo': [data.correo, [Validators.nullValidator, Validators.email]] },
        value: data.correo
      },
      {
        label: 'Telefono',
        type: 'tel',
        placeholder: 'Ingrese el telefono del Laboratorio',
        alert: 'El telefono del Laboratorio es obligatorio',
        icon: 'fa-solid fa-mobile-screen',
        formControlName: 'telefono',
        formValidators: { 'telefono': [data.telefono, [Validators.nullValidator]] },
        value: data.telefono
      }]
    }
  }

  loadConfirmationDataUpdate(data:FormGroup) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas guardar los datos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveDataUpdate(data.value)
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

  saveDataUpdate(data:any){
    let laboratorio:Data = {
      idLaboratorio: this.dataUpdate.idLaboratorio,
      nombre: data.nombre,
      telefono: data.telefono,
      direccion: data.direccion,
      correo: data.correo
    }

    this.dataService.updateData('laboratorio',laboratorio,this.dataUpdate.idLaboratorio).then((success)=>{
      if(success){
        Swal.fire(
          'Exito!',
          'La informacion a sido actualizado con exito',
          'success'
        )
        this.dataUpdate = undefined
        // this.resetData()
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Ups...',
          text: 'Algo salió mal!',
          footer: '<a href="">¿Por qué tengo este problema??</a>'
        })
      }
    })
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

  loadConfirmationDataCreate(data:FormGroup) {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas guardar los datos?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveDataCreate(data)
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

  saveDataCreate(data:FormGroup){
    let dataV = data.value

    let laboratorio= {
      // idLaboratorio: this.dataUpdate.idLaboratorio,
      nombre: dataV.nombre,
      telefono: dataV.telefono,
      direccion: dataV.direccion,
      correo: dataV.correo
    }

    this.dataService.postData('laboratorio',laboratorio).then((success)=>{
      if(success){
        Swal.fire(
          'Exito!',
          'La informacion a sido actualizado con exito',
          'success'
        )
        // this.dataUpdate = undefined
        data.reset()
        // this.resetData()
      }else{
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
