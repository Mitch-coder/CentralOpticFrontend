import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { FormData } from './form-data';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  constructor(private formBuilder:FormBuilder){
    this.formData = new EventEmitter();
  }

  formVal:FormData[] = [];
  form : FormGroup = this.formBuilder.group({});

  @Input() set FormD(form_data:FormData[]){
    this.formVal= form_data
    let val: {}[] = [];
    form_data.forEach(element =>{
      val.push(element.formValidators);
    })
    this.form = this.formBuilder.group(Object.assign({}, ...val));
  }

  formGet(formName:string){
    return this.form.get(formName) as FormControl;
  }

  formItemsType(itemsType:string):boolean{
    if(itemsType=='select')
      return false;
    return true;
  }

  @Output() formData:EventEmitter<any>;



}
