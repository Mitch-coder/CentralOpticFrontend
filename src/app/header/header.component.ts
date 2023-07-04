import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventBtnClick, HeaderData, HeaderSearch } from './header-data';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { userItems } from './header-dummy-data';
// import { CdkMenuTrigger } from '@angular/cdk/overlay';
import { MatMenuTrigger } from '@angular/material/menu';

import { CdkMenuTrigger } from '@angular/cdk/menu';
import { NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [HeaderSearch]
})
export class HeaderComponent implements OnInit{


  userItems = userItems;
  iconClassLogout:string = 'fa-solid fa-door-closed';

  
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


  constructor(private headerSearch : HeaderSearch, private cookieService: CookieService, private router: Router){
    
  }
  
  ngOnInit(){
    this.checkCanShowSearchAsOverlay(window.innerWidth);

    EventBtnClick.observadores.push(
      this.getBtnVal.bind(this)
    )

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

  getBtnVal(bool:boolean){
    this.setBtnClick(bool?'left':'rigth')
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
    HeaderSearch.setMiVariable(text)
  }




  
  changeIcon(event: MouseEvent) {
    this.iconClassLogout = 'fa-solid fa-door-open hover-icon';
    console.log(this.iconClassLogout)
  }

  resetIcon(event: MouseEvent) {
    this.iconClassLogout = 'fa-solid fa-door-closed default-icon';
    console.log(this.iconClassLogout)
  }

  isMouseOver: boolean = false;

  changeIcon1(mouseOver: boolean) {
    this.isMouseOver = mouseOver;
  }
  

  //sobreposiciones de botones y solo usa el ngIf para controlar cual se muestrs


  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  isMenuOpen: boolean = false;

  onMenuOpened() {
    this.isMenuOpen = true;
    // Realiza acciones o lógica adicional cuando el menú se abre
  }

  onMenuClosed() {
    this.isMenuOpen = false;
    // Realiza acciones o lógica adicional cuando el menú se cierra
  }


  //Cerrar la sesion de la aplicacion

  OnclickLogout(){
   
    //this.cookieService.delete('token');
    // if(this.cookieService.get('token')){
    //   console.log(this.cookieService.get('token'));
    //   this.cookieService.delete('token');
    //   this.router.navigate(['login']);
    //   console.log(this.cookieService.get('token'));
    // }else{
    //   console.log(this.cookieService.get('token'));
    //   this.router.navigate(['login']);
    //   console.log(this.cookieService.get('token'));
    // }
    // console.log(this.cookieService.get('token'));
    // while(this.cookieService.get('token')){
    //   this.cookieService.delete('token');
    //   console.log(this.cookieService.get('token'));
    // }

    const navigationExtras: NavigationExtras = {
      state: {
        objeto: true
      }
    };
    
    this.router.navigate(['login'],navigationExtras);
     
  }

}