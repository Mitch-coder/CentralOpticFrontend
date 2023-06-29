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
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {

  ProductosMasVendidos: any[] = [];
  DescripcionProducto: any[] = [];

  Nombre:string = "";

  constructor(private dataService:MyDataServices, private cookieService: CookieService){}

  ngOnInit(): void{
    this.dataService
     .getData('acceso').subscribe((data:any) =>{
      this.Nombre = data.nombres + ' ' +  data.apellidos;
      }
     );
     
     this.LoadMostProductsSenlling();


  }

  showAlert(){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!'
    })
  }

  OnclickLogout(){
    this.cookieService.delete('token'); 
  }

  scrollToSection(sectionId: string){
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    console.log(this.ProductosMasVendidos);
   }

   LoadMostProductsSenlling(){

    this.dataService
    .getData('detallefactura').subscribe((data:any[]) =>{
     //console.log(data);
       

       const resultado = data.reduce((acumulador, objeto) => {
         const { codProducto, cantidad } = objeto;
         if (!acumulador[codProducto]) {
           acumulador[codProducto] = 0;
         }
         acumulador[codProducto] += cantidad;
         return acumulador;
       }, {});

       const arregloSumaCantidad = Object.keys(resultado).map((codProducto) => ({
         codProducto: parseInt(codProducto),
         sumaCantidad: resultado[codProducto]
       }));

       //console.log('Resultado:', arregloSumaCantidad);

       const top10 = arregloSumaCantidad.sort((a, b) => b.sumaCantidad - a.sumaCantidad).slice(0, 10);

       //console.log('Top 10:', top10);

       this.ProductosMasVendidos=top10;

       this.dataService
       .getData('Producto').subscribe((data:any[]) =>{

        console.log(data);

        const nuevoArreglo = top10.map(objeto1 => {
          const objeto2 = data.find(objeto => objeto.codProducto === objeto1.codProducto);
          if (objeto2) {
            return { codProducto: objeto1.codProducto, descripcion: objeto2.descripcion};
          }
          return { codProducto: objeto1.codProducto, descripcion: null };
        }).map(objeto => objeto);
        
        console.log('Arreglo con campos comunes:', nuevoArreglo);
        this.DescripcionProducto = nuevoArreglo;

       })

     }

    );

   }
   
}
