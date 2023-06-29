import { DataSource } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { TableColumn } from '../../models/table-column';

@Component({
  selector: 'app-table-input',
  templateUrl: './table-input.component.html',
  styleUrls: ['./table-input.component.css']
})
export class TableInputComponent {
  tableDisplayColumns: String[] = [];
  tableColumns: TableColumn[] = [];
  dataSource = new ExampleDataSource([...[]]);

  displayedColumns: string[] = [
    'id',
    'tipoItems',
    'codProducto',
    'descripcion',
    'cantidad',
    'precioUni',
    'action'
  ];

  @Input() set data(data: any[]) {
    // console.log(data)
    if(data.length>0){
      let display = [...data]
      this.dataSource.setData(display)
      console.log(this.dataSource)
    }
  }

  @Input() set columns(columns: TableColumn[]) {
    this.tableColumns = columns
    this.tableDisplayColumns = this.tableColumns.map(col => col.def)
  }

  @Output() editRow:EventEmitter<any>;
  @Output() deleteRow:EventEmitter<any>;


  constructor(){
    this.editRow = new EventEmitter();
    this.deleteRow = new EventEmitter();
  }


  openEditForm(data:any){
    this.editRow.emit(data);
  }

  deleteEmployee(data:any){
    this.deleteRow.emit(data);
  }

}


class ExampleDataSource extends DataSource<any> {
  private _dataStream = new ReplaySubject<any[]>();

  constructor(initialData: any[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<any[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: any[]) {
    this._dataStream.next(data);
  }
}
