import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProveedorRoutingModule } from './proveedor-routing.module';
import { ContactoProveedorComponent } from './contacto-proveedor/contacto-proveedor.component';
import { ProveedorComponent } from './proveedor.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TableModule } from '../../modules/table/table.module';
import { FormModule } from '../../modules/form/form.module';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ContactoProveedorComponent,
    ProveedorComponent
  ],
  imports: [
    CommonModule,
    ProveedorRoutingModule,
    MatSidenavModule,
    TableModule,
    FormModule,
    ReactiveFormsModule
  ]
})
export class ProveedorModule { }
