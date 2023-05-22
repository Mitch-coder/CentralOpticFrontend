import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MyDataServices } from 'src/app/services/mydata.services';
import { tap } from 'rxjs';
import { TableColumn } from '../../models/table-column';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { HeaderData, HeaderSearch } from 'src/app/header/header-data';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  providers: [HeaderSearch]
})
export class TableComponent implements OnInit, AfterViewInit  {

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

  constructor(private headerSearch : HeaderSearch){


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

  /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // toggleAllRows() {
  //   if (this.isAllSelected()) {
  //     this.selection.clear();
  //     this.onSelect();
  //     return;
  //   }

  //   this.selection.select(...this.dataSource.data);
  //   this.onSelect();
  // }

  // /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: any): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
  //     row.position + 1
  //   }`;
  // }

  // onEdit(row: any) {
  //   this.action.emit({ action: TABLE_ACTION.EDIT, row });
  // }

  // onDelete(row: any) {
  //   this.action.emit({ action: TABLE_ACTION.DELETE, row });
  // }


  // Este codigo funciona para filtrar por cualquiera de los campos de la tabla
  // el problema es que no se como hacer para que se ejecute cuando se actualice el input 
  // help!

  // HeaderData es una clase statica que contiene el hearderText que esa variable contiene 
  // lo que se escribe en el input :)

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getActiveClass(active: any): string {
    return active == this.dataUpdate? 'active' : ''; 
  }

  selectItem(item:any){
    this.selectItemsCell.emit(undefined);
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
    console.log(this.dataUpdate)
    this.selectItemsCell.emit(this.dataUpdate);
  }
  
}
