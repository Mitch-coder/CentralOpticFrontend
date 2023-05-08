import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'centralOptic';


  isSidaNavCollapsed = false;
  screenWidth = 0;

 
  constructor(private router: Router ) {
    
    
  }
  ngOnInit(): void {
    
  }

  onNavDesative():boolean{
    let desative:boolean = true
    if(this.router.url=='/login'){
      desative = false;
    }
    return desative
  } 
  
  onToggleSideNav(data:SideNavToggle):void{
    this.isSidaNavCollapsed = data.collapsed
    this.screenWidth = data.screenWidth
  }

  

  changeTitle(){
    this.title = ", world!"
  }
}
