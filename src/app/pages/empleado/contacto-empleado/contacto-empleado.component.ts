import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { forkJoin, map, tap } from 'rxjs';
import { FormData, FormDataVal } from 'src/app/modules/form/components/form/form-data';
import { HeaderData } from 'src/app/header/header-data';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import Swal from 'sweetalert2';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

interface Empleado {
  numEmpleado: number;
  nombres: string;
  apellidos: string;
  direccion: string;
}



interface TelefonoEmpleado {
  idTelefonoEmpleado: number;
  numEmpleado: number;
  telefono: string;
}

interface CorreoEmpleado {
  idCorreoEmpleado: number;
  numEmpleado: number;
  correo: string;
}

interface Data {
  numEmpleado: number;
  nombre: string;
  apellido: string;
  telefono: string[];
  correo: string[];
}

interface DataV {
  nombre: string;
  apellido: string;
  telefono1: string;
  correo1: string;
  telefono2?: string;
  correo2?: string;
}

@Component({
  selector: 'app-contacto-empleado',
  templateUrl: './contacto-empleado.component.html',
  styleUrls: ['./contacto-empleado.component.css']
})
export class ContactoEmpleadoComponent {
  myData: any
  myData$: any;
  dataUpdate: any = undefined;

  tableColumns: TableColumn[] = []

  formTelefonoEmpleado: FormData[] = []
  formCorreoEmpleado: FormData[] = []

  formEmpleadoUpdate: FormData[] = []

  empleadoList: Empleado[] = []

  telefonoEmpleadoList: TelefonoEmpleado[] = []
  correoEmpleadoList: CorreoEmpleado[] = []

  parametro: any;

  Empleado: Empleado = {
    numEmpleado: 0,
    nombres: '',
    apellidos: '',
    direccion: ''
  }

  TelefonoEmpleado1: TelefonoEmpleado = {
    idTelefonoEmpleado: 0,
    numEmpleado: 0,
    telefono: ''
  }

  TelefonoEmpleado2: TelefonoEmpleado = {
    idTelefonoEmpleado: 0,
    numEmpleado: 0,
    telefono: ''
  }


  CorreoEmpleado1: CorreoEmpleado = {
    idCorreoEmpleado: 0,
    numEmpleado: 0,
    correo: ''
  }

  CorreoEmpleado2: CorreoEmpleado = {
    idCorreoEmpleado: 0,
    numEmpleado: 0,
    correo: ''
  }

  // listCorreo: any[] = []
  // lisTelefono: any[] = []


  constructor(private dataService: MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService) { }

  dataTableValidators = false

  ngOnInit(): void {

    let objeto = history.state.objeto;

    if (objeto) {
      this.EmpleadoCorreo = objeto
      this.EmpleadoTelefono = objeto
      this.dataTableValidators = true
    }

    this.myData$ = forkJoin(
      this.dataService.getData('empleado'),
      this.dataService.getData('telefonoempleado'),
      this.dataService.getData('correoempleado')
    ).pipe(
      map((data: any[]) => {
        this.empleadoList = data[0];
        this.telefonoEmpleadoList = data[1];
        this.correoEmpleadoList = data[2];

        // this.lisTelefono = data[1];
        // this.listCorreo = data[2]

        this.myData = this.empleadoList.map((element) => {
          let correo = this.correoEmpleadoList.filter(e => element.numEmpleado === e.numEmpleado)
          let telefono = this.telefonoEmpleadoList.filter(e => element.numEmpleado === e.numEmpleado)

          return {
            numEmpleado: element.numEmpleado,
            nombre: (element.nombres + ' ' + element.apellidos),
            apellido: element.apellidos,
            telefono: telefono.map(obj => obj.telefono).join(', '),
            correo: correo.map(obj => obj.correo).join(', ')
          }
        })
        // console.log(this.myData)
        return this.myData
      })
    )

    // console.log(this.listCorreo)
    this.setTableColumns()
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Número de Empleado', def: 'NumEmpleado', dataKey: 'numEmpleado' },
      { label: 'Nombre', def: 'Nombre', dataKey: 'nombre' },
      { label: 'Telefono', def: 'telefono', dataKey: 'telefono' },
      { label: 'Correo', def: 'correo', dataKey: 'correo' },
    ]
  }

  getEventBtnClickHeader() {
    if (!HeaderData.eventBtnClick) {
      if (this.EmpleadoCorreoList.length < 1) {
        this.loadDataCreate()
      }
      this.dataUpdate = undefined
    }
    return HeaderData.eventBtnClick;
  }

  resultDataTable(data: any) {
    this.dataUpdate = data
    if (data) {
      let empleado = this.empleadoList.find(e => data.numEmpleado === e.numEmpleado)
      let telefono = this.telefonoEmpleadoList.filter(e => empleado?.numEmpleado === e.numEmpleado)
      let correo = this.correoEmpleadoList.filter(e => empleado?.numEmpleado === e.numEmpleado)
      console.log(correo)
      if (empleado) {
        this.Empleado = empleado
      }

      if (telefono) {
        let t: TelefonoEmpleado = {
          idTelefonoEmpleado: telefono[0].idTelefonoEmpleado,
          numEmpleado: telefono[0].numEmpleado,
          telefono: telefono[0].telefono
        }
        this.TelefonoEmpleado1 = t
        if (telefono.length > 1) {
          let tl: TelefonoEmpleado = {
            idTelefonoEmpleado: telefono[1].idTelefonoEmpleado,
            numEmpleado: telefono[1].numEmpleado,
            telefono: telefono[1].telefono
          }
          this.TelefonoEmpleado2 = tl
        }
      }

      if (correo) {
        let c: CorreoEmpleado = {
          idCorreoEmpleado: correo[0].idCorreoEmpleado,
          numEmpleado: correo[0].numEmpleado,
          correo: correo[0].correo
        }
        this.CorreoEmpleado1 = c


        if (correo.length > 1) {
          let cl: CorreoEmpleado = {
            idCorreoEmpleado: correo[1].idCorreoEmpleado,
            numEmpleado: correo[1].numEmpleado,
            correo: correo[1].correo
          }
          this.CorreoEmpleado2 = cl
        }
      }
    }
  }

  formDataUpdate: FormGroup = this.formBuilder.group(
    {
      'nombres': [this.Empleado.nombres, Validators.required],
      'apellidos': [this.Empleado.apellidos, Validators.required],
      'telefono1':
        [this.TelefonoEmpleado1.telefono, this.TelefonoEmpleado1.idTelefonoEmpleado !== 0 ? Validators.required : Validators.nullValidator],
      'telefono2':
        [this.TelefonoEmpleado2.telefono, this.TelefonoEmpleado2.idTelefonoEmpleado !== 0 ? Validators.required : Validators.nullValidator],
      'correo1':
        [this.CorreoEmpleado1.correo, this.CorreoEmpleado1.idCorreoEmpleado !== 0 ? [Validators.required, Validators.email] : Validators.nullValidator],
      'correo2': [this.CorreoEmpleado2.correo, this.CorreoEmpleado2.idCorreoEmpleado !== 0 ? [Validators.required,Validators.email] : Validators.nullValidator]
    }
  )

  formGetDataUpdate(fr: string) {
    return this.formDataUpdate.get(fr) as FormControl;
  }

  loadConfirmationDataUpdate() {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que desea actualizar la informacion?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'actualizar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.saveDataUpdate()
        // this.formDataUpdate.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'El estado sigue igual :)',
          'error'
        )
      }
    });
  }

  saveDataUpdate() {
    // console.log(this.listCorreo)
    let empleado = this.empleadoList.find(e => this.Empleado.numEmpleado === e.numEmpleado)
    let telefono = this.telefonoEmpleadoList.filter(e => e.numEmpleado === empleado?.numEmpleado)
    let correo = this.correoEmpleadoList.filter(e => empleado?.numEmpleado == e.numEmpleado)
    if (empleado &&
      (empleado.apellidos !== this.Empleado.apellidos || empleado.nombres !== this.Empleado.nombres)) {
      this.dataService.updateData('empleado', this.Empleado, this.Empleado.numEmpleado).then((success) => {
        if (success) {
          Swal.fire(
            'Exito!',
            'Los datos an sido actualizado con exito',
            'success'
          )
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

    if (this.TelefonoEmpleado1.idTelefonoEmpleado !== 0) {
      if (this.TelefonoEmpleado1.telefono !== telefono[0].telefono) {
        this.dataService.updateData('telefonoempleado', this.TelefonoEmpleado1, this.TelefonoEmpleado1.idTelefonoEmpleado).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'El contacto a sido actualizado con exito',
              'success'
            )
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
    }

    if (this.TelefonoEmpleado2.idTelefonoEmpleado !== 0) {
      if (this.TelefonoEmpleado2.telefono !== telefono[1].telefono) {
        this.dataService.updateData('telefonoempleado', this.TelefonoEmpleado2, this.TelefonoEmpleado2.idTelefonoEmpleado).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'El contacto a sido actualizado con exito',
              'success'
            )
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
    }

    if (this.CorreoEmpleado1.idCorreoEmpleado !== 0) {
      if (this.CorreoEmpleado1.correo !== correo[0].correo) {
        this.dataService.updateData('correoempleado', this.CorreoEmpleado1, this.CorreoEmpleado1.idCorreoEmpleado).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'El contacto a sido actualizado con exito',
              'success'
            )
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
    }

    if (this.CorreoEmpleado2.idCorreoEmpleado !== 0) {
      if (this.CorreoEmpleado2.correo !== correo[1].correo) {
        this.dataService.updateData('correoempleado', this.CorreoEmpleado2, this.CorreoEmpleado2.idCorreoEmpleado).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'El contacto a sido actualizado con exito',
              'success'
            )
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
    }
    
    Swal.fire(
      'Exito!',
      'El contacto a sido actualizado con exito',
      'success'
    )
    this.resetData()
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
    this.Empleado = {
      numEmpleado: 0,
      nombres: '',
      apellidos: '',
      direccion: ''
    }

    this.TelefonoEmpleado1 = {
      idTelefonoEmpleado: 0,
      numEmpleado: 0,
      telefono: ''
    }

    this.TelefonoEmpleado2 = {
      idTelefonoEmpleado: 0,
      numEmpleado: 0,
      telefono: ''
    }


    this.CorreoEmpleado1 = {
      idCorreoEmpleado: 0,
      numEmpleado: 0,
      correo: ''
    }

    this.CorreoEmpleado2 = {
      idCorreoEmpleado: 0,
      numEmpleado: 0,
      correo: ''
    }

    this.dataUpdate = undefined
  }


  tableColumnsEmpleado = [
    { label: 'Número de Empleado', def: 'NumEmpleado', dataKey: 'numEmpleado' },
    { label: 'Nombre', def: 'nombres', dataKey: 'nombres' },
    { label: 'Apellido', def: 'apellidos', dataKey: 'apellidos' },
    { label: 'Dirección', def: 'direccion', dataKey: 'direccion' }
  ]

  EmpleadoCorreoList: Empleado[] = []

  EmpleadoTelefonoList: Empleado[] = []

  EmpleadoTelefono: Empleado = {
    numEmpleado: 0,
    nombres: '',
    apellidos: '',
    direccion: ''
  }

  EmpleadoCorreo: Empleado = {
    numEmpleado: 0,
    nombres: '',
    apellidos: '',
    direccion: ''
  }

  formCreateCorreo: FormGroup = this.formBuilder.group(
    {
      'empleado': [this.EmpleadoCorreo, Validators.required],
      'correo': [this.CorreoEmpleado1.correo, [Validators.required,Validators.email]],
    }
  )

  formGetDataCreateCorreo(fr: string) {
    return this.formCreateCorreo.get(fr) as FormControl;
  }

  formCreateTelefono: FormGroup = this.formBuilder.group(
    {
      'empleado': [this.EmpleadoTelefono, Validators.required],
      'telefono': [this.TelefonoEmpleado1.telefono, Validators.required],
    }
  )

  formGetDataCreateTelefono(fr: string) {
    return this.formCreateTelefono.get(fr) as FormControl;
  }

  loadDataCreate() {
    this.EmpleadoCorreoList = this.empleadoList.filter(e => this.correoEmpleadoList.filter(f => f.numEmpleado === e.numEmpleado).length < 2)
    this.EmpleadoTelefonoList = this.empleadoList.filter(e => this.telefonoEmpleadoList.filter(f => f.numEmpleado === e.numEmpleado).length < 2)
    // this.dataTableValidators = false
  }


  resultTableDataCorreo(data: Empleado) {
    if (data) {
      console.log(data)
      this.EmpleadoCorreo = data
      this.cancelDialogResult()
    }
  }

  resultTableDataTelefono(data: Empleado) {
    if (data) {
      this.EmpleadoTelefono = data
      console.log(this.EmpleadoTelefono)
      this.cancelDialogResult()
    }
  }

  loadConfirmationDataCreateTelefono() {
    Swal.fire({
      title: 'Confirmar',
      text: 'Desea agregar el contacto al empleado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.formDataCreateTelefono()
        // this.formDataUpdate.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'El estado sigue igual :)',
          'error'
        )
      }
    });
  }

  formDataCreateTelefono() {
    let data = {
      numEmpleado: this.EmpleadoTelefono.numEmpleado,
      telefono: this.TelefonoEmpleado1.telefono
    }
    console.log(data)
    this.dataService.postData('telefonoempleado', data).then((success) => {
      if (success) {
        Swal.fire(
          'Exito!',
          'El contacto a sido agregado con exito',
          'success'
        )
        this.formCreateTelefono.reset()
        //this.init()
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

  loadConfirmationDataCreateCorreo() {
    Swal.fire({
      title: 'Confirmar',
      text: 'Desea agregar el contacto al empleado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.formDataCreateCorreo()
        // this.formDataUpdate.reset()
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'El estado sigue igual :)',
          'error'
        )
      }
    });
  }

  formDataCreateCorreo() {
    let data = {
      numEmpleado: this.EmpleadoCorreo.numEmpleado,
      correo: this.CorreoEmpleado1.correo
    }

    // console.log(data)

    this.dataService.postData('correoempleado', data).then((success) => {
      if (success) {
        Swal.fire(
          'Exito!',
          'El contacto fue agregado con exito',
          'success'
        )
        this.formCreateCorreo.reset()
        //this.init()
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

  init(){
    this.dataTableValidators = true;
    this.loadDataCreate()
  }

  private matDialogRef!: MatDialogRef<DialogComponent>;

  openDialogWithTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template,
    });

    this.matDialogRef.afterClosed().subscribe((res) => {
    });
  }


  cancelDialogResult() {
    this.matDialogRef.close()
  }

  // loadDataConfirmationUpdate(data: FormGroup) {

  //   console.log(data);
  //   this.swalWithBootstrapButtons.fire({
  //     title: 'Confirmar',
  //     text: '¿Estás seguro que deseas actualizar la informacion?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonText: 'actualizar',
  //     cancelButtonText: 'Cancelar',
  //     reverseButtons: true
  //   }).then((result) => {
  //     if (result.isConfirmed) {

  //       this.dataUpdateDB(data.value)
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       this.swalWithBootstrapButtons.fire(
  //         'Cancelado',
  //         'Los datos siguen a salvo :)',
  //         'error'
  //       )
  //     }
  //   });
  // }

  // swalWithBootstrapButtons = Swal.mixin({
  //   customClass: {
  //     confirmButton: 'btn btn-success',
  //     cancelButton: 'btn btn-danger'
  //   },
  //   buttonsStyling: false
  // })

  

  // dataUpdateDB(data: DataV) {

  //   let empleado = this.empleadoList.filter(e => e.numEmpleado == this.dataUpdate.numEmpleado)
  //   let telefono = this.telefonoEmpleadoList.filter(e => e.numEmpleado == empleado[0].numEmpleado)
  //   let correo = this.correoEmpleadoList.filter(e => e.numEmpleado == empleado[0].numEmpleado)
    
  //   if (data.nombre !== data.nombre.replace(' ' + data.apellido, '')
  //     || data.apellido !== data.apellido) {

  //       empleado[0].nombres = data.nombre;
  //       empleado[0].apellidos = data.apellido

  //     this.dataService.updateData('empleado', empleado[0], empleado[0].numEmpleado)
  //   }

  //   if (data.telefono1 !== telefono[0].telefono) {
  //     let c = {
  //       idTelefonoEmpleado: telefono[0].idTelefonoEmpleado,
  //       numEmpleado: empleado[0].numEmpleado,
  //       telefono: data.telefono1
  //     }

  //     this.dataService.updateData('telefonoempleado', c, c.idTelefonoEmpleado)
  //   }

  //   if (data.telefono2 && data.telefono2 !== telefono[1].telefono) {
  //     let c = {
  //       idTelefonoEmpleado: telefono[1].idTelefonoEmpleado,
  //       numEmpleado: empleado[0].numEmpleado,
  //       telefono: data.telefono2
  //     }

  //     this.dataService.updateData('telefonoempleado', c, c.idTelefonoEmpleado)
  //   }

  //   if (data.correo1 && data.correo1 !== correo[0].correo) {
  //     let c = {
  //       idCorreoEmpleado: correo[0].idCorreoEmpleado,
  //       numEmpleado: empleado[0].numEmpleado,
  //       correo: data.correo1
  //     }

  //     this.dataService.updateData('correoempleado', c, c.idCorreoEmpleado)
  //   }

  //   if (data.correo2 && data.correo2 !== correo[1].correo) {
  //     let c = {
  //       idCorreoEmpleado: correo[1].idCorreoEmpleado,
  //       numEmpleado: empleado[0].numEmpleado,
  //       correo: data.correo2
  //     }

  //     this.dataService.updateData('correoempleado', c, c.idCorreoEmpleado)
  //   }


  //   this.initial()

  //   this.dataUpdate = undefined
  //   // this.initial()

  // }

  

}
