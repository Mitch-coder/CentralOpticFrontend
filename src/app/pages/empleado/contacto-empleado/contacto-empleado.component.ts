import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { forkJoin, map, tap } from 'rxjs';
import { FormData, FormDataVal } from 'src/app/modules/form/components/form/form-data';
import { EventBtnClick, HeaderData } from 'src/app/header/header-data';
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
            telefono: telefono.map(obj => obj.telefono),
            correo: correo.map(obj => obj.correo)
          }
        })

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
      { label: 'Teléfono', def: 'telefono', dataKey: 'telefono' },
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

  formClientUpdate: FormData[] = []

  resultDataTable(data: any) {
    this.dataUpdate = data
    if (this.dataUpdate) {
      this.formClientUpdate = [{
        label: 'Nombres',
        type: 'text',
        placeholder: 'Nuevo nombre del empleado',
        alert: 'El Nombre no puede estar vacío',
        icon: '',
        formControlName: 'nombre',
        formValidators: { 'nombre': [data.nombre.replace(' ' + data.apellido, ''), [Validators.required]] },
        value: data.nombre.replace(' ' + data.apellido, ''),
        readonly: true
      },
      {
        label: 'Apellidos',
        type: 'text',
        placeholder: 'Nuevo apellido del empleado',
        alert: 'El Apellido no puede estar vacio',
        icon: '',
        formControlName: 'apellido',
        formValidators: { 'apellido': [data.apellido, [Validators.required]] },
        value: data.apellido,
        readonly: true
      }]

      if (data.telefono.length !== 0) {
        this.formClientUpdate.push(
          {
            label: 'Teléfonos',
            type: 'text',
            placeholder: 'Telefono 1',
            alert: 'El teléfono no puede estar vacío',
            icon: 'fa-solid fa-mobile-screen',
            formControlName: 'telefono1',
            formValidators: { 'telefono1': [data.telefono[0], [Validators.required, Validators.minLength(8), Validators.maxLength(8)]] },
            value: data.telefono[0]
          }
        )

        if (data.telefono.length > 1) {
          this.formClientUpdate.push(
            {
              label: '',
              type: 'text',
              placeholder: 'Teléfono 2',
              alert: 'El teléfono no puede estar vacío',
              icon: 'fa-solid fa-mobile-screen',
              formControlName: 'telefono2',
              formValidators: { 'telefono2': [data.telefono[1], [Validators.required, Validators.minLength(8), Validators.maxLength(8)]] },
              value: data.telefono[1]
            }
          )
        }
      }

      if (data.correo.length !== 0) {
        this.formClientUpdate.push(
          {
            label: 'Correos',
            type: 'email',
            placeholder: 'correo 1',
            alert: 'El correo no puede estar vacío',
            icon: 'fa-regular fa-envelope',
            formControlName: 'correo1',
            formValidators: { 'correo1': [data.correo[0], [Validators.required, Validators.email]] },
            value: data.correo[0]
          }
        )

        if (data.correo.length > 1) {
          this.formClientUpdate.push(
            {
              label: '',
              type: 'email',
              placeholder: 'correo 2',
              alert: 'El correo no puede estar vacío',
              icon: 'fa-regular fa-envelope',
              formControlName: 'correo2',
              formValidators: { 'correo2': [data.correo[1], [Validators.required, Validators.email]] },
              value: data.correo[1]
            }
          )
        }
      }
    }
  }


  loadDataConfirmationUpdate(data: FormGroup) {
    console.log(data);
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro que deseas actualizar la información?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.dataUpdateDB(data.value)
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Los datos siguen a salvo :)',
          'error'
        )
      }
    });
  }

  loadConfirmationDataUpdate(data: FormGroup) {
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
        this.dataUpdateDB(data.value)
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

  dataUpdateDB(data: DataV) {

    let empleado = this.empleadoList.find(e => e.numEmpleado == this.dataUpdate.numEmpleado)
    let telefono = this.telefonoEmpleadoList.filter(e => e.numEmpleado== empleado?.numEmpleado)
    let correo = this.correoEmpleadoList.filter(e => e.numEmpleado == empleado?.numEmpleado)

    

    if (data.telefono1) {
      if (data.telefono1 !== telefono[0].telefono) {
        let c = {
          idTelefonoEmpleado: telefono[0].idTelefonoEmpleado,
          numEmpleado: empleado?.numEmpleado,
          telefono: data.telefono1
        }

        this.dataService.updateData('telefonoempleado', c, c.idTelefonoEmpleado).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'El contacto ha sido actualizado con éxito',
              'success'
            )
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

    if (data.telefono2) {
      if (data.telefono2 && data.telefono2 !== telefono[1].telefono) {
        let c = {
          idTelefonoEmpleado: telefono[1].idTelefonoEmpleado,
          numEmpleado: empleado?.numEmpleado,
          telefono: data.telefono2
        }

        this.dataService.updateData('telefonoempleado', c, c.idTelefonoEmpleado).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'El contacto ha sido actualizado con éxito',
              'success'
            )
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
    if (data.correo1) {
      if (data.correo1 && data.correo1 !== correo[0].correo) {
        let c = {
          idCorreoEmpleado: correo[0].idCorreoEmpleado,
          numEmpleado: empleado?.numEmpleado,
          correo: data.correo1
        }

        this.dataService.updateData('correoempleado', c, c.idCorreoEmpleado).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'El contacto ha sido actualizado con éxito',
              'success'
            )
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
    if (data.correo2) {
      if (data.correo2 && data.correo2 !== correo[1].correo) {
        let c = {
          idCorreoEmpleado: correo[1].idCorreoEmpleado,
          numEmpleado: empleado?.numEmpleado,
          correo: data.correo2
        }

        this.dataService.updateData('correoempleado', c, c.idCorreoEmpleado).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'El contacto ha sido actualizado con éxito',
              'success'
            )
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

    // this.initial()
    this.dataUpdate = undefined
    // this.initial()

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
      'telefono': [this.TelefonoEmpleado1.telefono, [Validators.required,Validators.maxLength(8),Validators.minLength(8)]],
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
      text: '¿Desea agregar el contacto al empleado?',
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
        this.formCreateTelefono.reset();
        EventBtnClick.setMiVariable(true);
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
        this.formCreateCorreo.reset();
        EventBtnClick.setMiVariable(true);
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
