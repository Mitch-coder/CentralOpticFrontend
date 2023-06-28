import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import {  MatTableModule } from "@angular/material/table";
import { MatPaginatorModule} from '@angular/material/paginator'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableSimpleComponent } from './components/table-simple/table-simple.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableInputComponent } from './components/table-input/table-input.component';
import { MatIconModule} from '@angular/material/icon';
@NgModule({
  declarations: [
    TableComponent,
    TableSimpleComponent,
    TableInputComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  exports:[TableComponent,TableSimpleComponent,TableInputComponent]
})
export class TableModule { }
