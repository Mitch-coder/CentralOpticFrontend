import { Component } from '@angular/core';
import { MyDataServices } from '../services/mydata.services';
import { tap } from 'rxjs';
import { TableColumn } from '../modules/table/models/table-column';
import { DialogAlertaComponent } from '../modules/dialog-alerta/components/dialog-alerta/dialog-alerta.component';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {
  
  Nombre:string = "";

  constructor(private dataService:MyDataServices){}

  ngOnInit(): void{
    this.dataService
     .getData('acceso').subscribe((data:any) =>{
      this.Nombre = data.nombres + ' ' +  data.apellidos;
      }
     );
  }

  showAlert(){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!'
    })
  }
}
