import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { tap } from 'rxjs';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { Validators } from '@angular/forms';
import { HeaderData } from 'src/app/header/header-data';


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
    formValidators: { 'correo': ['', [Validators.required, Validators.email]] }
  },
  {
    label: 'Telefono',
    type: 'tel',
    placeholder: 'Ingrese el telefono del Laboratorio',
    alert: 'El telefono del Laboratorio es obligatorio',
    icon: 'fa-solid fa-mobile-screen',
    formControlName: 'telefono',
    formValidators: { 'telefono': ['', [Validators.required]] }
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
      { label: 'IdLaboratorio', def: 'idLaboratorio', dataKey: 'idLaboratorio' },
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
        formValidators: { 'correo': [data.correo, [Validators.required, Validators.email]] },
        value: data.correo
      },
      {
        label: 'Telefono',
        type: 'tel',
        placeholder: 'Ingrese el telefono del Laboratorio',
        alert: 'El telefono del Laboratorio es obligatorio',
        icon: 'fa-solid fa-mobile-screen',
        formControlName: 'telefono',
        formValidators: { 'telefono': [data.telefono, [Validators.required]] },
        value: data.telefono
      }]
    }
  }

}
