import { Component, Input, OnInit } from '@angular/core';
import { MyDataServices } from 'src/app/services/mydata.services';
import { tap } from 'rxjs';
import { TableColumn } from '../../models/table-column';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit  {

  dataSource:any = []
  tableDisplayColumns:String[]=[];
  tableColumns: TableColumn[] = []


  @Input() set data(data:any){
      this.dataSource = data;
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
