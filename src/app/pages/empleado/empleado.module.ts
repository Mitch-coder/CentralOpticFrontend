import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadoRoutingModule } from './empleado-routing.module';
import { ContactoEmpleadoComponent } from './contacto-empleado/contacto-empleado.component';
import { EmpleadoComponent } from './empleado.component';

import {MatSidenavModule} from '@angular/material/sidenav';
import { TableModule } from '../../modules/table/table.module';
import { FormModule } from '../../modules/form/form.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EmpleadoComponent,
    ContactoEmpleadoComponent
  ],
  imports: [
    CommonModule,
    EmpleadoRoutingModule,
    MatSidenavModule,
    TableModule,
    FormModule,
    ReactiveFormsModule
  ]
})
export class EmpleadoModule { }
