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
import Swal from 'sweetalert2';
import { NavigationExtras, Router } from '@angular/router';

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
  styleUrls: ['./examen-vista.component.css'],
  providers:/*[
    { provide: MAT_DATE_FORMATS, useValue: GRI_DATE_FORMATS },
  ] */
    [

    ],
})
export class ExamenVistaComponent {
  myData: any[] = [];
  myData$: any;

  tableColumns: TableColumn[] = []

  opcionesFormato: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: '2-digit' };
  selectedDate: Date = new Date();
  formattedDate: string = '00 de 00 de 0000'
  // datePattern = /^(0[1-9]|1\d|2\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
  maxDate = new Date()

  fechaExamen: FechaExamen[] = []
  // cliente: Cliente[] = []

  selectedValue: string = '';

  // Cliente: Cliente = {
  //   codCliente: 1,
  //   cedula: '',
  //   nombres: '',
  //   apellidos: '',
  //   direccion: ''
  // }

  // FechaExamen:string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(new Date);
  OjoIzquierdo: number = 0;
  OjoDerecho: number = 0;
  DescripLenteIzq: string = '';
  DescripLenteDer: string = '';

  formCreate: FormGroup = this.formBuilder.group(
    {
      // 'cliente': [this.Cliente, Validators.required],
      // 'fechaExamen': [this.formattedDate, ],
      // 'ojoIzquierdo': [this.OjoIzquierdo, Validators.required],
      // 'ojoDerecho': [this.OjoDerecho, Validators.required],
      // 'descripLenteIzq': [this.DescripLenteIzq, Validators.required],
      // 'descripLenteDer': [this.DescripLenteDer, Validators.required]
    }
  );

  dataUpdate: any = undefined
  formUpdate: any;

  inputFormDataPitcker = true;

  form!: FormGroup

  //cliente
  private matDialogRef!: MatDialogRef<DialogComponent>;

  

  constructor(private dataService: MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private router: Router
    /*private datePipe: DatePipe*/) { }


  // onDateChange(event: any) {
  //   this.FechaExamen = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(new Date(this.FechaExamen) );
  // }
  examenVistaList: ExamenVista[] = []
  fechaExamenList: FechaExamen[] = []
  clienteList: Cliente[] = []

  ExamenVista: ExamenVista = {
    numExamen: 0,
    codCliente: 0,
    idFechaExamen: 0,
    ojoIzquierdo: 0,
    ojoDerecho: 0,
    descripLenteIzq: '',
    descripLenteDer: ''
  }

  FechaExamen: FechaExamen = {
    idFechaExamen: 0,
    fechaExamen: ''
  }

  Cliente: Cliente = {
    codCliente: 0,
    cedula: '',
    nombres: '',
    apellidos: '',
    direccion: ''
  }

  formClient: FormData[] = [
    {
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
    }
  ]

  ngOnInit(): void {
    let fecha = new Date();
    fecha.setHours(0,0,0,0)
    console.log(fecha)

    // let fechaExamen ={
    //   FechaExamen : fecha
    // }
    // this.dataService.postData('fechaexamen',fechaExamen)


    this.myData$ = forkJoin(
      this.dataService.getData('examenvista'),
      this.dataService.getData('fechaexamen'),
      this.dataService.getData('cliente')
    ).pipe(
      map((data: any[]) => {
        this.examenVistaList = data[0];
        this.fechaExamenList = data[1];
        this.clienteList = data[2];
        this.myData = []

        console.log(this.fechaExamenList)
        let fec = new Date(this.fechaExamenList[20].fechaExamen)
        console.log( fec.toString() == fecha.toString())

        // console.log(this.cliente)

        this.examenVistaList.forEach(element => {
          let client = this.clienteList.filter(e => e.codCliente == element.codCliente)
          let fecha = this.fechaExamenList.filter(e => e.idFechaExamen == element.idFechaExamen)

          let date: Date = new Date(fecha[0].fechaExamen)
          let formatoFecha: string = new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(date);
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
  // private formatCustomDate(date: Date): string {
  //   const formatter = new Intl.DateTimeFormat('es', { year: 'numeric', month: '2-digit', day: '2-digit' });
  //   return formatter.format(date);
  // }

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
    if (!HeaderData.eventBtnClick) {
      this.dataUpdate = undefined
      // this.setResetData()
      this.setDataCreate()
      // this.Cliente = {
      //   codCliente: 0,
      //   cedula: '',
      //   nombres: '',
      //   apellidos: '',
      //   direccion: ''
      // }
      // this.formattedDate = new Intl.DateTimeFormat('es', this.opcionesFormato).format(new Date());
      // this.OjoIzquierdo = 0.0;
      // this.OjoDerecho = 0.0;
      // this.DescripLenteIzq = '';
      // this.DescripLenteDer = '';

    }
    this.inputFormDataPitcker = !this.inputFormDataPitcker;
    return HeaderData.eventBtnClick;
  }


  setFormUpdate(data: Data | undefined) {
    this.dataUpdate = data

    if (data) {
      let f = data.fechaExamen
      // console.log(moment(f))
      // let c = this.cliente.filter(f => data.cliente == f.nombres)
      // this.Cliente = c[0]
      // const fechaNormal = moment(data.fechaExamen, 'DD [de] MMMM [de] YYYY').toDate();
      // this.formatDate(fechaNormal)
      // console.log(data.fechaExamen)
      this.formattedDate = data.fechaExamen.toString()
      this.OjoIzquierdo = data.ojoIzquierdo;
      this.OjoDerecho = data.ojoDerecho;
      this.DescripLenteIzq = data.descripLenteIzq;
      this.DescripLenteDer = data.descripLenteDer;
      // this.formCreate = this.formBuilder.group(
      //   {
      //     'cliente': [this.Cliente, Validators.required],
      //     'fechaExamen': [this.formattedDate, [Validators.required]],
      //     'ojoIzquierdo': [this.OjoIzquierdo, Validators.required],
      //     'ojoDerecho': [this.OjoDerecho, Validators.required],
      //     'descripLenteIzq': [this.DescripLenteIzq, Validators.required],
      //     'descripLenteDer': [this.DescripLenteDer, Validators.required]
      //   }
      // );
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
      // console.log('Dialog With Template Close', res);
    });
  }

  onSave(client: FormGroup) {
    // this.cliente.push(client)
    // this.Cliente = client;
    

    this.Cliente = client.value

    console.log(this.Cliente)

    this.matDialogRef.close();
  }

  // formatDate(date: Date) {
  //   console.log(date)
  //   this.formattedDate =  new Intl.DateTimeFormat('es', this.opcionesFormato).format(date);
  // }

  onDateSelected(event: any) {
    // console.log(new Intl.DateTimeFormat('es', this.opcionesFormato).format(event.value))
    // return new Intl.DateTimeFormat('es-ES', this.opcionesFormato).format(event.value);
  }

  /*-----------------------------------------------------------------------------------------*/
  // data update

  tableColumnCliente = [
    { label: 'Identificador', def: 'IdCliente', dataKey: 'codCliente' },
    { label: 'Cedula', def: 'Cedula', dataKey: 'cedula' },
    { label: 'Nombre', def: 'Nombre', dataKey: 'nombres' },
    { label: 'Apellido', def: 'Apellido', dataKey: 'apellidos' },
    { label: 'Direccion', def: 'Direccion', dataKey: 'direccion' }
  ]

  formUpdateData: FormGroup = this.formBuilder.group(
    {
      'cliente': [, Validators.required],
      'fechaExamen': [, Validators.required],
      'ojoIzq': [, Validators.required],
      'ojoDer': [, Validators.required],
      'descLenteIzq': [, Validators.required],
      'descLenteDer': [, Validators.required]
    }
  )

  getTableDataUpdate(data: any) {
    this.dataUpdate = data
    if (data) {
      let examenVista = this.examenVistaList.find(e => e.numExamen == data.numExamen)
      let cliente = this.clienteList.find(e => e.codCliente == examenVista?.codCliente)
      let fechaExamen = this.fechaExamenList.find(e => e.idFechaExamen == examenVista?.idFechaExamen)

      if (examenVista && cliente && fechaExamen) {
        this.ExamenVista = examenVista
        this.Cliente = cliente
        this.FechaExamen = fechaExamen
      }
    }

  }

  loadConfirmationDataUpdate() {
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
        this.saveDataUpdate()
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

  saveDataUpdate() {
    let fecha = this.fechaExamenList.find(e => e.idFechaExamen == this.FechaExamen.idFechaExamen)

    // let id: number = 0
    // if (fecha) {
    //   id = fecha.idFechaExamen
    // } else {
    //   let f = {
    //     fechaExamen: new Date()
    //   }

    //   this.dataService.postData('fechaexamen', f).then((success) => {
    //     if (success) {
    //       id = this.fechaExamenList.length + 2
    //     } else {
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Ups...',
    //         text: 'Algo salió mal!',
    //         footer: '<a href="">¿Por qué tengo este problema??</a>'
    //       })

    //       return
    //     }
    //   })
    // }


    let data = {
      codCliente: this.Cliente.codCliente,
      idFechaExamen: this.ExamenVista.idFechaExamen,
      ojoIzquierdo: this.ExamenVista.ojoIzquierdo,
      ojoDerecho: this.ExamenVista.ojoDerecho,
      descripLenteIzq: this.ExamenVista.descripLenteIzq,
      descripLenteDer: this.ExamenVista.descripLenteDer,
      numExamen: this.ExamenVista.numExamen
    }

    this.dataService.updateData('examenvista', data, this.ExamenVista.numExamen).then((success) => {
      if (success) {
        Swal.fire(
          'Exito!',
          'La informacion a sido actualizado con exito',
          'success'
        )
        this.setResetData()
        //aaqui reiniciar los datos
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
        this.setResetData()
        // this.resetData()
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

  formGetDataUpdate(fr: string) {
    return this.formUpdateData.get(fr) as FormControl;
  }

  resultTableUpdateList(data: any) {
    this.Cliente = data

    this.cancelDialogResult()
  }

  cancelDialogResult() {
    this.matDialogRef.close()
  }

  /*---------------------------------------------------------------------------------*/
  // crear data


  formCreateData: FormGroup = this.formBuilder.group(
    {
      'cliente': ['', Validators.required],
      'fechaExamen': ['', Validators.required],
      'ojoIzq': ['', Validators.required],
      'ojoDer': ['', Validators.required],
      'descLenteIzq': ['', Validators.required],
      'descLenteDer': ['', Validators.required]
    }
  )

  setDataCreate(){
    this.FechaExamen ={
      idFechaExamen: 0,
      fechaExamen: new Intl.DateTimeFormat('es', this.opcionesFormato).format(new Date())
    }
  }
  
  formGetDataCreate(fr: string) {
    return this.formCreateData.get(fr) as FormControl;
  }

  setResetData(){

    this.dataUpdate = undefined

    this.ExamenVista = {
      numExamen: 0,
      codCliente: 0,
      idFechaExamen: 0,
      ojoIzquierdo: 0,
      ojoDerecho: 0,
      descripLenteIzq: '',
      descripLenteDer: ''
    }
  
    this.FechaExamen = {
      idFechaExamen: 0,
      fechaExamen: ''
    }
  
    this.Cliente = {
      codCliente: 0,
      cedula: '',
      nombres: '',
      apellidos: '',
      direccion: ''
    }
  }

  loadConfirmationDataCreate() {
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
        this.saveDataCreate()
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

  saveDataCreate(){
    let cliente = this.clienteList.find(e => e.codCliente == this.Cliente.codCliente)

    let fecha1 = new Date();
    fecha1.setHours(0,0,0,0)

    let fecha = this.fechaExamenList.find(e => new Date(e.fechaExamen).toString() == fecha1.toString())

    let tamano = -1
    if(!fecha){
      console.log('nueva fecha')
      const numeros = this.fechaExamenList.map(objeto => objeto.idFechaExamen);
      let dataV = Math.max(...numeros) + 1
      // tamano = this.fechaExamenList.length + 2

      let fechaExamen ={
        FechaExamen : fecha1
      }
      this.dataService.postData('fechaexamen',fechaExamen)
    }


    if(cliente){

      console.log('cliente viejo')
      let examenVista = {
        codCliente: this.Cliente.codCliente,
        idFechaExamen: tamano == -1? fecha?.idFechaExamen : tamano,
        ojoIzquierdo: this.ExamenVista.ojoIzquierdo,
        ojoDerecho: this.ExamenVista.ojoDerecho,
        descripLenteIzq: this.ExamenVista.descripLenteIzq,
        descripLenteDer: this.ExamenVista.descripLenteDer
      }

      this.dataService.postData('examenvista', examenVista).then((success)=>{
        if(success){
          Swal.fire(
            'Exito!',
            'La informacion a sido actualizado con exito',
            'success'
          )
          

          Swal.fire({
            title: 'Confirmar',
            text: '¿Desea agendar un peido?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Agendar',
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

              const numeros = this.examenVistaList.map(objeto => objeto.numExamen);
              let dataV = Math.max(...numeros) + 1

              let examenVista = {
                numExamen: dataV,
                codCliente: this.Cliente.codCliente,
                idFechaExamen: tamano == -1? fecha?.idFechaExamen : tamano,
                ojoIzquierdo: this.ExamenVista.ojoIzquierdo,
                ojoDerecho: this.ExamenVista.ojoDerecho,
                descripLenteIzq: this.ExamenVista.descripLenteIzq,
                descripLenteDer: this.ExamenVista.descripLenteDer
              }

              this.sendDataOrdenPedido(examenVista)
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelado',
                'Todo bien :)',
                'error'
              )
            }
          });

          this.setResetData()
          this.formCreateData.reset()

        }else{
          Swal.fire({
            icon: 'error',
            title: 'Ups...',
            text: 'Algo salió mal!',
            footer: '<a href="">¿Por qué tengo este problema??</a>'
          })
        }
      })
    }else{
      console.log('cliente nuevo')

      let c = {
        cedula: this.Cliente.cedula,
        nombres: this.Cliente.nombres,
        apellidos: this.Cliente.apellidos,
        direccion: this.Cliente.direccion
      }
      this.dataService.postData('cliente',c).then((success) => {
        if(success){
          const numeros = this.clienteList.map(objeto => objeto.codCliente);
          let dataV = Math.max(...numeros) + 1
          // let tamC = this.clienteList.length + 2
          let examenVista = {
            codCliente: dataV,
            idFechaExamen: tamano == -1? fecha?.idFechaExamen : tamano,
            ojoIzquierdo: this.ExamenVista.ojoIzquierdo,
            ojoDerecho: this.ExamenVista.ojoDerecho,
            descripLenteIzq: this.ExamenVista.descripLenteIzq,
            descripLenteDer: this.ExamenVista.descripLenteDer
          }
          this.dataService.postData('examenvista',examenVista).then((success) => {
            if(success){
              Swal.fire(
                'Exito!',
                'La informacion a sido actualizado con exito',
                'success'
              )

              Swal.fire({
                title: 'Confirmar',
                text: '¿Desea agendar un peido?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Agendar',
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
    
                  const numeros = this.examenVistaList.map(objeto => objeto.numExamen);
                  let dataV = Math.max(...numeros) + 1
    
                  let examenVista = {
                    numExamen: dataV,
                    codCliente: this.Cliente.codCliente,
                    idFechaExamen: tamano == -1? fecha?.idFechaExamen : tamano,
                    ojoIzquierdo: this.ExamenVista.ojoIzquierdo,
                    ojoDerecho: this.ExamenVista.ojoDerecho,
                    descripLenteIzq: this.ExamenVista.descripLenteIzq,
                    descripLenteDer: this.ExamenVista.descripLenteDer
                  }
    
                  this.sendDataOrdenPedido(examenVista)
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  Swal.fire(
                    'Cancelado',
                    'Todo bien :)',
                    'error'
                  )
                }
              });

              this.setResetData()
              this.formCreateData.reset()
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
      })
    }
  }

  

  sendDataOrdenPedido(parametro: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        objeto: parametro
      }
    };

    this.router.navigate(['orden-pedido'], navigationExtras)
  }



}
