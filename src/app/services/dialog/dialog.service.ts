import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/modules/dialog/components/dialog/dialog.component';
import { DialogTamplateData } from 'src/app/modules/dialog/models/dialog-data';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private matDialog: MatDialog) { }

  openDialogWithTemplate(data: DialogTamplateData) {
    return this.matDialog.open(DialogComponent, { data, width:'calc(45%)' });
  }
}
