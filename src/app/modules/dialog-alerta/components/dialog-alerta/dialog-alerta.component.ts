import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';
import { DialogService } from 'src/app/services/dialog/dialog.service';

interface Data{
  title:string;
  content:string;
}

@Component({
  selector: 'app-dialog-alerta',
  templateUrl: './dialog-alerta.component.html',
  styleUrls: ['./dialog-alerta.component.css']
})
export class DialogAlertaComponent {
  private matDialogRef!: MatDialogRef<DialogComponent>;

  @ViewChild('accepted', { static: true }) myAccepted!: TemplateRef<any>;

  component:Data = {
    title:'',
    content:''
  }

  constructor( private dialogService: DialogService) { }

  openDialogWithTemplate(template: TemplateRef<any>) {
    this.matDialogRef = this.dialogService.openDialogWithTemplate({
      template, 
    });

    this.matDialogRef.afterClosed().subscribe((res) => {
      console.log('Dialog With Template Close', res);
    });
  }

  openMyAccepted(data?:Data){
    if(data){
          }
    this.openDialogWithTemplate(this.myAccepted)
  }

  closeDialogTemplate(){
    this.matDialogRef.close()
  }

}
