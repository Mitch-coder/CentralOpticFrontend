import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { TableColumn } from '../../models/table-column';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { tap } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  dataSource = new MatTableDataSource<any>
  tableDisplayColumns:String[]=[];
  tableColumns: TableColumn[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  @Input() set data(data:any){
    data.pipe(
      tap((data: any[]) => {
        this.dataSource.data = data; 
      })
    ).subscribe();
  }
  
  @Input() set columns(columns:TableColumn[]){
    this.tableColumns= columns
    this.tableDisplayColumns = this.tableColumns.map(col => col.def)
  }

  constructor(){}
  ngOnInit(): void {}
    
}
