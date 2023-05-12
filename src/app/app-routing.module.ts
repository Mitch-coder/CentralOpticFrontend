import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { UserGuardGuard } from './guards/user-guard.guard';
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { FacturaComponent } from './pages/factura/factura.component';
import { ExamenVistaComponent } from './pages/examen-vista/examen-vista.component';
import { PagoComponent } from './pages/pago/pago.component';
import { DetalleFacturaComponent } from './pages/detalle-factura/detalle-factura.component';
import { RegistroBodegaComponent } from './pages/registro-bodega/registro-bodega.component';
import { OrdenPedidoEntregaComponent } from './pages/orden-pedido-entrega/orden-pedido-entrega.component';
import { ProveedorProductoComponent } from './pages/proveedor-producto/proveedor-producto.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { BodegaComponent } from './pages/bodega/bodega.component';
import { ProveedorComponent } from './pages/proveedor/proveedor.component';
import { LaboratorioComponent } from './pages/laboratorio/laboratorio.component';
import { EntregaComponent } from './pages/entrega/entrega.component';
import { OrdenPedidoComponent } from './pages/orden-pedido/orden-pedido.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [UserGuardGuard] 
  },
  { 
    path: 'cliente',
    loadChildren:() => import('./pages/cliente/cliente.module').then(m => m.ClienteModule),
    // component: ClienteComponent, 
    canActivate:[UserGuardGuard] 
  },
  { 
    path: 'empleado',
    component: EmpleadoComponent, 
    canActivate:[UserGuardGuard] 
  },
  {
    path:'producto',
    component: ProductoComponent,
    canActivate:[UserGuardGuard]
  },
  {
    path:'factura',
    component: FacturaComponent,
    canActivate:[UserGuardGuard]
  },
  {
    path:'examen-vista',
    component: ExamenVistaComponent,
    canActivate:[UserGuardGuard]
  },{
    path:'pago',
    component: PagoComponent,
    canActivate:[UserGuardGuard]
  },
  {
    path:'detalle-factura',
    component: DetalleFacturaComponent,
    canActivate:[UserGuardGuard]
  },
  {
    path:'registro-bodega',
    component: RegistroBodegaComponent,
    canActivate:[UserGuardGuard]
  },
  {
    path:'orden-pedido-entrega',
    component: OrdenPedidoEntregaComponent,
    canActivate:[UserGuardGuard]
  },
  {
    path:'proveedor-producto',
    component: ProveedorProductoComponent,
    canActivate:[UserGuardGuard]
  },
  {
    path:'bodega',
    component: BodegaComponent,
    canActivate:[UserGuardGuard]
  },
  {
    path:'proveedor',
    component: ProveedorComponent,
    canActivate:[UserGuardGuard]
  },
  {
    path:'laboratorio',
    component: LaboratorioComponent,
    canActivate:[UserGuardGuard]
  },
  {
    path:'entrega',
    component: EntregaComponent,
    canActivate:[UserGuardGuard]
  },
  {
    path:'orden-pedido',
    component: OrdenPedidoComponent,
    canActivate:[UserGuardGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
