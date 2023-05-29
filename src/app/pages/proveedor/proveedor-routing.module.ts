import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedorComponent } from './proveedor.component';
import { ContactoProveedorComponent } from './contacto-proveedor/contacto-proveedor.component';

const routes: Routes = [
  {
    path: 'info',
    component: ProveedorComponent
  },{
    path :'contacto-proveedor',
    component : ContactoProveedorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedorRoutingModule { }
