import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { HeaderData, HeaderSearch } from './header-data';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [HeaderSearch]
})
export class HeaderComponent implements OnInit{
  
  // Esta variable se utiliza para hacer la animacion de la barra de buscar 
  canShowSearchAsOverlay = false
  // Al inicio del programa se utiliza para marcar en que opcion (tablas / form) se inicia
  btnClick = 'left';
  btnClickVal = true;

  // Extrae a tiempo real lo que se escriba en el input
  headerText: string = '';

  // se usa para que sea response (no tocar XD)
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  // Para obtener el tamaño la pantalla de windows 
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }


  constructor(private headerSearch : HeaderSearch){
    
  }
  
  ngOnInit(){
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    
  }

  // Cada ves que se da click se cambia el valor de eventBtnclick 
  // esta almacenado en una clase estatica para poder utilizarlo para moverse entre
  // tablas o formularios, tambien se usa para desactivar el buscador
  getEventBtnClick(){
    if(this.btnClick == 'left'){
      HeaderData.eventBtnClick = true;
    }else{
      HeaderData.eventBtnClick = false;
    }
    // console.log(HeaderData.eventBtnClick)
    return HeaderData.eventBtnClick
  }


  // Esta funcion se utiliza para cambiar la ngClass y asi poder hacer los efectos 
  // en los botones
  getBtnClick(name:string):string{
    this.getEventBtnClick()
    if(name==this.btnClick)
      return 'active'
    return 'no-active'
  }

  setBtnClick(name:string):void{
    this.btnClick= name;
  }


  // para modificar clases (no tocar XD)
  getHeadClass():string{
    let styleClass ='';
    if(this.collapsed && this.screenWidth > 834){
      styleClass= 'head-trimmed';
    }else if(!this.collapsed && this.screenWidth<= 835 && this.screenWidth > 0){
      styleClass = 'head-md-screen'
    }
    return styleClass;
  }

  // para modificar clases (no tocar XD)
  checkCanShowSearchAsOverlay(innerWidth:number):void{
    if(innerWidth < 845){
      this.canShowSearchAsOverlay = true;
    }else{
      this.canShowSearchAsOverlay = false;
    }
  }

  // Esta clase se utiliza para obtener los cambios que se efectuan 
  // se usa (keyup) por que eso muestra angular material 
  // te devuelve un evento por cada letra que se escribe :^
  getHeaderText(text:Event){
    // console.log(text)
    // this.headerSearch.setHeaderText(text)
    // this.headerSearch.toggle(text)
    // HeaderData.headerText =text

    HeaderSearch.setMiVariable(text)

  }



  

}