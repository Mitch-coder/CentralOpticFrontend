import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { FormData, FormDataVal } from 'src/app/modules/form/components/form/form-data';
import { elementAt, forkJoin, map, tap } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HeaderData } from 'src/app/header/header-data';
import Swal from 'sweetalert2';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';

interface Proveedor{
  idProveedor: number;
  nombre: string;
  propietario: string;
  direccion: string;
}

interface TelefonoProveedor{
  idTelefonoProveedor:number;
  idProveedor:number;
  telefono:string;
}

interface CorreoProveedor{
  idCorreoProveedor:number;
  idProveedor:number;
  correo:string;
}

interface Data{
  idProveedor: number;
  nombre: string;
  telefono:string[];
  correo:string[];
}


@Component({
  selector: 'app-contacto-proveedor',
  templateUrl: './contacto-proveedor.component.html',
  styleUrls: ['./contacto-proveedor.component.css']
})
export class ContactoProveedorComponent {
  myData: any[] = [];
  myData$:any;
  dataUpdate:any = undefined;
 
  tableColumns: TableColumn[] =[]

  formTelefonoCliente:FormData[]=[]
  formCorreoCliente:FormData[]=[]

  formClientUpdate:FormData[] = []

  ProveedorList:Proveedor[] = [];
  TelefonoProveedorList:TelefonoProveedor[] = [];
  CorreoProveedorList:CorreoProveedor[] =[];

  Proveedor:Proveedor = {
    idProveedor: 0,
    nombre: '',
    propietario: '',
    direccion: ''
  }

  TelefonoProveedor1: TelefonoProveedor = {
    idTelefonoProveedor: 0,
    idProveedor: 0,
    telefono: ''
  }

  TelefonoProveedor2: TelefonoProveedor = {
    idTelefonoProveedor: 0,
    idProveedor: 0,
    telefono: ''
  }


  CorreoProveedor1: CorreoProveedor = {
    idCorreoProveedor: 0,
    idProveedor: 0,
    correo: ''
  }

  CorreoProveedor2: CorreoProveedor= {
    idCorreoProveedor: 0,
    idProveedor: 0,
    correo: ''
  }

  constructor(private dataService:MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService){}

  ngOnInit(): void{

    this.myData$ = forkJoin(
      this.dataService.getData('proveedor'),
      this.dataService.getData('telefonoproveedor'),
      this.dataService.getData('correoproveedor')
    ).pipe(
      map((data:any[])=>{
        this.ProveedorList = data[0];
        this.TelefonoProveedorList = data[1];
        this.CorreoProveedorList = data[2];

        this.myData = this.ProveedorList.map((element)=>{
          let telefono = this.TelefonoProveedorList.filter(e=>e.idProveedor === element.idProveedor)
          let correo = this.CorreoProveedorList.filter(e=>e.idProveedor === element.idProveedor)
        
          return{
            idProveedor: element.idProveedor,
            nombre: element.propietario + ' ' + element.nombre,
            telefono : telefono.map(obj => obj.telefono).join(', '),
            correo: correo.map(obj => obj.correo).join(', ')
          }
        })

        // this.setFormTelefonoCliente(this.myData);
        // this.setFormCorreoCliente(this.myData);
        return this.myData
      })


    )

   

    this.setTableColumns();
  }

  setTableColumns(){
    this.tableColumns=[
      {label:'ID', def:'idProveedor', dataKey:'idProveedor'},
      {label:'Nombre', def:'Nombre', dataKey:'nombre'},
      {label:'Telefono', def:'telefono', dataKey:'telefono'},
      {label:'Correo', def:'correo', dataKey:'correo'},
    ]
  }

  getEventBtnClickHeader(){
    if(!HeaderData.eventBtnClick){
      if (this.ProveedorCorreoList.length < 1) {
        this.loadDataCreate()
      }
      this.dataUpdate = undefined
    }
    
    return HeaderData.eventBtnClick;
  }

  setFormUpdate(data:Data){
    this.dataUpdate = data
    if(this.dataUpdate){

      let telefono = this.TelefonoProveedorList.filter(e=>e.idProveedor == data.idProveedor)
      let correo = this.CorreoProveedorList.filter(e=>e.idProveedor === data.idProveedor)
      
      this.formClientUpdate = [{
        label:'Propietario',
        type:'text',
        placeholder:'Nuevo nombre del propietario',
        alert:'El Nombre no puede estar vacio',
        icon:'fa-regular fa-user',
        formControlName:'propietario',
        formValidators:{'propietario':[
          this.ProveedorList.find(e => e.idProveedor == data.idProveedor)?.propietario,[Validators.required]]},
        value:this.ProveedorList.find(e => e.idProveedor == data.idProveedor)?.propietario
      },
      {
        label:'Nombre',
        type:'text',
        placeholder:'Nuevo nombre del proveedor',
        alert:'El nombre no puede estar vacio',
        icon:'fa-solid fa-shop',
        formControlName:'nombre',
        formValidators:{'nombre':[this.ProveedorList.find(e => e.idProveedor == data.idProveedor)?.nombre,[Validators.required]]},
        value:this.ProveedorList.find(e => e.idProveedor == data.idProveedor)?.nombre
      }]
      
      if(telefono){
        this.formClientUpdate.push(
          {
            label:'Telefonos',
            type:'text',
            placeholder:'Telefono 1',
            alert:'El telefono no puede estar vacio',
            icon:'fa-solid fa-mobile-screen',
            formControlName:'telefono1',
            formValidators:{'telefono1':[telefono[0].telefono,[Validators.required,Validators.minLength(8),Validators.maxLength(8)]]},
            value:telefono[0].telefono
          }
        )

        if(telefono.length>1){
          this.formClientUpdate.push(
            {
              label:'',
              type:'text',
              placeholder:'Telefono 2',
              alert:'El telefono no puede estar vacio',
              icon:'fa-solid fa-mobile-screen',
              formControlName:'telefono2',
              formValidators:{'telefono2':[telefono[2].telefono,[Validators.required,Validators.minLength(8),Validators.maxLength(8)]]},
              value:telefono[2].telefono
            }
          )
        }
      }

      if(correo){
        this.formClientUpdate.push(
          {
            label:'Correos',
            type:'email',
            placeholder:'correo 1',
            alert:'El correo no puede estar vacio',
            icon:'fa-regular fa-envelope',
            formControlName:'correo1',
            formValidators:{'correo1':[correo[0].correo,[Validators.required,Validators.email]]},
            value:correo[0].correo
          }
        )

        if(correo.length>1){
          this.formClientUpdate.push(
            {
              label:'',
              type:'email',
              placeholder:'correo 2',
              alert:'El correo no puede estar vacio',
              icon:'fa-regular fa-envelope',
              formControlName:'correo2',
              formValidators:{'correo2':[correo[1].correo,[Validators.required,Validators.email]]},
              value:correo[1].correo
            }
          )
        }
      }
    }
  }

  setTableColumnsProveedor = [
    { label: 'IdProveedor', def: 'idProveedor', dataKey: 'idProveedor' },
    { label: 'Nombre', def: 'nombre', dataKey: 'nombre' },
    { label: 'Propietario', def: 'propietario', dataKey: 'propietario' },
    { label: 'Direccion', def: 'direccion', dataKey: 'direccion' }
  ]

  loadConfirmationDataUpdate(form:FormGroup) {
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
        this.saveDataUpdate(form.value)
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

  saveDataUpdate(data:any) {
    // console.log(this.listCorreo)

    let empleado = this.ProveedorList.find(e => this.dataUpdate.idProveedor === e.idProveedor)
    let telefono = this.TelefonoProveedorList.filter(e => e.idProveedor === empleado?.idProveedor)
    let correo = this.CorreoProveedorList.filter(e => empleado?.idProveedor == e.idProveedor)

    console.log(empleado)
    console.log(telefono[0])
    console.log(data.correo1)
    if (empleado &&
      (empleado.propietario !== data.propietario || empleado.nombre !== data.nombre)) {
        let proveedor={
          idProveedor: empleado.idProveedor,
          nombre: data.nombre,
          propietario: data.propietario,
          direccion: empleado.direccion
      }
      this.dataService.updateData('empleado', proveedor, this.dataUpdate.numEmpleado).then((success) => {
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

    if (data.telefono1) {
      
      if (data.telefono1 !== telefono[0].telefono) {
        let tel:TelefonoProveedor ={
          idTelefonoProveedor: telefono[0].idTelefonoProveedor,
          idProveedor: telefono[0].idProveedor,
          telefono: data.telefono1
        }
        this.dataService.updateData('telefonoempleado', tel , telefono[0].idTelefonoProveedor).then((success) => {
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

    if (data.telefono2) {
      // console.log('sss')
      if (data.telefono2 !== telefono[1].telefono) {
        let tel:TelefonoProveedor ={
          idTelefonoProveedor: telefono[1].idTelefonoProveedor,
          idProveedor: telefono[1].idProveedor,
          telefono: data.telefono2
        }
        this.dataService.updateData('telefonoproveedor', tel, telefono[1].idTelefonoProveedor).then((success) => {
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

    if (data.correo1) {
      if (data.correo1!== correo[0].correo) {
        let cor:CorreoProveedor={
          idCorreoProveedor:correo[0].idCorreoProveedor,
          idProveedor: correo[0].idProveedor,
          correo: data.correo1
        }
        console.log(cor)
        this.dataService.updateData('correoproveedor', cor, correo[0].idCorreoProveedor).then((success) => {
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

    if (data.correo2) {
      if (data.correo2!== correo[1].correo) {
        let cor:CorreoProveedor={
          idCorreoProveedor:correo[1].idCorreoProveedor,
          idProveedor: correo[1].idProveedor,
          correo: data.correo2
        }
        this.dataService.updateData('correoempleado', cor, correo[1].idCorreoProveedor).then((success) => {
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
  }

  resetData(){
    this.dataUpdate = undefined
  }

  ProveedorCorreoList: Proveedor[] = []

  ProveedorTelefonoList: Proveedor[] = []

  ProveedorTelefono:Proveedor ={
    idProveedor: 0,
    nombre: '',
    propietario: '',
    direccion: ''
  }

  ProveedorCorreo:Proveedor={
    idProveedor: 0,
    nombre: '',
    propietario: '',
    direccion: ''
  }

  formCreateCorreo: FormGroup = this.formBuilder.group(
    {
      'Proveedor': [this.ProveedorCorreo, Validators.required],
      'correo': [this.CorreoProveedor1.correo, Validators.required],
    }
  )

  formGetDataCreateCorreo(fr: string) {
    return this.formCreateCorreo.get(fr) as FormControl;
  }

  resultTableDataCorreo(data:any){
    if(data){
      this.ProveedorCorreo = data
      this.cancelDialogResult()
    }
  }

  

  formCreateTelefono: FormGroup = this.formBuilder.group(
    {
      'Proveedor': [this.ProveedorTelefono, Validators.required],
      'telefono': [this.TelefonoProveedor1.telefono, Validators.required],
    }
  )

  formGetDataCreateTelefono(fr: string) {
    return this.formCreateTelefono.get(fr) as FormControl;
  }

  resultTableDataTelefono(data:any){
    if(data){
      this.ProveedorTelefono = data
      this.cancelDialogResult()
    }
  }

  loadDataCreate() {
    console.log(this.ProveedorCorreoList)
    this.ProveedorCorreoList = this.ProveedorList.filter(e => this.TelefonoProveedorList.filter(f => f.idProveedor === e.idProveedor).length < 2)
    this.ProveedorTelefonoList = this.ProveedorList.filter(e => this.CorreoProveedorList.filter(f => f.idProveedor === e.idProveedor).length < 2)
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
      idProveedor: this.ProveedorTelefono.idProveedor,
      telefono: this.TelefonoProveedor1.telefono
    }
    console.log(data)
    this.dataService.postData('telefonoproveedor', data).then((success) => {
      if (success) {
        Swal.fire(
          'Exito!',
          'El contacto a sido agregado con exito',
          'success'
        )
        this.formCreateTelefono.reset()
        // this.init()
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
      idProveedor: this.ProveedorCorreo.idProveedor,
      correo: this.CorreoProveedor1.correo
    }
    console.log(data)
    this.dataService.postData('correoproveedor', data).then((success) => {
      if (success) {
        Swal.fire(
          'Exito!',
          'El contacto a sido agregado con exito',
          'success'
        )
        this.formCreateCorreo.reset()
        // this.init()
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



}
