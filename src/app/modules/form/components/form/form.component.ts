import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  constructor(private formBuilder:FormBuilder){
    this.formData = new EventEmitter();
    this.form = formBuilder.group({});
  }

  form: FormGroup;

  @Input() set FormD(form_data:any){
    this.form = this.formBuilder.group(form_data);
  }

  formGet(formName:string){
    return this.form.get(formName) as FormControl;
  }

  @Output() formData:EventEmitter<any>;


}
