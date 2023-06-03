import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Imports for the login page
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule} from '@angular/forms';
import { LoginComponent } from './login/login.component'
import { MatIconModule} from '@angular/material/icon';
import { DashboardComponent } from './dashboard/dashboard.component'
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatSidenavModule} from '@angular/material/sidenav';
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
import { FormModule} from './modules/form/form.module';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';
import { HeaderComponent } from './header/header.component'
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule} from '@angular/cdk/menu'
import { FormsModule} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BodegaComponent } from './pages/bodega/bodega.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { LaboratorioComponent } from './pages/laboratorio/laboratorio.component';
import { EntregaComponent } from './pages/entrega/entrega.component';
import { OrdenPedidoComponent } from './pages/orden-pedido/orden-pedido.component'
import { MatSelectModule } from '@angular/material/select';
import { DialogComponent } from './modules/dialog/components/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';


//datapicker
import { MatDatepickerModule} from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { HelpComponent } from './pages/help/help.component';
// import { MatMomentDateModule } from '@angular/material-moment-adapter';
// import moment from 'moment';
import { MomentModule } from 'ngx-moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

// import {moment} from 'moment/moment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
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
    SublevelMenuComponent,
    HeaderComponent,
    BodegaComponent,
    LaboratorioComponent,
    EntregaComponent,
    OrdenPedidoComponent,
    DialogComponent,
    HelpComponent
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
    ScrollingModule,
    FormModule,
    OverlayModule,
    CdkMenuModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MomentModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: 'LL',
        },
        display: {
          // year: 'numeric',
          // month: 'long',
          // day: '2-digit'
          dateInput: 'DD [de] MMMM [de] YYYY',
          monthYearLabel: 'YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'YYYY',
        },
      },
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
