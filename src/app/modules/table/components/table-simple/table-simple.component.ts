import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from '../../models/table-column';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { tap } from 'rxjs';
import { HeaderSearch } from 'src/app/header/header-data';

@Component({
  selector: 'app-table-simple',
  templateUrl: './table-simple.component.html',
  styleUrls: ['./table-simple.component.css']
})
export class TableSimpleComponent {
  dataSource = new MatTableDataSource<any>
  tableDisplayColumns:String[]=[];
  tableColumns: TableColumn[] = []
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataUpdate:any = {}
  btnClickItemRow:boolean = true;
  
  selection = new SelectionModel<any>(true, []);

  onSelect() {
    // this.select.emit(this.selection.selected);
  }


  //Comentario de Jurgen: Pongan la columna de Idcliente tambien

  @Input() set data(data:any){
    this.dataSource.data = data
    // data.pipe(
    //   tap((data: any[]) => {
    //     this.dataSource.data = data; 
    //   })
    // ).subscribe();
  }
  
  @Input() set columns(columns:TableColumn[]){
    this.tableColumns= columns
    this.tableDisplayColumns = this.tableColumns.map(col => col.def)
  }



  @Output() selectItemsCell: EventEmitter<any>;
  @Output() cancelTable:EventEmitter<any>;

  constructor(){
    this.cancelTable = new EventEmitter();
    this.selectItemsCell = new EventEmitter();
  }
  ngOnInit(): void {

    HeaderSearch.observadores.push(
      this.applyFilter.bind(this)
    )
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  
   
  getTypeData(data:any):boolean{
    if (typeof data === "object") {
      return true;
    }
    return false;
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getActiveClass(active: any): string {
    return active == this.dataUpdate? 'active' : ''; 
  }

  selectItem(item:any){
    // this.selectItemsCell.emit(undefined);
    if(item == this.dataUpdate){
      this.btnClickItemRow = true;
      this.dataUpdate = undefined
      this.selectItemsCell.emit(this.dataUpdate);
      return
    }
    this.btnClickItemRow = false;
    this.dataUpdate=item
    // this.selectItemsCell.emit(item);
  }

  btnClickUpdate(){
    // console.log(this.dataUpdate)
    this.selectItemsCell.emit(this.dataUpdate);
  }

  btnClickCancel(){
    this.cancelTable.emit(false);
  }
}
