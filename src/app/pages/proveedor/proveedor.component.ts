import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { tap } from 'rxjs';
import { Validators } from '@angular/forms';
import { HeaderData } from 'src/app/header/header-data';

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
      { label: 'IdProveedor', def: 'idProveedor', dataKey: 'idProveedor' },
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
}
