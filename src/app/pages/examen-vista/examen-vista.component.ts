import { Component, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { elementAt, map, mergeMap, tap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HeaderData } from 'src/app/header/header-data';
import { FormData } from 'src/app/modules/form/components/form/form-data';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';
// import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

import * as moment from 'moment';
import {default as _rollupMoment} from 'moment';
import { DateAdapter } from '@angular/material/core';



// const moment = _rollupMoment || _moment;

interface ExamenVista {
  numExamen: number;
  codCliente: number;
  idFechaExamen: number;
  ojoIzquierdo: number;
  ojoDerecho: number;
  descripLenteIzq: string;
  descripLenteDer: string;
}

interface FechaExamen {
  idFechaExamen: number;
  fechaExamen: string;
}

interface Cliente {
  codCliente: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  direccion: string;
}

interface Data {
  cliente: string;
  fechaExamen: Date;
  ojoIzquierdo: number;
  ojoDerecho: number;
  descripLenteIzq: string;
  descripLenteDer: string;
}

export function timeValidator(control: FormControl): { [key: string]: boolean } | null {
  const opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
  const valid = new Intl.DateTimeFormat('es-ES', opcionesFormato).format(new Date);

  return valid ? null : { invalidTime: true };
}


@Component({
  selector: 'app-examen-vista',
  templateUrl: './examen-vista.component.html',
  styleUrls: ['./examen-vista.component.css'],
  providers: [
    // { provide: DateAdapter, useClass: MomentDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: {
    //     parse: {
    //       dateInput: 'LL',
    //     },
    //     display: {
    //       dateInput: 'LL',
    //       monthYearLabel: 'MMM YYYY',
    //       dateA11yLabel: 'LL',
    //       monthYearA11yLabel: 'MMMM YYYY',
    //     },
    //   },
    // },
  ],
})
export class ExamenVistaComponent {
  myData: any[] = [];
  myData$: any;

  tableColumns: TableColumn[] = []

  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
  selectedDate: Date = new Date();
  formattedDate: string = ''
  // datePattern = /^(0[1-9]|1\d|2\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  maxDate= new Date()

  fechaExamen: FechaExamen[] = []
  cliente: Cliente[] = []

  selectedValue: string = '';

  Cliente: Cliente = {
    codCliente: -1,
    cedula: '',
    nombres: '',
    apellidos: '',
    direccion: ''
  }

  FechaExamen:string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(new Date);
  OjoIzquierdo: number = 0;
  OjoDerecho: number = 0;
  DescripLenteIzq: string = '';
  DescripLenteDer: string = '';

  formCreate: FormGroup = this.formBuilder.group(
    {
      'cliente': [this.Cliente, Validators.required],
      'fechaExamen': [moment([2017, 0, 1]), [Validators.required]],
      'ojoIzquierdo': [this.OjoIzquierdo, Validators.required],
      'ojoDerecho': [this.OjoDerecho, Validators.required],
      'descripLenteIzq': [this.DescripLenteIzq, Validators.required],
      'descripLenteDer': [this.DescripLenteDer, Validators.required]
    }
  );

  dataUpdate: any = undefined
  formUpdate: any;

  form!: FormGroup

  //cliente
  private matDialogRef!: MatDialogRef<DialogComponent>;

  formClient: FormData[] = [{
    label: 'Cedula',
    type: 'text',
    placeholder: 'Ingrese la cedula del cliente',
    alert: 'La cedula es obligatorio',
    icon: '',
    formControlName: 'cedula',
    formValidators: { 'cedula': [this.Cliente.cedula, [Validators.required]] }
  },
  {
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ingrese el nombre del cliente',
    alert: 'El nombre es obligatorio',
    icon: '',
    formControlName: 'nombres',
    formValidators: { 'nombres': [this.Cliente.nombres, [Validators.required]] }
  },
  {
    label: 'Apellido',
    type: 'text',
    placeholder: 'Ingrese el apellido del cliente',
    alert: 'El apellido es obligatorio',
    icon: '',
    formControlName: 'apellidos',
    formValidators: { 'apellidos': [this.Cliente.apellidos, [Validators.required]] }
  },
  {
    label: 'Dirección',
    type: 'text',
    placeholder: 'Ingrese la dirección del cliente',
    alert: 'La dirección es obligatorio',
    icon: '',
    formControlName: 'direccion',
    formValidators: { 'direccion': [this.Cliente.direccion, [Validators.required]] }
  }]

  constructor(private dataService: MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    /*private datePipe: DatePipe*/) { }


  // onDateChange(event: any) {
  //   this.FechaExamen = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(new Date(this.FechaExamen) );
  // }

  ngOnInit(): void {

    this.myData$ = forkJoin(
      this.dataService.getData('examenvista'),
      this.dataService.getData('fechaexamen'),
      this.dataService.getData('cliente')
    ).pipe(
      map((data: any[]) => {
        let examenVista: ExamenVista[] = data[0];
        this.fechaExamen = data[1];
        this.cliente = data[2];

        // console.log(this.cliente)

        examenVista.forEach(element => {
          let client = this.cliente.filter(e => e.codCliente == element.codCliente)
          let fecha = this.fechaExamen.filter(e => e.idFechaExamen == element.idFechaExamen)

          let date: Date = new Date(fecha[0].fechaExamen)
          let formatoFecha:string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
          this.myData.push({
            numExamen: element.numExamen,
            cliente: client[0].nombres,
            fechaExamen: formatoFecha,
            ojoIzquierdo: element.ojoIzquierdo,
            ojoDerecho: element.ojoDerecho,
            descripLenteIzq: element.descripLenteIzq,
            descripLenteDer: element.descripLenteDer
          })
        })
        return this.myData;
      })
    )

    this.setTableColumns();
  }

  // Método para formatear la fecha personalizada
  private formatCustomDate(date: Date): string {
    const formatter = new Intl.DateTimeFormat('es', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return formatter.format(date);
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Numero Examen', def: 'numExamen', dataKey: 'numExamen' },
      { label: 'Cliente', def: 'cliente', dataKey: 'cliente' },
      { label: 'Fecha Examen', def: 'fechaExamen', dataKey: 'fechaExamen' },
      { label: 'Ojo Izquierdo', def: 'ojoIzquierdo', dataKey: 'ojoIzquierdo' },
      { label: 'Ojo Derecho', def: 'ojoDerecho', dataKey: 'ojoDerecho' },
      { label: 'Descripción Lente Izq', def: 'descripLenteIzq', dataKey: 'descripLenteIzq' },
      { label: 'Descripción Lente Der', def: 'descripLenteDer', dataKey: 'descripLenteDer' }
    ]
  }

  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick){
      this.dataUpdate = undefined
      this.Cliente = {
        codCliente: -1,
        cedula: '',
        nombres: '',
        apellidos: '',
        direccion: ''
      }

      this.formCreate = this.formBuilder.group(
        {
          'cliente': ['', Validators.required],
          'fechaExamen': ['', [Validators.required]],
          'ojoIzquierdo': ['', Validators.required],
          'ojoDerecho': ['', Validators.required],
          'descripLenteIzq': ['', Validators.required],
          'descripLenteDer': ['', Validators.required]
        }
      );
    
    }
    return HeaderData.eventBtnClick;
  }


  setFormUpdate(data: Data | undefined) {
    this.dataUpdate = data

    if (data) {
      let f = data.fechaExamen
      console.log(moment(f))
      let c = this.cliente.filter(f => data.cliente == f.nombres)
      this.Cliente=c[0]
      // this.FechaExamen =data.fechaExamen.toISOString();
      this.OjoIzquierdo = data.ojoIzquierdo;
      this.OjoDerecho = data.ojoDerecho;
      this.DescripLenteIzq = data.descripLenteIzq;
      this.DescripLenteDer = data.descripLenteDer;
      this.formCreate = this.formBuilder.group(
        {
          'cliente': [this.Cliente, Validators.required],
          'fechaExamen': [this.formattedDate, [Validators.required]],
          'ojoIzquierdo': [this.OjoIzquierdo, Validators.required],
          'ojoDerecho': [this.OjoDerecho, Validators.required],
          'descripLenteIzq': [this.DescripLenteIzq, Validators.required],
          'descripLenteDer': [this.DescripLenteDer, Validators.required]
        }
      );
    }
  }

  formGet(fr: string) {
    // console.log(this.formCreate.get(fr) as FormControl)
    return this.formCreate.get(fr) as FormControl;
  }

  // dialogo reutilizable
  openDialogWithTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template, 
    });

    this.matDialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog With Template Close', res);
    });
  }

  onSave(client: Cliente) {
    this.cliente.push(client)
    this.Cliente = client;

    this.matDialogRef.close();
  }

  formatDate(date: Date) {
    this.formattedDate =  new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
  }

  onDateSelected(event: any) {
    console.log(new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(event.value))
    return new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(event.value);
  }
}
