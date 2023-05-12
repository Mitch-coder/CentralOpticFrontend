import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import {  MatTableModule } from "@angular/material/table";
import { MatPaginatorModule} from '@angular/material/paginator'
import { MatCheckboxModule } from '@angular/material/checkbox';





@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule
  ],
  exports:[TableComponent]
})
export class TableModule { }
