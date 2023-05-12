import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoEmpleadoComponent } from './contacto-empleado/contacto-empleado.component';
import { EmpleadoComponent } from './empleado.component';

const routes: Routes = [
  {
    path: 'info',
    component: EmpleadoComponent
  },
  {
    path :'contacto-empleado',
    component : ContactoEmpleadoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpleadoRoutingModule { }
