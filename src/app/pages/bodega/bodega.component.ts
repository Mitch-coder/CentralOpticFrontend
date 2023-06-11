import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { tap } from 'rxjs';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { FormGroup, Validators } from '@angular/forms';
import { HeaderData } from 'src/app/header/header-data';
import Swal from 'sweetalert2';


interface Data {
  idBodega: number;
  nombre: string;
  telefono: string;
  direccion: string;
  correo: string;
}

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent {
  myData: Array<object> = [] ;
  myData$:any;

  tableColumns: TableColumn[] =[]

  dataUpdate: any = undefined

  formCreate: FormData[] = [{
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ingrese el nombre de la bodega',
    alert: 'El nombre es obligatorio',
    icon: '',
    formControlName: 'nombre',
    formValidators: { 'nombre': ['', [Validators.required]] }
  },
  {
    label: 'Dirección',
    type: 'text',
    placeholder: 'Ingrese la dirección de la bodega',
    alert: 'La dirección es obligatorio',
    icon: 'fa-solid fa-map-location-dot',
    formControlName: 'direccion',
    formValidators: { 'direccion': ['', [Validators.required]] }
  },
  {
    label: 'Correo',
    type: 'email',
    placeholder: 'Ingrese el correo de la boodega',
    alert: 'El correo de la bodega es obligatorio',
    icon: 'fa-regular fa-envelope',
    formControlName: 'correo',
    formValidators: { 'correo': ['', [Validators.required,Validators.email]] }
  },
  {
    label: 'Telefono',
    type: 'tel',
    placeholder: 'Ingrese el telefono de la bodega',
    alert: 'El telefono de la bodega es obligatorio',
    icon: 'fa-solid fa-mobile-screen',
    formControlName: 'telefono',
    formValidators: { 'telefono': ['', [Validators.required]] }
  }]

  formUpdate: FormData[] = []

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

     this.myData$ = this.dataService
     .getData('bodega')
     .pipe(tap((data) =>{
      // console.log(data)
      this.myData = data
     }))

     this.setTableColumns();
  }
  
  setTableColumns(){
    this.tableColumns=[
      {label:'IdBodega', def:'idBodega', dataKey:'idBodega'},
      {label:'Nombre', def:'nombre', dataKey:'nombre'},
      {label:'Direccion', def:'direccion', dataKey:'direccion'},
      {label:'Telefono', def:'telefono', dataKey:'telefono'},
      {label:'Correo', def:'correo', dataKey:'correo'}
    ]
  }

  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick)
      this.dataUpdate = undefined
    return HeaderData.eventBtnClick;
  }

  setFormUpdate(data:Data){
    this.dataUpdate = data;
    if(data){
      this.formUpdate = [{
        label: 'Nombre',
        type: 'text',
        placeholder: 'Ingrese el nombre de la bodega',
        alert: 'El nombre es obligatorio',
        icon: '',
        formControlName: 'nombre',
        formValidators: { 'nombre': [data.nombre, [Validators.required]] },
        value: data.nombre
      },
      {
        label: 'Dirección',
        type: 'text',
        placeholder: 'Ingrese la dirección de la bodega',
        alert: 'La dirección es obligatorio',
        icon: 'fa-solid fa-map-location-dot',
        formControlName: 'direccion',
        formValidators: { 'direccion': [data.direccion, [Validators.required]] },
        value:data.direccion
      },
      {
        label: 'Correo',
        type: 'email',
        placeholder: 'Ingrese el correo de la boodega',
        alert: 'El correo de la bodega es obligatorio',
        icon: 'fa-regular fa-envelope',
        formControlName: 'correo',
        formValidators: { 'correo': [data.correo, [Validators.required,Validators.email]] },
        value:data.correo
      },
      {
        label: 'Telefono',
        type: 'tel',
        placeholder: 'Ingrese el telefono de la bodega',
        alert: 'El telefono de la bodega es obligatorio',
        icon: 'fa-solid fa-mobile-screen',
        formControlName: 'telefono',
        formValidators: { 'telefono': [data.telefono, [Validators.required]] },
        value:data.telefono
      }]
    }
  }

  loadDataConfirmationUpdate(data: FormGroup){
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas actualizar la informacion de la bodega?',
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

  setDataUpdateDB(data: Data) {
    // console.log('')
    // this.initDataTable()
    if (data.nombre !== this.dataUpdate.nombre
      || data.correo !== this.dataUpdate.correo
      || data.direccion !== this.dataUpdate.direccion
      || data.telefono !== this.dataUpdate.telefono) {
      let dataDB:Data = {
        idBodega: this.dataUpdate.idBodega,
        nombre: data.nombre,
        telefono: data.telefono,
        direccion: data.direccion,
        correo: data.correo
      }

      if (this.dataService.updateData('bodega', dataDB, this.dataUpdate.idBodega)) {
        Swal.fire({
          title: 'Exito!',
          text: 'La informacion a sido guardada',
          icon: 'success',
          confirmButtonText: 'OK!',
        }
        ).then((result) => {

          if (result.isConfirmed) {
            // this.initDataTable();
            this.dataUpdate=undefined
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
    }
    this.dataUpdate = undefined
    // this.initDataTable();
  }

  eventCancelFormUpdate(data: any) {
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



  setDataCreateDB(form: any) {
    let data = form
    console.log(data)
    if (this.dataService.postData('bodega', data)) {
      Swal.fire({
        title: 'Exito!',
        text: 'La informacion a sido guardada',
        icon: 'success',
        confirmButtonText: 'OK!',
      }
      ).then((result) => {

        if (result.isConfirmed) {
          // this.initDataTable()
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
  }

  loadDataConfirmationCreate(data: any) {
    // console.log(this.cliente)
    // this.valTable = false
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas guardar la bodega?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // this.addDataPhone(data.value)
        this.setDataCreateDB(data.value)
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

}

