import { Component, TemplateRef } from '@angular/core';
import { TableColumn } from 'src/app/modules/table/models/table-column';
import { MyDataServices } from 'src/app/services/mydata.services';
import { tap } from 'rxjs';
import { DialogComponent } from '../../modules/dialog/components/dialog/dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogService } from '../../services/dialog/dialog.service';


@Component({
  selector: 'app-laboratorio',
  templateUrl: './laboratorio.component.html',
  styleUrls: ['./laboratorio.component.css']
})
export class LaboratorioComponent {
  
  myData: Array<object> = [] ;
  myData$:any;

  formGroup: FormGroup = new FormGroup({
    name: new FormControl(),
    lastname: new FormControl(),
  });

  private matDialogRef!: MatDialogRef<DialogComponent>;

  tableColumns: TableColumn[] =[]

  constructor(private dataService:MyDataServices, private dialogService: DialogService){}
  ngOnInit(): void{

    this.myData$ = this.dataService
    .getData('laboratorio')
    .pipe(tap((data) =>{
     console.log(data)
     this.myData = data
    }))

    this.setTableColumns();
 }
 
 setTableColumns(){
   this.tableColumns=[
     {label:'IdLaboratorio', def:'idLaboratorio', dataKey:'idLaboratorio'},
     {label:'Nombre', def:'nombre', dataKey:'nombre'},
     {label:'Correo', def:'correo', dataKey:'correo'},
     {label:'Direccion', def:'direccion', dataKey:'direccion'},
   
   ]
 }

 openDialogWithTemplate(template: TemplateRef<any>) {
  this.matDialogRef = this.dialogService.openDialogWithTemplate({
    template,
  });

  this.matDialogRef.afterClosed().subscribe((res) => {
    console.log('Dialog With Template Close', res);
    this.formGroup.reset();
  });
}

 onSave() {
  console.log(this.formGroup.value);
  this.formGroup.reset();
  this.matDialogRef.close();
}


}
