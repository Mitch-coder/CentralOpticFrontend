import { Component } from '@angular/core';
import { MyDataServices } from '../services/mydata.services';
import { HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  myData:any;
  myData$:any;

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{
     this.myData$ = this.dataService
     .getData()
     .pipe(tap((data) =>(this.myData = data)))
  }


}
