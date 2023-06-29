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

interface DataV{
  propietario: string;
  nombre: string;
  telefono1:string;
  correo1:string;
  telefono2?:string;
  correo2?:string;
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
            telefono : telefono.map(obj => obj.telefono), //.join(', '),
            correo: correo.map(obj => obj.correo),//.join(', ')
          }
        })

        // this.setFormTelefonoCliente(this.myData);
        // this.setFormCorreoCliente(this.myData);
        return this.myData
      })


    )

   

    this.setTableColumns();
  }

  swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  eventCancelFormUpdate(data: any) {
    this.swalWithBootstrapButtons.fire({
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
        this.swalWithBootstrapButtons.fire(
          'Cancelado',
          'Los datos siguen a salvo :)',
          'error'
        )
      }
    });
  }

  loadDataConfirmationUpdate(data:any){

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
    console.log(data);
    if(this.dataUpdate){

      let telefono = this.TelefonoProveedorList.filter(e=>e.idProveedor == data.idProveedor)
      let correo = this.CorreoProveedorList.filter(e=>e.idProveedor === data.idProveedor)
      
      console.log(telefono);
      console.log(correo);

      this.formClientUpdate = [{
        label:'Propietario',
        type:'text',
        placeholder:'Nuevo nombre del propietario',
        alert:'El Nombre no puede estar vacio',
        icon:'fa-regular fa-user',
        formControlName:'propietario',
        formValidators:{'propietario':[
          this.ProveedorList.find(e => e.idProveedor == data.idProveedor)?.propietario,[Validators.required]]},
        value:this.ProveedorList.find(e => e.idProveedor == data.idProveedor)?.propietario,
        readonly:true
      },
      {
        label:'Nombre',
        type:'text',
        placeholder:'Nuevo nombre del proveedor',
        alert:'El nombre no puede estar vacio',
        icon:'fa-solid fa-shop',
        formControlName:'nombre',
        formValidators:{'nombre':[this.ProveedorList.find(e => e.idProveedor == data.idProveedor)?.nombre,[Validators.required]]},
        value:this.ProveedorList.find(e => e.idProveedor == data.idProveedor)?.nombre,
        readonly:true
      }]
      
      if(data.telefono.length !== 0){
        this.formClientUpdate.push(
          {
            label:'Telefonos',
            type:'text',
            placeholder:'Telefono 1',
            alert:'El telefono no puede estar vacio',
            icon:'fa-solid fa-mobile-screen',
            formControlName:'telefono1',
            formValidators:{'telefono1':[data.telefono[0], [Validators.required, Validators.minLength(8), Validators.maxLength(8)]] },
            value:data.telefono[0]
          }
        )

        if(data.telefono.length>1){
          this.formClientUpdate.push(
            {
              label:'',
              type:'text',
              placeholder:'Telefono 2',
              alert:'El telefono no puede estar vacio',
              icon:'fa-solid fa-mobile-screen',
              formControlName:'telefono2',
              formValidators:{'telefono2':[data.telefono[1], [Validators.required, Validators.minLength(8), Validators.maxLength(8)]] },
              value:data.telefono[1]
            }
          )
        }
      }

      if(data.correo.length !== 0){
        this.formClientUpdate.push(
          {
            label:'Correos',
            type:'email',
            placeholder:'correo 1',
            alert:'El correo no puede estar vacio',
            icon:'fa-regular fa-envelope',
            formControlName:'correo1',
            formValidators:{'correo1':[data.correo[0], [Validators.required, Validators.email]]},
            value:correo[0].correo
          }
        )

        if(data.correo.length>1){
          this.formClientUpdate.push(
            {
              label:'',
              type:'email',
              placeholder:'correo 2',
              alert:'El correo no puede estar vacio',
              icon:'fa-regular fa-envelope',
              formControlName:'correo2',
              formValidators:{'correo2': [data.correo[1], [Validators.required, Validators.email]] },
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

  saveDataUpdate(data:DataV) {
    // console.log(this.listCorreo)

    console.log(data);
    console.log(this.TelefonoProveedorList);

    let empleado = this.ProveedorList.filter(e => this.dataUpdate.idProveedor === e.idProveedor)
    let telefono = this.TelefonoProveedorList.filter(e => e.idProveedor === empleado[0].idProveedor)
    let correo = this.CorreoProveedorList.filter(e => empleado[0].idProveedor === e.idProveedor)

    console.log(empleado)
    console.log(telefono[0])
    console.log(data.correo1)
    if (empleado &&
      (empleado[0].propietario !== data.propietario || empleado[0].nombre !== data.nombre)) {
        let proveedor={
          idProveedor: empleado[0].idProveedor,
          nombre: data.nombre,
          propietario: data.propietario,
          direccion: empleado[0].direccion
      }
      this.dataService.updateData('proveedor', proveedor, empleado[0].idProveedor)
      .then((success) => {
        if (success) {
          Swal.fire(
            'Exito!',
            'Los datos an sido actualizado con exito',
            'success'
          )
          console.log(proveedor);
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
          idProveedor: empleado[0].idProveedor,
          telefono: data.telefono1
        }
        this.dataService.updateData('telefonoproveedor', tel , tel.idProveedor).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'El contacto a sido actualizado con exito',
              'success'
            )
            console.log(data.telefono1);
            
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
          idProveedor: empleado[0].idProveedor,
          telefono: data.telefono2
        }
        this.dataService.updateData('telefonoproveedor', tel, telefono[1].idTelefonoProveedor).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'El contacto a sido actualizado con exito',
              'success'
            )
            console.log(data.telefono2);
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
          idProveedor: empleado[0].idProveedor,
          correo: data.correo1
        }
        console.log(cor)
        this.dataService.updateData('correoproveedor', cor, cor.idCorreoProveedor).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'El contacto a sido actualizado con exito',
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
      if (data.correo2!== correo[1].correo) {
        let cor:CorreoProveedor={
          idCorreoProveedor: correo[1].idCorreoProveedor,
          idProveedor: empleado[0].idProveedor,
          correo: data.correo2
        }
        this.dataService.updateData('correoproveedor', cor, cor.idCorreoProveedor).then((success) => {
          if (success) {
            Swal.fire(
              'Exito!',
              'El contacto a sido actualizado con exito',
              'success'
            )
            console.log(data.correo2);
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
    this.initial()
    this.resetData()
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
      'correo': [this.CorreoProveedor1.correo, [Validators.required, Validators.email]],
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
    console.log(this.ProveedorTelefonoList)

    this.ProveedorCorreoList = this.ProveedorList.filter(e => this.CorreoProveedorList.filter(f => f.idProveedor === e.idProveedor).length < 2)
    this.ProveedorTelefonoList = this.ProveedorList.filter(e => this.TelefonoProveedorList.filter(f => f.idProveedor === e.idProveedor).length < 2)
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
        this.initial()
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
        this.initial()
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


  initial() {
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
            telefono : telefono.map(obj => obj.telefono), //.join(', '),
            correo: correo.map(obj => obj.correo),//.join(', ')
          }
        })

        // this.setFormTelefonoCliente(this.myData);
        // this.setFormCorreoCliente(this.myData);
        return this.myData
      })


    )
  }

}
