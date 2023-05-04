import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Imports for the login page
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './login/login.component'
import {MatIconModule} from '@angular/material/icon';
import { DashboardComponent } from './dashboard/dashboard.component'
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from  '@angular/material/list';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TableModule } from './modules/table/table.module';
import {  MatTableModule } from "@angular/material/table";
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { BodyComponent } from './body/body.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { FacturaComponent } from './pages/factura/factura.component';
import { ExamenVistaComponent } from './pages/examen-vista/examen-vista.component';
import { PagoComponent } from './pages/pago/pago.component';
import { DetalleFacturaComponent } from './pages/detalle-factura/detalle-factura.component';
import { RegistroBodegaComponent } from './pages/registro-bodega/registro-bodega.component';
import { OrdenPedidoEntregaComponent } from './pages/orden-pedido-entrega/orden-pedido-entrega.component';
import { ProveedorProductoComponent } from './pages/proveedor-producto/proveedor-producto.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ClienteComponent } from './pages/cliente/cliente.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    EmpleadoComponent,
    SidenavComponent,
    BodyComponent,
    ProductoComponent,
    FacturaComponent,
    ExamenVistaComponent,
    PagoComponent,
    DetalleFacturaComponent,
    RegistroBodegaComponent,
    OrdenPedidoEntregaComponent,
    ProveedorProductoComponent,
    ClienteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    HttpClientModule,
    MatTableModule,
    TableModule,
    ScrollingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
