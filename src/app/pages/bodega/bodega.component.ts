import { Component } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { tap } from 'rxjs';




@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent {
  myData: Array<object> = [] ;
  myData$:any;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{

     this.myData$ = this.dataService
     .getData('bodega')
     .pipe(tap((data) =>{
      console.log(data)
      this.myData = data
     }))

     this.setTableColumns();
  }
  
  setTableColumns(){
    this.tableColumns=[
      {label:'IdBodega', def:'idBodega', dataKey:'idBodega'},
      {label:'Nombre', def:'nombre', dataKey:'nombre'},
      {label:'Telefono', def:'telefono', dataKey:'telefono'},
      {label:'Correo', def:'correo', dataKey:'correo'}
    ]
  }

}
