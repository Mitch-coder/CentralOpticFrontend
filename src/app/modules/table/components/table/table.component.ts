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

    // segun un ejemplo que vi eso deberia notificar cada ves que ocurra un cambio
    // en la clase 
    // this.headerSearch.change.subscribe(event =>{  
    //   console.log(event)
    //   this.applyFilter(event)
    // })

    // esto inicializa el filtro cada ves que el componente se vuelve a cargar
    this.applyFilter(HeaderData.headerText)

    

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  selectItem(item:any){
    console.log(item)
    // this.selectItemsCell.emit(item);
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
}
