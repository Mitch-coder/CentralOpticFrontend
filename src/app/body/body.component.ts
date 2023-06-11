import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent {
  

  @Input() collapsed!:boolean;
  @Input() screenWidth!:number;

  constructor(private router: Router){
    
  }
  
  getBodyClass(): string{
    let styleClass = '';
    if(this.screenWidth == 0 && (this.router.url=='/login')){
      styleClass='body-full'
    }else if(this.collapsed && this.screenWidth > 834){
      styleClass= 'body-trimmed'
    }else if(!this.collapsed && this.screenWidth<= 835 && this.screenWidth > 0){
      styleClass = 'body-md-screen' 
    }
    styleClass = styleClass + ' ' + (this.router.url=='/dashboard'?'body-semi-full':'');
    return styleClass;
  }

  
}

/*
  1-agregar la funcionalidad de busqueda por medio de una tabla
  2-agregar y correccion de los formularios 
  3-implementar el guardar y actualizar, con sus mensages de confirmacion y movilizacion de a otras tablas
  4-implementar mensajes de error
  5-implementar una opcion de configuracion (stock minimo, stock maximo, y lo que se me ocurra)
  6-crear tabla configuracion 
  7-implementar graficos
  8-atajos en la pantalla de inicio
  9-nuevas ideas (abajo)
*/


/*
  Cliente --hecho
  ExamenVista --hecho
  Empleado --hecho
  Factura --hecho
  Pago --hecho

  DetalleFactura --hecho
  Producto --hecho
  Registro bodega --hecho
  Proveedor_Producto --hecho

 
  
  OrdenPedido_Entrega --hecho
*/

/*
 Bodega -mitch    
 //Bodega Model
  Proveedor -mitch
  Laboratorio -mitch
  OrdenPedido -mitch //Orden pedido no seria lo mismo que orden pedido entrega
  Entrega -mitch
*/
