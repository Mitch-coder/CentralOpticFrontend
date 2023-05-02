import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent {
  

  @Input() collapsed!:boolean;
  @Input() screenWidth!:number;

  
  getBodyClass(): string{
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 834){
      styleClass= 'body-trimmed';
    }else if(!this.collapsed && this.screenWidth<= 835 && this.screenWidth > 0){
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }
}