import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { navbarData } from './nav-data';

interface SideNavToggle{
  screenwhitdh:number;
  collapsed:boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed=false;
  screenWidth = 0;
  navData = navbarData;
  
  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }
  toggleCollapse():void{
    this.collapsed = !this.collapsed
    this.onToggleSideNav.emit({collapsed:this.collapsed , screenwhitdh: this.screenWidth})
  }

  closeSidenav():void{
    this.collapsed =false;
  }

}
