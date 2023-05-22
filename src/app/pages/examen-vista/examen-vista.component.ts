import { Component, TemplateRef } from '@angular/core';
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

@Component({
  selector: 'app-examen-vista',
  templateUrl: './examen-vista.component.html',
  styleUrls: ['./examen-vista.component.css']
})
export class ExamenVistaComponent {
  myData: any[] = [];
  myData$: any;

  tableColumns: TableColumn[] = []

  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
  // datePattern = /^(0[1-9]|1\d|2\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  maxDate= new Date()

  fechaExamen: FechaExamen[] = []
  cliente: Cliente[] = []

  selectedValue: string = '';

  Cliente: string = ''
  FechaExamen = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(new Date);
  OjoIzquierdo: number = 0;
  OjoDerecho: number = 0;
  DescripLenteIzq: string = '';
  DescripLenteDer: string = '';

  formCreate: FormGroup = this.formBuilder.group(
    {
      'cliente': [this.Cliente, Validators.required],
      'fechaExamen': [this.FechaExamen, [Validators.required]],
      'ojoIzquierdo': [this.OjoIzquierdo, Validators.required],
      'ojoDerecho': [this.OjoDerecho, Validators.required],
      'descripLenteIzq': [this.DescripLenteIzq, Validators.required],
      'descripLenteDer': [this.DescripLenteDer, Validators.required]
    }
  );

  dataUpdate: any = undefined
  formUpdate: FormData[] = []
  form!: FormGroup;

  //cliente
  private matDialogRef!: MatDialogRef<DialogComponent>;

  formClient: FormData[] = [{
    label: 'Cedula',
    type: 'text',
    placeholder: 'Ingrese la cedula del cliente',
    alert: 'La cedula es obligatorio',
    icon: '',
    formControlName: 'cedula',
    formValidators: { 'cedula': ['', [Validators.required]] }
  },
  {
    label: 'Nombre',
    type: 'text',
    placeholder: 'Ingrese el nombre del cliente',
    alert: 'El nombre es obligatorio',
    icon: '',
    formControlName: 'nombres',
    formValidators: { 'nombres': ['', [Validators.required]] }
  },
  {
    label: 'Apellido',
    type: 'text',
    placeholder: 'Ingrese el apellido del cliente',
    alert: 'El apellido es obligatorio',
    icon: '',
    formControlName: 'apellidos',
    formValidators: { 'apellidos': ['', [Validators.required]] }
  },
  {
    label: 'Dirección',
    type: 'text',
    placeholder: 'Ingrese la dirección del cliente',
    alert: 'La dirección es obligatorio',
    icon: '',
    formControlName: 'direccion',
    formValidators: { 'direccion': ['', [Validators.required]] }
  }]

  constructor(private dataService: MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService) { }


  onDateChange(event: any) {
    this.FechaExamen = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(new Date(this.FechaExamen) );
  }

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

        console.log(this.cliente)

        examenVista.forEach(element => {
          let client = this.cliente.filter(e => e.codCliente == element.codCliente)
          let fecha = this.fechaExamen.filter(e => e.idFechaExamen == element.idFechaExamen)

          let date: Date = new Date(fecha[0].fechaExamen)
          let formatoFecha = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
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
    if (!HeaderData.eventBtnClick)
      this.dataUpdate = undefined
    return HeaderData.eventBtnClick;
  }


  setFormUpdate(data: Data | undefined) {
    this.dataUpdate = data

    if (data) {

    }
  }

  formGet(fr: string) {
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
    console.log(client)
    let c: Cliente = {
      codCliente: 30,
      cedula: client.cedula,
      nombres: client.nombres,
      apellidos: client.apellidos,
      direccion: client.direccion
    }
    this.cliente.push(c)
    this.Cliente = c.nombres;

    console.log(this.Cliente)
    this.matDialogRef.close();
  }
}
