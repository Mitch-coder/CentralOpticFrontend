import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { map, mergeMap, tap, elementAt } from 'rxjs';
import { forkJoin } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

interface RegistroBodega {
  idRegistro_Bodega: number;
  idBodega: number;
  codProducto: number;
  cantidad: number;
}

interface Bodega {
  idBodega: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
}

interface Producto {
  codProducto: number;
  idMarca: number;
  idNombreProducto: number;
  descripcion: string;
  precioActual: number;
  estadoProducto: boolean
}

interface NombreProducto {
  idNombreProducto: number;
  nombreProducto: string;
}
@Component({
  selector: 'app-registro-bodega',
  templateUrl: './registro-bodega.component.html',
  styleUrls: ['./registro-bodega.component.css']
})
export class RegistroBodegaComponent {
  myData: any[] = [];
  myData$: any;

  tableColumns: TableColumn[] = []

  registroBodegaList: RegistroBodega[] = []
  bodegaList: Bodega[] = []
  productoList: Producto[] = []
  nombreProductoList: NombreProducto[] = []

  RegistroBodega: RegistroBodega = {
    idRegistro_Bodega: 0,
    idBodega: 0,
    codProducto: 0,
    cantidad: 0
  }

  Bodega: Bodega = {
    idBodega: 0,
    nombre: '',
    direccion: '',
    telefono: '',
    correo: ''
  }

  Producto: Producto = {
    codProducto: 0,
    idMarca: 0,
    idNombreProducto: 0,
    descripcion: '',
    precioActual: 0,
    estadoProducto: false
  }

  NombreProducto: NombreProducto = {
    idNombreProducto: 0,
    nombreProducto: ''
  }

  private matDialogRef!: MatDialogRef<DialogComponent>;

  constructor(private dataService: MyDataServices,
    private formBuilder: FormBuilder,
    private dialogService: DialogService) { }


  @ViewChild('darkModeSwitch', { read: ElementRef }) element: ElementRef | undefined;


  // <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d=""></path></g></svg>
  sun = 'M9.172 16.242 12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828z'
  moon = 'M9.999 13.587 7.7 11.292l-1.412 1.416 3.713 3.705 6.706-6.706-1.414-1.414z'

  ngAfterViewInit() {
    if (this.element) {
      this.element.nativeElement.querySelector('.mdc-switch__icon--on').firstChild.setAttribute('d', this.moon);
      this.element.nativeElement.querySelector('.mdc-switch__icon--off').firstChild.setAttribute('d', this.sun);
    }


  }



  ngOnInit(): void {

    this.myData$ = forkJoin(
      this.dataService.getData('registrobodega'),
      this.dataService.getData('bodega'),
      this.dataService.getData('producto'),
      this.dataService.getData('nombreproducto')
    ).pipe(
      map((data: any[]) => {
        this.registroBodegaList = data[0];
        this.bodegaList = data[1];
        this.productoList = data[2];
        this.nombreProductoList = data[3];

        this.myData = this.registroBodegaList.map((element) => {
          let producto = this.productoList.find(e => e.codProducto === element.codProducto)
          let nombreProducto = this.nombreProductoList.find(e => e.idNombreProducto === producto?.idNombreProducto)
          let bodega = this.bodegaList.find(e => e.idBodega == element.idBodega)

          return {
            idRegistroBodega: element.idRegistro_Bodega,
            bodega: bodega?.nombre,
            nombreProducto: nombreProducto?.nombreProducto,
            descripcion: producto?.descripcion,
            cantidad: element.cantidad
          }
        })

        return this.myData
      })
    )

    this.setTableColumns();
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Código de Registro', def: 'idRegistroBodega', dataKey: 'idRegistroBodega' },
      { label: 'Bodega', def: 'bodega', dataKey: 'bodega' },
      { label: 'Nombre del Producto', def: 'nombreProducto', dataKey: 'nombreProducto' },
      { label: 'Descripción del Producto', def: 'descripcion', dataKey: 'descripcion' },
      { label: 'Cantidad', def: 'cantidad', dataKey: 'cantidad' }
    ]
  }

  dataUpdate: any = undefined

  loadDataUpdate(data: any) {
    this.dataUpdate = data
    if (data) {
      let registroBodega = this.registroBodegaList.find(e => e.idRegistro_Bodega === data.idRegistroBodega)
      let bodega = this.bodegaList.find(e => e.idBodega === registroBodega?.idBodega)
      let producto = this.productoList.find(e => e.codProducto === registroBodega?.codProducto)
      let nombre = this.nombreProductoList.find(e => e.idNombreProducto === producto?.idNombreProducto)
      // console.log(registroBodega)
      // console.log(bodega)
      // console.log(producto)
      // console.log(nombre)
      if (registroBodega && bodega && producto && nombre) {
        this.RegistroBodega = {...registroBodega}
        this.Bodega = {...bodega}
        this.Producto = {...producto}
        this.NombreProducto = {...nombre}
        // console.log('entra')
        this.formatBodegaMove()
      }
    }
  }

  BodegaMove: Bodega = {
    idBodega: 0,
    nombre: '',
    direccion: '',
    telefono: '',
    correo: ''
  }

  Cantidad: number = 0;

  Change: boolean = false

  toggleChanged(event: MatSlideToggleChange) {
    this.Change = event.checked
  }

  formUpdateData: FormGroup = this.formBuilder.group(
    {
      'bodega': [this.Bodega.nombre, Validators.required],
      'producto': [this.NombreProducto.nombreProducto, Validators.required],
      'cantidad': [this.RegistroBodega.cantidad, Validators.required],
      'cantidadMove': [this.Cantidad,
      this.Change ? Validators.required : Validators.nullValidator],
      'bodegaMove': [this.BodegaMove.nombre,
      this.Change ? Validators.required : Validators.nullValidator],
    }
  );

  formGetDataUpdate(fr: string) {
    return this.formUpdateData.get(fr) as FormControl;
  }

  formColumnsTableBodega = [
    { label: 'Número de Bodega', def: 'idBodega', dataKey: 'idBodega' },
    { label: 'Nombre', def: 'nombre', dataKey: 'nombre' },
    { label: 'Dirección', def: 'direccion', dataKey: 'direccion' },
    { label: 'Teléfono', def: 'telefono', dataKey: 'telefono' },
    { label: 'Correo', def: 'correo', dataKey: 'correo' }
  ]

  bodegaMoveList: Bodega[] = []

  resulTableBodegaMove(data: any) {
    if (data) {
      this.BodegaMove = data
      console.log(this.BodegaMove)
      this.getD()
      this.cancelDialogResult()
    }
  }

  formatBodegaMove() {
    this.bodegaMoveList = this.bodegaList.filter(e => e.idBodega !== this.Bodega.idBodega)
  }

  @ViewChild('iconMove', { read: ElementRef }) element1: ElementRef | undefined;

  getD() {
    if (this.BodegaMove.idBodega !== 0 && this.element1) {
      // console.log('entra')
      this.element1.nativeElement.classList.add('icon-move');
    }

    // console.log(this.BodegaMove.idBodega)
    // return this.BodegaMove.idBodega ===0?'':'icon-move'
  }

  loadConfirmationDataUpdate() {
    let registroBodega = this.registroBodegaList.find(e => e.idRegistro_Bodega === this.RegistroBodega.idRegistro_Bodega)
    console.log(registroBodega)
    if ((this.RegistroBodega.cantidad !== registroBodega?.cantidad) || (this.Change && this.Cantidad > 0)) {
      if (this.RegistroBodega.cantidad > 0 || this.Change) {
        if(this.BodegaMove.idBodega !== 0 || !this.Change){
          this.saveDataUpdate()
        }else{
          Swal.fire({
            icon: 'error',
            title: '',
            text: 'No se selecciono una bodega destino'
          })
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: '',
          text: 'La cantidad no puede ser negativa'
        })
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'La cantidad es la misma, no se realizara ninguna accion'
      })
    }
  }

  saveDataUpdate(){
    if(this.Change){
      let result = this.RegistroBodega.cantidad - this.Cantidad
      
        if(result==0){
          Swal.fire({
            title: 'Confirmar',
            text: 'La acción dejara sin productos la '+this.Bodega.nombre+'¿Desea proseguir con la acción?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.updateBodegaMove()
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelado',
                'Los datos siguen a salvo:)',
                'error'
              )
            }
          });
        }else if(result<0){
          Swal.fire(
            'Cancelado',
            'Los datos que se intentan mover son mayores a los que posee la bodega '+this.Bodega.nombre,
            'error'
          )
        }else{
          Swal.fire({
            title: 'Confirmar',
            text: '¿Está seguro que desea mover productos a la bodega '+this.BodegaMove.nombre+'?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              this.updateBodegaMove()
            } else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelado',
                'Los datos siguen a salvo:)',
                'error'
              )
            }
          }); 
        }
      
      
    }else{

      if(this.RegistroBodega.cantidad <0 || this.Cantidad <0){
        Swal.fire(
          'Cancelado',
          'No se puede trabajar con estas cantidades',
          'error'
        )
      }else{

        Swal.fire({
          title: 'Confirmar',
          text: '¿Estás seguro que desea actualizar la cantidad de productos de la bodega '+this.Bodega.nombre+'?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.saveDataCantidad()
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Cancelado',
              'Los datos siguen a salvo:)',
              'error'
            )
          }
        });
      }
    }
  }

  updateBodegaMove() {
    let registroBodega = this.registroBodegaList
      .find(e => e.codProducto === this.Producto.codProducto && e.idBodega === this.BodegaMove.idBodega)
    if (registroBodega) {
      registroBodega.cantidad = registroBodega.cantidad + this.Cantidad

      this.dataService.updateData('registrobodega', registroBodega, registroBodega.idRegistro_Bodega).then((success) => {
        if (success) {
          Swal.fire({
            title: 'Exito!',
            text: 'La información ha sido guardada',
            icon: 'success',
            confirmButtonText: 'OK!',
          })
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
    } else {
      let registroBodega = {
        idBodega: this.BodegaMove.idBodega,
        codProducto: this.Producto.codProducto,
        cantidad: this.Cantidad
      }

      this.dataService.postData('registrobodega',registroBodega).then((success) => {
        if (success) {
          Swal.fire({
            title: 'Exito!',
            text: 'La información ha sido guardada',
            icon: 'success',
            confirmButtonText: 'OK!',
          })
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

    this.RegistroBodega.cantidad = this.RegistroBodega.cantidad - this.Cantidad
    this.dataService.updateData('registrobodega', this.RegistroBodega, this.RegistroBodega.idRegistro_Bodega).then((success) => {
      if (success) {
        Swal.fire({
          title: 'Exito!',
          text: 'La información ha sido guardada',
          icon: 'success',
          confirmButtonText: 'OK!',
        })
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

  // falta el html y el guardar cantidad

  saveDataCantidad() {
    // let registroBodega = this.registroBodegaList.find(e => e.idRegistro_Bodega === this.RegistroBodega.idRegistro_Bodega)

    this.dataService.updateData('registrobodega', this.RegistroBodega, this.RegistroBodega.idRegistro_Bodega).then((success) => {
      if (success) {
        Swal.fire({
          title: 'Exito!',
          text: 'La información ha sido guardada',
          icon: 'success',
          confirmButtonText: 'OK!',
        })
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
        // this.dataUpdate = undefined
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

  resetData(){
    this.dataUpdate = undefined

    this.RegistroBodega = {
      idRegistro_Bodega: 0,
      idBodega: 0,
      codProducto: 0,
      cantidad: 0
    }
  
    this.Bodega = {
      idBodega: 0,
      nombre: '',
      direccion: '',
      telefono: '',
      correo: ''
    }
  
    this.Producto = {
      codProducto: 0,
      idMarca: 0,
      idNombreProducto: 0,
      descripcion: '',
      precioActual: 0,
      estadoProducto: false
    }
  
    this.NombreProducto = {
      idNombreProducto: 0,
      nombreProducto: ''
    }

    this.BodegaMove = {
      idBodega: 0,
      nombre: '',
      direccion: '',
      telefono: '',
      correo: ''
    }

    this.bodegaMoveList = []
  }


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
