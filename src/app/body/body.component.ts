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
    if(this.screenWidth == 0 && this.router.url=='/login'){
      styleClass='body-full'
    }
    else if(this.collapsed && this.screenWidth > 834){
      styleClass= 'body-trimmed';
    }else if(!this.collapsed && this.screenWidth<= 835 && this.screenWidth > 0){
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }

  
}


/*
  Cliente --hecho
  ExamenVista --hecho
  Empleado --hecho
  Factura --hecho
  Pago --hecho

  DetalleFactura --hecho
  Producto --hecho
  Registro bodega --hecho
  Proveedor_Producto

  Bodega -mitch
  Proveedor -mitch
  Laboratorio -mitch
  OrdenPedido -mitch
  Entrega -mitch
  
  OrdenPedido_Entrega --hecho
*/
