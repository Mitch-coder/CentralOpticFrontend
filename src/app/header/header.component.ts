import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  
  canShowSearchAsOverlay = false

  @Input() collapsed = false;
  @Input() screenWidth = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }
  
  ngOnInit(){
    this.checkCanShowSearchAsOverlay(window.innerWidth);
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
