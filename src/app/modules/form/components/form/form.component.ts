import { Component, EventEmitter, Input, OnInit, Output , ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import {  FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { FormData, FormDataVal } from './form-data';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements AfterViewInit {

  btnDisable:boolean = true
  btnName:string = 'Enviar'
  formVal:FormData[] = [];
  form : FormGroup = this.formBuilder.group({});
  visualSelect : string[] = [] 
  title: string = ''


  @ViewChild('selectVisual') myDiv!: ElementRef;
  

  constructor(private formBuilder:FormBuilder){
    this.formData = new EventEmitter();
    
  }

  @ViewChild('btnEnviar') boton!: ElementRef;
  ngAfterViewInit() {
    if(this.getValitadorts()){
      this.boton.nativeElement.disabled = true;
    }else{
      this.boton.nativeElement.disabled = false;
    }
  }

  @Input() set FormD(form_data:FormData[]){
    this.formVal= form_data
    let val: {}[] = [];
    form_data.forEach(element =>{
      val.push(element.formValidators);
    })

    this.form = this.formBuilder.group(Object.assign({}, ...val));
  }

  @Input() set BtnName(name:string){
    this.btnName = name
  }
  @Input() set Title(title:string){
    this.title = title
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

  getFormData(){
    
    this.formData.emit(this.form.value)
  }

  getValitadorts(){
    return this.form.invalid
  }

  setVisualSelect(select:FormData){
    this.visualSelect.push(select.option?select.option[0]:'')
    return this.visualSelect
  }

  getValueText(fr:FormData){
    return fr.value
  }

  getVisual(option:any){
    console.log(option)
    if(typeof option === 'string'){
      return option
    }
    return option as FormDataVal
  }

  getVisualValitars(option:any){
    if(typeof option === 'string'){
      return true
    }
    return false
  }
}
