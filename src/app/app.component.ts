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
    if(this.router.url=='/login'){
      return false
    }
    return true
  } 

  onHeaderDesactive():boolean{
    if(this.router.url=='/login' || this.router.url=='/dashboard'){
      return false
    }
    return true
  }
  
  onToggleSideNav(data:SideNavToggle):void{
    this.isSidaNavCollapsed = data.collapsed
    this.screenWidth = data.screenWidth
  }

  

  changeTitle(){
    this.title = ", world!"
  }
}
