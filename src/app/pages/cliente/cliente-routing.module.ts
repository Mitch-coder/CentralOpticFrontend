import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './cliente.component';
import { FacturaComponent } from '../factura/factura.component';
import { ContactoClienteComponent } from './contacto-cliente/contacto-cliente.component';

const routes: Routes = [
  {
    path: 'info',
    component: ClienteComponent
  },{
    path :'contacto-cliente',
    component : ContactoClienteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
