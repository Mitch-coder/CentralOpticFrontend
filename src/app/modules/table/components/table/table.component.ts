import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MyDataServices } from 'src/app/services/mydata.services';
import { tap } from 'rxjs';
import { TableColumn } from '../../models/table-column';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit  {

  dataSource = new MatTableDataSource<any>
  tableDisplayColumns:String[]=[];
  tableColumns: TableColumn[] = []
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Comentario de Jurgen: Pongan la columna de Idcliente tambien

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

  @Output() selectItemsCell: EventEmitter<any>;

  constructor(){
    this.selectItemsCell = new EventEmitter();
  }
  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  selectItem(item:any){
    this.selectItemsCell.emit(item);
  }
    
}
