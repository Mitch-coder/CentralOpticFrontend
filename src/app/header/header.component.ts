import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import {HeaderData} from './header-data'


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  
  canShowSearchAsOverlay = false
  btnClick = 'left';

  @Input() collapsed = false;
  @Input() screenWidth = 0;


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  constructor(){}
  
  ngOnInit(){
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  getEventBtnClick(){
    if(this.btnClick == 'left'){
      HeaderData.eventBtnClick = true;
    }else{
      HeaderData.eventBtnClick = false;
    }
  }

  getBtnClick(name:string):string{
    this.getEventBtnClick()
    if(name==this.btnClick)
      return 'active'
    return 'no-active'
  }

  setBtnClick(name:string):void{
    this.btnClick= name;
  }


  getHeadClass():string{
    let styleClass ='';
    if(this.collapsed && this.screenWidth > 834){
      styleClass= 'head-trimmed';
    }else if(!this.collapsed && this.screenWidth<= 835 && this.screenWidth > 0){
      styleClass = 'head-md-screen'
    }
    return styleClass;
  }

  checkCanShowSearchAsOverlay(innerWidth:number):void{
    if(innerWidth < 845){
      this.canShowSearchAsOverlay = true;
    }else{
      this.canShowSearchAsOverlay = false;
    }
  }
}
