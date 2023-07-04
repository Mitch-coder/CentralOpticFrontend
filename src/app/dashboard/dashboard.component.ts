import { Component } from '@angular/core';
import { MyDataServices } from '../services/mydata.services';
import { tap, map } from 'rxjs';
import { TableColumn } from '../modules/table/models/table-column';
import { DialogAlertaComponent } from '../modules/dialog-alerta/components/dialog-alerta/dialog-alerta.component';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { CookieService } from 'ngx-cookie-service';
import { NavigationExtras, Router } from '@angular/router';

interface ProductBarras {
  title: string;
  count: number[];
  labels: string[];
}

interface Proveedor {
    nombre:string;
    propietario?:string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})



export class DashboardComponent {

  ProductosMasVendidos: any[] = [];
  DescripcionProductoVendidos: any[] = [];
  DescripcionProductoComprados: any[] = [];
  ProductosMasComprados: any[] = [];

  NombreClienteMasCompras: any[] = [];
  ClienteMasCompra: any[] = [];

  PromedioFacturaporCliente:number=0;
  PromedioExamenporCliente:number=0;
  PromedioProductoporProveedor:number=0;

  ProductBarrasSelling: ProductBarras = {
    title: "",
    count: [],
    labels: [],
  }

  ProductBarrasBuying: ProductBarras = {
    title: "",
    count: [],
    labels: [],
  }

  ClientePieMasCompra: ProductBarras = {
    title: "",
    count: [],
    labels: [],
  }

  ClientePieMasObservado: ProductBarras = {
    title: "",
    count: [],
    labels: [],
  }

  ProveedorRadioMasFrecuente: ProductBarras = {
    title: "",
    count: [],
    labels: [],
  }

  Proveedores:Proveedor[] = []
  

  Nombre: string = "";

  constructor(private dataService: MyDataServices, private cookieService: CookieService, private router:Router) { }

  ngOnInit(): void {
    this.dataService
      .getData('acceso').subscribe((data: any) => {
        this.Nombre = data.nombres + ' ' + data.apellidos;
        //console.log(data)
      }
      );

    this.LoadMostProductsSenlling();
    this.LoadMostProductsBuying();
    this.LoadMostClienteSelling();
    this.LoadMostClienteObserve();
    this.LoadMostProveedorActive();

  }

  showAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!'
    })
  }

  OnclickLogout() {
    //console.log(this.cookieService.get('token'));
    const navigationExtras: NavigationExtras = {
      state: {
        objeto: true
      }
    };
    this.router.navigate(['login'],navigationExtras);
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    console.log(this.ProductosMasVendidos);
  }

  LoadMostProductsSenlling() {

    this.dataService
      .getData('detallefactura').subscribe((data: any[]) => {
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
          codProducto: "Código: " + parseInt(codProducto),
          sumaCantidad: resultado[codProducto]
        }));

        const top10 = arregloSumaCantidad.sort((a, b) => b.sumaCantidad - a.sumaCantidad).slice(0, 10);

        //console.log('Top 10:', top10);

        this.ProductosMasVendidos = top10;

        const top10Num = top10.map(a => a.sumaCantidad)
        const top10label = top10.map(a => a.codProducto)

        this.ProductBarrasSelling.count = top10Num
        this.ProductBarrasSelling.labels = top10label
        this.ProductBarrasSelling.title = "Productos más vendidos"

        this.dataService
          .getData('Producto').subscribe((data: any[]) => {

            //console.log(data);

            const nuevoArreglo = top10.map(objeto1 => {
              const objeto2 = data.find(objeto => "Código: " + parseInt(objeto.codProducto) === objeto1.codProducto);
              if (objeto2) {
                return { codProducto: objeto1.codProducto, descripcion: objeto2.descripcion };
              }
              return { codProducto: objeto1.codProducto, descripcion: null };
            }).map(objeto => objeto);

            //console.log('Arreglo con campos comunes:', nuevoArreglo);
            this.DescripcionProductoVendidos = nuevoArreglo;
          })

      }

      );

  }

  LoadMostProductsBuying() {

    this.dataService
      .getData('proveedorproducto').subscribe((data: any[]) => {
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
          codProducto: "Código: " + parseInt(codProducto),
          sumaCantidad: resultado[codProducto]
        }));

        const top10 = arregloSumaCantidad.sort((a, b) => b.sumaCantidad - a.sumaCantidad).slice(0, 10);

        //console.log('Top 10:', top10);

        this.ProductosMasVendidos = top10;

        const top10Num = top10.map(a => a.sumaCantidad)
        const top10label = top10.map(a => a.codProducto)

        this.ProductBarrasBuying.count = top10Num
        this.ProductBarrasBuying.labels = top10label
        this.ProductBarrasBuying.title = "Productos más comprados"

        this.dataService
          .getData('Producto').subscribe((data: any[]) => {

            //console.log(data);

            const nuevoArreglo = top10.map(objeto1 => {
              const objeto2 = data.find(objeto => "Código: " + parseInt(objeto.codProducto) === objeto1.codProducto);
              if (objeto2) {
                return { codProducto: objeto1.codProducto, descripcion: objeto2.descripcion };
              }
              return { codProducto: objeto1.codProducto, descripcion: null };
            }).map(objeto => objeto);

            //console.log('Arreglo con campos comunes:', nuevoArreglo);
            this.DescripcionProductoComprados = nuevoArreglo;
          })

      }

      );

  }

  LoadMostClienteSelling() {

    this.dataService
      .getData('factura').subscribe((data: any[]) => {
        //console.log(data);

        const Repeticiones = data.reduce((resultado, objeto) => {
          const { codCliente } = objeto;
          const clienteExistente = resultado.find((item: { codCliente: any; }) => item.codCliente === codCliente);

          if (clienteExistente) {
            clienteExistente.repeticiones++;
          } else {
            resultado.push({ codCliente, repeticiones: 1 });
          }

          return resultado;
        }, []);

        //console.log(Repeticiones);

        const sumaRepeticiones = Repeticiones.reduce((acumulador: any, objeto: { repeticiones: any; }) => acumulador + objeto.repeticiones, 0);
        this.PromedioFacturaporCliente = sumaRepeticiones / Repeticiones.length;

        //PromedioFacturaporCliente
        
        // const arregloSumaCantidad = Object.keys(resultado).map((codProducto) => ({
        //   codProducto: "Código: " + parseInt(codProducto),
        //   sumaCantidad: resultado[codProducto]
        // }));

        const top10 = Repeticiones.sort((a: { repeticiones: number; }, b: { repeticiones: number; }) => b.repeticiones - a.repeticiones).slice(0, 7);

        //console.log(top10);


        this.dataService
          .getData('cliente').subscribe((data: any[]) => {

            //console.log(data);

            const nuevoArreglo = top10.map((objeto1: {
              nombre: string;
              apellido: string; codCliente: number;
            }) => {
              const objeto2 = data.find(objeto => objeto.codCliente === objeto1.codCliente);
              if (objeto2) {
                return { nombres: objeto2.nombres, apellidos: objeto2.apellidos };
              }
              return { nombres: null, apellido: null };
            }).map((objeto: any) => objeto);

            // console.log('Arreglo con campos comunes:', nuevoArreglo);
            // console.log(top10);
            this.ClientePieMasCompra.count = top10.map( ( (a: { repeticiones: any; }) => a.repeticiones));
            this.ClientePieMasCompra.labels = nuevoArreglo.map( ((a: { nombres: string; apellidos: string; }) => a.nombres + " " + a.apellidos))
            //console.log(this.ClientePieMasCompra)
            
          })

      }
      );
  }

  LoadMostClienteObserve() {

    this.dataService
      .getData('examenvista').subscribe((data: any[]) => {
        //console.log(data);

        const Repeticiones = data.reduce((resultado, objeto) => {
          const { codCliente } = objeto;
          const clienteExistente = resultado.find((item: { codCliente: any; }) => item.codCliente === codCliente);

          if (clienteExistente) {
            clienteExistente.repeticiones++;
          } else {
            resultado.push({ codCliente, repeticiones: 1 });
          }

          return resultado;
        }, []);
        
        //console.log(Repeticiones);

        const sumaRepeticiones = Repeticiones.reduce((acumulador: any, objeto: { repeticiones: any; }) => acumulador + objeto.repeticiones, 0);
        this.PromedioExamenporCliente = sumaRepeticiones / Repeticiones.length;

        //console.log(this.PromedioExamenporCliente);

        //PromedioFacturaporCliente
        
        const top10 = Repeticiones.sort((a: { repeticiones: number; }, b: { repeticiones: number; }) => b.repeticiones - a.repeticiones).slice(0, 7);

        //console.log(top10);

        this.dataService
          .getData('cliente').subscribe((data: any[]) => {

            //console.log(data);

            const nuevoArreglo = top10.map((objeto1: {
              nombre: string;
              apellido: string; codCliente: number;
            }) => {
              const objeto2 = data.find(objeto => objeto.codCliente === objeto1.codCliente);
              if (objeto2) {
                return { nombres: objeto2.nombres, apellidos: objeto2.apellidos };
              }
              return { nombres: null, apellido: null };
            }).map((objeto: any) => objeto);

            // console.log('Arreglo con campos comunes:', nuevoArreglo);
            // console.log(top10);
            this.ClientePieMasObservado.count = top10.map( ( (a: { repeticiones: any; }) => a.repeticiones));
            this.ClientePieMasObservado.labels = nuevoArreglo.map( ((a: { nombres: string; apellidos: string; }) => a.nombres + " " + a.apellidos))
            console.log(this.ClientePieMasObservado)
            
          })

      }
      );
  }

  LoadMostProveedorActive() {

    this.dataService
      .getData('proveedorproducto').subscribe((data: any[]) => {
        //console.log(data);

        const Repeticiones = data.reduce((resultado, objeto) => {
          const { idProveedor } = objeto;
          const clienteExistente = resultado.find((item: { idProveedor: any; }) => item.idProveedor === idProveedor);

          if (clienteExistente) {
            clienteExistente.repeticiones++;
          } else {
            resultado.push({ idProveedor, repeticiones: 1 });
          }

          return resultado;
        }, []);
        
        console.log(Repeticiones);

        // const sumaRepeticiones = Repeticiones.reduce((acumulador: any, objeto: { repeticiones: any; }) => acumulador + objeto.repeticiones, 0);
        // this.PromedioExamenporCliente = sumaRepeticiones / Repeticiones.length;

        // console.log(this.PromedioExamenporCliente);

        // //PromedioFacturaporCliente
        
        const top10 = Repeticiones.sort((a: { repeticiones: number; }, b: { repeticiones: number; }) => b.repeticiones - a.repeticiones).slice(0, 10);

        console.log(top10);

        this.dataService
          .getData('proveedor').subscribe((data: any[]) => {

            //console.log(data);

            const nuevoArreglo = top10.map((objeto1: {
              nombre: string;
              propietario: string; idProveedor: number;
            }) => {
              const objeto2 = data.find(objeto => objeto.idProveedor === objeto1.idProveedor);
              if (objeto2) {
                return { nombre: objeto2.nombre, propietario: objeto2.propietario };
              }
              return { nombre: null, propietario: null };
            }).map((objeto: any) => objeto);

            console.log('Arreglo con campos comunes:', nuevoArreglo);
            // console.log(top10);
            this.Proveedores = nuevoArreglo;
            this.ProveedorRadioMasFrecuente.count = top10.map( ( (a: { repeticiones: any; }) => a.repeticiones));
            this.ProveedorRadioMasFrecuente.labels = nuevoArreglo.map( ((a: { nombre: string; propietario: string; }) => a.nombre ));
            this.ProveedorRadioMasFrecuente.title = "Numero de veces que se frecuentó";
            //console.log(this.ProveedorRadioMasFrecuente)
            //console.log(this.Proveedores)
            
          })

      }
      );
  }

}
