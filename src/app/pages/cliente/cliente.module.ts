import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteComponent } from './cliente.component';
import { Routes } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { TableModule } from '../../modules/table/table.module';
import { FormModule } from '../../modules/form/form.module';
import { ContactoClienteComponent } from './contacto-cliente/contacto-cliente.component';

// const routes:Routes = [
//   {
//     path: 'informacion',
//     component: ClienteComponent
//   }
// ]

@NgModule({
  declarations: [
    ClienteComponent,
    ContactoClienteComponent
  ],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    MatSidenavModule,
    TableModule,
    FormModule
  ]
})
export class ClienteModule { }
