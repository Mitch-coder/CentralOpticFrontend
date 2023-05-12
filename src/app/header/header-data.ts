import { EventEmitter, Injectable, Output } from "@angular/core";

// pss parametros estaticos :^
export class HeaderData{
    static eventBtnClick = true;
    static headerText:Event;
}


//Esta clase inyectable se supone que es para poder hacer lo que mandar los cambios
// y poder recibirlos los datos
@Injectable()
export class HeaderSearch {
 
//   isOpen:any = true; 
 
  @Output() change: EventEmitter<any> = new EventEmitter();
 
  

  toggle(event : Event) {
    HeaderData.headerText = event;
    // console.log(event)
    // this.isOpen = !this.isOpen;
    this.change.emit(HeaderData.headerText)
  }

}